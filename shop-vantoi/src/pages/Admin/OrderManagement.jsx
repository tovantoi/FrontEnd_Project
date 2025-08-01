import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { robotoBase64 } from "../../components/RobotoFont";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "../AdminCss/Orders.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDropdownId, setShowDropdownId] = useState(null); // Trạng thái để kiểm soát dropdown
  const [filterStatus, setFilterStatus] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  // ------------- Đếm số lượng đơn theo trạng thái -------------
  const getOrderCountByStatus = (statusKey) => {
    if (statusKey === "all") return orders.length;
    return orders.filter((o) => o.status.toString() === statusKey).length;
  };

  // ------------- Lọc đơn theo trạng thái -------------
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status.toString() === filterStatus);

  // ------------- Lấy danh sách đơn và tự động huỷ đơn quá hạn -------------
  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/get-orders"
      );
      if (!response.ok) throw new Error("Không thể lấy danh sách đơn hàng.");
      let data = await response.json();
      data = data || [];

      // Tìm đơn chờ xác nhận quá 3 ngày
      const now = new Date();
      const expiredOrders = data.filter(
        (o) =>
          o.status === 0 &&
          o.createdAt &&
          (now - new Date(o.createdAt)) / (1000 * 60 * 60 * 24) > 3
      );

      // Nếu có đơn hết hạn -> update status
      for (let expiredOrder of expiredOrders) {
        await fetch(
          `https://localhost:7022/minimal/api/change-status-order?id=${expiredOrder.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: 4 }), // Đã huỷ
          }
        );
      }

      // Reload lại danh sách nếu có đơn hết hạn
      if (expiredOrders.length > 0) {
        const newResponse = await fetch(
          "https://localhost:7022/minimal/api/get-orders"
        );
        data = await newResponse.json();
      }
      setOrders(data || []);
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
      { value: 0, label: "Chờ xác nhận" },
      { value: 1, label: "Đã xác nhận" },
      { value: 2, label: "Đang giao hàng" },
      { value: 3, label: "Đã giao hàng" },
      { value: 4, label: "Đã hủy" },
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

      // ===== HEADER với logo & tên shop =====
      const image = new Image();
      image.src = "/assets/logo.png"; // ảnh nằm trong public

      image.onload = () => {
        doc.addImage(image, "PNG", 10, 6, 25, 25);
        doc.save(`hoa_don_${order.id}.pdf`);
      };

      image.onerror = () => {
        console.error("❌ Không thể load ảnh logo.");
        doc.save(`hoa_don_${order.id}.pdf`);
      };

      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 210, 35, "F");
      doc.addImage(image, "PNG", 10, 6, 25, 25);
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(16);
      doc.text("SHOP VANTOI", 40, 14);
      doc.setFontSize(11);
      doc.text("Địa chỉ: P5, Đường Quang Đông, Trà Vinh", 40, 20);
      doc.text("SĐT: 0123-456-789", 40, 26);

      doc.setFontSize(18);
      doc.setTextColor(0, 102, 204);
      doc.text("HÓA ĐƠN MUA HÀNG", 105, 40, null, null, "center");

      // ===== KHÁCH HÀNG =====
      const fullName = orderDetail.address?.fullName || "N/A";
      const phone = orderDetail.address?.phone || "N/A";
      const finalAddress = orderDetail.address?.finalAddress || "N/A";
      const yStart = 50;

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.setFont(undefined, "bold");
      doc.text("THÔNG TIN KHÁCH HÀNG", 14, yStart);
      doc.setFont(undefined, "normal");
      doc.text(`Họ tên: ${fullName}`, 14, yStart + 6);
      doc.text(`SĐT: ${phone}`, 14, yStart + 12);
      doc.text(`Địa chỉ: ${finalAddress}`, 14, yStart + 18);

      // ===== TABLE SẢN PHẨM =====
      const tableY = yStart + 28;
      autoTable(doc, {
        startY: tableY,
        head: [["Sản phẩm", "Số lượng", "Đơn giá", "Thành tiền"]],
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
          cellPadding: 5,
          halign: "center",
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });

      // ===== TỔNG & NGÀY IN =====
      const finalY = doc.lastAutoTable.finalY + 10;
      const discount = parseFloat(orderDetail.coupon?.discount ?? 0);
      const totalBeforeDiscount = orderDetail.totalPrice + discount;

      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.setTextColor(0);
      doc.text(
        `TỔNG TIỀN (chưa giảm): ${totalBeforeDiscount.toLocaleString()} VND`,
        14,
        finalY
      );

      if (orderDetail.coupon) {
        doc.setFont(undefined, "normal");
        doc.setTextColor(0, 128, 0); // màu xanh lá
        doc.text(
          `Mã giảm giá (${
            orderDetail.coupon.code
          }): -${discount.toLocaleString()} VND`,
          14,
          finalY + 6
        );
      }

      doc.setTextColor(0);
      doc.setFont(undefined, "bold");
      doc.text(
        `TỔNG TIỀN PHẢI TRẢ: ${orderDetail.totalPrice.toLocaleString()} VND`,
        14,
        finalY + (orderDetail.coupon ? 12 : 6)
      );

      // ===== NGÀY IN =====
      doc.setFont(undefined, "normal");
      doc.text(
        `Ngày in: ${new Date().toLocaleDateString("vi-VN")}`,
        14,
        finalY + (orderDetail.coupon ? 18 : 12)
      );

      // ===== CHỮ KÝ =====
      doc.setFont(undefined, "bold");
      doc.text("Người lập hóa đơn", 160, finalY);
      doc.setFont(undefined, "normal");
      doc.line(150, finalY + 20, 190, finalY + 20);
      doc.text("TO VAN TOI", 160, finalY + 26);

      doc.save(`hoa_don_${order.id}.pdf`);
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
    const sheet = workbook.addWorksheet("HOA_DON");

    // ===== HEADER =====
    sheet.mergeCells("A1", "D1");
    const headerCell = sheet.getCell("A1");
    headerCell.value = "🛍️ HÓA ĐƠN MUA HÀNG - SHOP VANTOI";
    headerCell.font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
    headerCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2E86C1" },
    };
    headerCell.alignment = { horizontal: "center" };

    // ===== THÔNG TIN KH =====
    const fullName = orderDetail.address?.fullName || "N/A";
    const phone = orderDetail.address?.phone || "N/A";
    const finalAddress = orderDetail.address?.finalAddress || "N/A";

    sheet.addRow([]);
    sheet.addRow(["Tên KH:", fullName, "SĐT:", phone]);
    sheet.addRow(["Địa chỉ:", finalAddress]);
    sheet.addRow([]);

    // ===== BẢNG SẢN PHẨM =====
    sheet.addRow(["Sản phẩm", "Số lượng", "Đơn giá", "Thành tiền"]);
    const headerRow = sheet.getRow(sheet.lastRow.number);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2E86C1" },
    };

    (orderDetail.orderItems || []).forEach((item) => {
      const name = item.product?.productName ?? item.productName ?? "Không rõ";
      const quantity = item.quantity || 0;
      const price = item.product?.discountPrice ?? item.discountPrice ?? 0;
      const total = quantity * price;
      sheet.addRow([
        name,
        quantity,
        `${price.toLocaleString()} VND`,
        `${total.toLocaleString()} VND`,
      ]);
    });

    // ===== TỔNG & NGÀY =====
    sheet.addRow([]);
    const discount = parseFloat(orderDetail.coupon?.discount ?? 0);
    const beforeDiscount = orderDetail.totalPrice + discount;

    sheet.addRow([
      `TỔNG TIỀN (chưa giảm): ${beforeDiscount.toLocaleString()} VND`,
    ]);
    if (orderDetail.coupon) {
      sheet.addRow([
        `Mã giảm giá (${
          orderDetail.coupon.code
        }): -${discount.toLocaleString()} VND`,
      ]);
    }
    const totalRow = sheet.addRow([
      `TỔNG TIỀN PHẢI TRẢ: ${orderDetail.totalPrice.toLocaleString()} VND`,
    ]);

    totalRow.font = { bold: true };
    sheet.mergeCells(`A${totalRow.number}:D${totalRow.number}`);

    const dateRow = sheet.addRow([
      `NGÀY IN: ${new Date().toLocaleDateString("vi-VN")}`,
    ]);
    sheet.mergeCells(`A${dateRow.number}:D${dateRow.number}`);
    dateRow.font = { italic: true };

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
            <div className="order-status-menu">
              {[
                { label: "Tất cả", value: "all", icon: "bi-list" },
                {
                  label: "Chờ xác nhận",
                  value: "0",
                  icon: "bi-hourglass-split",
                  color: "warning",
                },
                {
                  label: "Đã xác nhận",
                  value: "1",
                  icon: "bi-patch-check",
                  color: "primary",
                },
                {
                  label: "Đang giao hàng",
                  value: "2",
                  icon: "bi-truck",
                  color: "info",
                },
                {
                  label: "Đã giao hàng",
                  value: "3",
                  icon: "bi-box-seam",
                  color: "success",
                },
                {
                  label: "Đã hủy",
                  value: "4",
                  icon: "bi-x-circle",
                  color: "danger",
                },
              ].map((status) => {
                const isActive = filterStatus === status.value;
                const count = getOrderCountByStatus(status.value);
                return (
                  <button
                    key={status.value}
                    className={`status-btn${isActive ? " active" : ""}`}
                    data-color={status.color || ""}
                    onClick={() => setFilterStatus(status.value)}
                  >
                    <i className={`bi ${status.icon}`}></i>
                    {status.label}
                    {count > 0 && <span className="status-badge">{count}</span>}
                  </button>
                );
              })}
            </div>

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
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
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
