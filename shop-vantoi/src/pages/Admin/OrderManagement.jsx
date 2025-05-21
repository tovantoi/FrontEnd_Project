import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { robotoBase64 } from "../../components/RobotoFont";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDropdownId, setShowDropdownId] = useState(null); // Trạng thái để kiểm soát dropdown

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/get-orders"
      );
      if (!response.ok) throw new Error("Không thể lấy danh sách đơn hàng.");
      const data = await response.json();
      setOrders(data || []); // Đảm bảo orders luôn là mảng
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm chuyển đổi trạng thái từ số sang chữ và màu sắc
  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return { label: "Chờ xác nhận", color: "text-warning" }; // Màu vàng
      case 1:
        return { label: "Đã xác nhận", color: "text-primary" }; // Màu xanh dương
      case 2:
        return { label: "Đang giao hàng", color: "text-info" }; // Màu xanh nhạt
      case 3:
        return { label: "Đã giao hàng", color: "text-success" }; // Màu xanh lá
      case 4:
        return { label: "Đã hủy", color: "text-danger" }; // Màu đỏ
      default:
        return { label: "Không xác định", color: "" };
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const statuses = [
      { value: 0, label: "Pending" },
      { value: 1, label: "Accepted" },
      { value: 2, label: "Shipping" },
      { value: 3, label: "Successed" },
      { value: 4, label: "Canceled" },
    ];

    // Tạo dropdown để chọn trạng thái
    const { value: newStatus } = await Swal.fire({
      title: "Chọn trạng thái mới",
      input: "select",
      inputOptions: statuses.reduce((obj, status) => {
        obj[status.value] = status.label; // Sử dụng giá trị số cho inputOptions
        return obj;
      }, {}),
      showCancelButton: true,
      confirmButtonText: "Cập nhật",
      cancelButtonText: "Hủy",
    });

    if (newStatus !== undefined) {
      try {
        // Gửi yêu cầu cập nhật trạng thái
        const response = await fetch(
          `https://localhost:7022/minimal/api/change-status-order?id=${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: parseInt(newStatus) }), // Chuyển đổi thành số
          }
        );

        if (!response.ok)
          throw new Error("Không thể cập nhật trạng thái đơn hàng.");

        // Cập nhật lại danh sách đơn hàng
        setOrders(
          orders.map((order) =>
            order.id === id ? { ...order, status: parseInt(newStatus) } : order
          )
        );

        await Swal.fire({
          title: "Thành công!",
          text: `Trạng thái đã được cập nhật thành "${
            getStatusLabel(parseInt(newStatus)).label
          }".`,
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (err) {
        await Swal.fire({
          title: "Lỗi!",
          text: err.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };
  const toUpperNonAccentVietnamese = (str) => {
    if (!str) return "";

    str = str.toLowerCase();
    // Bỏ dấu tiếng Việt
    str = str
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
      .replace(/ì|í|ị|ỉ|ĩ/g, "i")
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
      .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
      .replace(/đ/g, "d");

    // In hoa toàn bộ
    return str.toUpperCase();
  };

  const handlePrintInvoice = async (order) => {
    try {
      const res = await fetch(
        `https://localhost:7022/minimal/api/get-order-by-id?id=${order.id}`
      );
      if (!res.ok) throw new Error("Không thể tải chi tiết đơn hàng");

      const data = await res.json();
      const orderDetail = data[0];

      const doc = new jsPDF();
      doc.addFileToVFS("Roboto.ttf", robotoBase64);
      doc.addFont("Roboto.ttf", "Roboto", "normal");
      doc.setFont("Roboto");

      // ===== HEADER =====
      doc.setFillColor(0, 102, 204);
      doc.rect(0, 0, 210, 30, "F");
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text("🛍️ HÓA ĐƠN MUA HÀNG", 105, 18, null, null, "center");

      doc.setFontSize(11);
      doc.text(
        `Mã đơn hàng: #${orderDetail.id}`,
        105,
        26,
        null,
        null,
        "center"
      );

      // ===== THÔNG TIN CỬA HÀNG & KHÁCH HÀNG =====
      const storeX = 14;
      const customerX = 110;
      const yStart = 40;

      const fullName = orderDetail.address?.fullName || "N/A";
      const phone = orderDetail.address?.phone || "N/A";
      const finalAddress = orderDetail.address?.finalAddress || "N/A";

      doc.setFontSize(12);
      doc.setTextColor(0);

      // ➤ Tách dòng thông minh
      const storeAddress = toUpperNonAccentVietnamese(
        "DIA CHI: PHUONG 5, DUONG QUANG DONG, TRA VINH"
      );
      const storeAddressLines = doc.splitTextToSize(storeAddress, 80);

      const cleanAddress = toUpperNonAccentVietnamese(finalAddress);
      const splitAddress = doc.splitTextToSize(cleanAddress, 80);

      // ➤ Tính chiều cao block nền xám
      const maxLines = Math.max(storeAddressLines.length, splitAddress.length);
      const blockHeight = 30 + (maxLines - 1) * 6;

      doc.setFillColor(245, 245, 245);
      doc.rect(10, yStart - 6, 190, blockHeight, "F");

      // ➤ In thông tin cửa hàng
      doc.setFont(undefined, "bold");
      doc.text(toUpperNonAccentVietnamese("FASHION-STORE"), storeX, yStart);
      doc.setFont(undefined, "normal");
      doc.text(toUpperNonAccentVietnamese("SHOP-VANTOI"), storeX, yStart + 6);
      doc.text(storeAddressLines, storeX, yStart + 12);
      doc.text(
        "SDT: 0123-456-789",
        storeX,
        yStart + 12 + storeAddressLines.length * 6
      );

      // ➤ In thông tin khách hàng
      doc.setFont(undefined, "bold");
      doc.text(toUpperNonAccentVietnamese("KHACH HANG"), customerX, yStart);
      doc.setFont(undefined, "normal");
      doc.text(
        toUpperNonAccentVietnamese(`TEN: ${fullName}`),
        customerX,
        yStart + 6
      );
      doc.text(
        toUpperNonAccentVietnamese(`SDT: ${phone}`),
        customerX,
        yStart + 12
      );
      doc.text(toUpperNonAccentVietnamese("DIA CHI:"), customerX, yStart + 18);
      doc.text(splitAddress, customerX, yStart + 24);

      // ===== TABLE =====
      const tableY = yStart + blockHeight + 6;
      autoTable(doc, {
        startY: tableY,
        head: [["Sản phẩm", "Số lượng", "Giá", "Tổng"]],
        body: (orderDetail.orderItems || []).map((item) => {
          const name =
            item.product?.productName ?? item.productName ?? "Không rõ";
          const quantity = item.quantity || 0;
          const price = item.product?.discountPrice ?? item.discountPrice ?? 0;
          const total = quantity * price;
          return [
            name,
            quantity,
            `${price.toLocaleString()} VND`,
            `${total.toLocaleString()} VND`,
          ];
        }),
        theme: "grid",
        styles: {
          font: "Roboto",
          fontSize: 11,
          cellPadding: 4,
          halign: "center",
        },
        headStyles: {
          fillColor: [0, 102, 204],
          textColor: 255,
          fontStyle: "bold",
        },
      });

      // ===== TOTAL + NGÀY IN =====
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.setTextColor(33, 37, 41);
      doc.text(
        toUpperNonAccentVietnamese(
          `TONG TIEN: ${orderDetail.totalPrice.toLocaleString()} VND`
        ),
        14,
        finalY
      );
      doc.setFont(undefined, "normal");
      doc.text(
        toUpperNonAccentVietnamese(
          `NGAY IN: ${new Date().toLocaleDateString("vi-VN")}`
        ),
        14,
        finalY + 6
      );

      // ===== DẤU MỘC & KÝ TÊN =====
      const logoImg = "/assets/red-stamp.png";
      const image = new Image();
      image.src = logoImg;

      image.onload = () => {
        doc.addImage(image, "PNG", 145, finalY + 10, 40, 40);
        doc.setFontSize(12);
        doc.setFont(undefined, "bold");
        doc.text(toUpperNonAccentVietnamese("TO VAN TOI"), 160, finalY + 58);
        doc.line(150, finalY + 62, 190, finalY + 62);
        doc.save(`don_hang_${order.id}.pdf`);
      };

      image.onerror = () => {
        doc.save(`don_hang_${order.id}.pdf`);
      };
    } catch (err) {
      Swal.fire({
        title: "Lỗi!",
        text: err.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleExportToExcel = async (order) => {
    const res = await fetch(
      `https://localhost:7022/minimal/api/get-order-by-id?id=${order.id}`
    );
    const data = await res.json();
    const orderDetail = data[0];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("HOA_DON");

    const fullName = orderDetail.address?.fullName || "N/A";
    const phone = orderDetail.address?.phone || "N/A";
    const finalAddress = orderDetail.address?.finalAddress || "N/A";

    // ===== HEADER =====
    worksheet.mergeCells("A1", "E1");
    const headerCell = worksheet.getCell("A1");
    headerCell.value = "🛍️ HÓA ĐƠN MUA HÀNG";
    headerCell.font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
    headerCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F4E78" },
    };
    headerCell.alignment = { horizontal: "center" };

    // ===== THÔNG TIN CỬA HÀNG & KHÁCH HÀNG =====
    worksheet.getCell("A3").value = "SHOP-VANTOI";
    worksheet.getCell("A4").value =
      "ĐỊA CHỈ: PHƯỜNG 5, ĐƯỜNG QUANG ĐÔNG, TRÀ VINH";
    worksheet.getCell("A5").value = "SDT: 0123-456-789";

    worksheet.getCell("D3").value = "KHÁCH HÀNG";
    worksheet.getCell("D4").value = `TÊN: ${fullName}`;
    worksheet.getCell("D5").value = `SDT: ${phone}`;
    worksheet.getCell("D6").value = `ĐỊA CHỈ: ${finalAddress}`;

    // ===== BẢNG SẢN PHẨM =====
    worksheet.addRow([]);
    worksheet.addRow(["SẢN PHẨM", "SỐ LƯỢNG", "GIÁ", "TỔNG"]);

    const tableHeaderRow = worksheet.getRow(8);
    tableHeaderRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    tableHeaderRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F4E78" },
    };
    tableHeaderRow.alignment = { horizontal: "center" };

    for (const item of orderDetail.orderItems) {
      const name = item.product?.productName ?? item.productName ?? "Không rõ";
      const quantity = item.quantity || 0;
      const price = item.product?.discountPrice ?? item.discountPrice ?? 0;
      const total = quantity * price;
      worksheet.addRow([
        name,
        quantity,
        `${price.toLocaleString()} VND`,
        `${total.toLocaleString()} VND`,
      ]);
    }

    // ===== TỔNG TIỀN & NGÀY IN =====
    const finalRow = worksheet.lastRow.number + 2;
    worksheet.getCell(
      `A${finalRow}`
    ).value = `TỔNG TIỀN: ${orderDetail.totalPrice.toLocaleString()} VND`;
    worksheet.getCell(`A${finalRow}`).font = { bold: true };
    worksheet.getCell(
      `D${finalRow}`
    ).value = `NGÀY IN: ${new Date().toLocaleDateString("vi-VN")}`;
    worksheet.getCell(`D${finalRow}`).font = { bold: true };

    // ===== EXPORT FILE =====
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `hoa_don_${order.id}.xlsx`);
  };

  const handleShowPrintOptions = (order) => {
    Swal.fire({
      title: "Xuất hóa đơn",
      html: "<b>Bạn muốn xuất dưới dạng:</b>",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "PDF",
      denyButtonText: "Excel",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        handlePrintInvoice(order); // Xuất PDF
      } else if (result.isDenied) {
        handleExportToExcel(order); // Xuất Excel
      }
    });
  };

  return (
    <motion.div className="container my-4">
      <motion.div
        className="card shadow-lg p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="product-name-title mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{
            scale: 1.05,
            textShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <center>
            <i className="bi bi-cart-check-fill text-primary me-2"></i>
            QUẢN LÍ ĐƠN HÀNG
          </center>
        </motion.h1>
        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-center">Đang tải...</div>
        ) : (
          <motion.div className="table-responsive">
            <motion.table className="table table-hover align-middle table-bordered">
              <thead className="table-dark">
                <tr className="text-center">
                  <th>ID</th>
                  <th>Ngày đặt</th>
                  <th>Phương thức</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => {
                    const { label, color } = getStatusLabel(order.status);
                    return (
                      <motion.tr key={order.id}>
                        <td className="text-center">{order.id}</td>
                        <td>
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                        <td>{order.payment}</td>
                        <td>{order.totalPrice.toLocaleString()} VND</td>
                        <td className={`fw-bold ${color}`}>{label}</td>
                        <td className="d-flex flex-wrap gap-2 justify-content-center">
                          <button
                            className="btn btn-outline-info btn-sm"
                            onClick={() =>
                              navigate(`/admin/order-detail/${order.id}`)
                            }
                          >
                            <i className="bi bi-eye-fill me-1"></i>Chi tiết
                          </button>
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() => handleShowPrintOptions(order)}
                          >
                            <i className="bi bi-printer-fill me-1"></i>In
                          </button>
                          <button
                            className="btn btn-outline-warning btn-sm"
                            onClick={() =>
                              handleStatusChange(order.id, order.status)
                            }
                          >
                            <i className="bi bi-arrow-repeat me-1"></i>Trạng
                            thái
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Không có đơn hàng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </motion.table>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default OrderManagement;
