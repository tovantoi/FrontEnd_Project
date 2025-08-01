import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./CSS/Order.css";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          throw new Error("Bạn cần đăng nhập để xem đơn hàng.");
        }

        const response = await fetch(
          `https://localhost:7022/minimal/api/get-order-by-customer-id?id=${user.id}`
        );
        if (!response.ok) throw new Error("Không thể tải đơn hàng.");

        const data = await response.json();

        // 👉 Thêm kiểm tra đơn quá hạn
        const needReload = await autoCancelExpiredOrders(data);

        // Nếu có cập nhật trạng thái, reload lại danh sách
        if (needReload) {
          const reloadRes = await fetch(
            `https://localhost:7022/minimal/api/get-order-by-customer-id?id=${user.id}`
          );
          const reloadData = await reloadRes.json();
          setOrders(reloadData);
        } else {
          setOrders(data);
        }

        // Xử lý justPaidOrderId như cũ...
        const justPaidOrderId = localStorage.getItem("justPaidOrderId");
        if (justPaidOrderId) {
          const updatedOrder = data.find(
            (o) => o.id === parseInt(justPaidOrderId)
          );
          if (updatedOrder && updatedOrder.status === 1) {
            Swal.fire(
              "✅ Đã thanh toán!",
              "Đơn hàng đã cập nhật trạng thái.",
              "success"
            );
            localStorage.removeItem("justPaidOrderId");
          }
        }
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  // Trong component OrderManagementPage hoặc file chứa handleFeedback
  const handleFeedback = async (orderId) => {
    try {
      const res = await fetch(
        `https://localhost:7022/minimal/api/get-order-by-id?id=${orderId}`
      );
      const dataArray = await res.json();

      if (!Array.isArray(dataArray) || dataArray.length === 0) {
        Swal.fire("Lỗi", "Không thể xác định đơn hàng để phản hồi.", "error");
        return;
      }

      const order = dataArray[0];
      const orderItem = order?.orderItems?.[0];

      if (!orderItem?.productId) {
        Swal.fire("Lỗi", "Không thể xác định sản phẩm để phản hồi.", "error");
        return;
      }

      const { value: feedback } = await Swal.fire({
        title: "Phản hồi người bán",
        input: "textarea",
        inputLabel: "Nội dung phản hồi",
        inputPlaceholder: "Nhập phản hồi của bạn...",
        inputAttributes: {
          "aria-label": "Nhập phản hồi tại đây",
        },
        showCancelButton: true,
        confirmButtonText: "Gửi",
      });

      if (feedback && feedback.trim()) {
        const customer_name = order?.address?.fullName || "Khách hàng";

        const templateParams = {
          customer_name,
          feedback,
          website: `http://localhost:3000/product/${orderItem.productId}#review`,
          productId: orderItem.productId,
          company: "SHOP VANTOI",
          phone: "1900 8079",
          email: "tovantoi2003@gmail.com",
        };

        await emailjs.send(
          "service_byk855g",
          "template_16ib71f",
          templateParams,
          "HF6Wcu5eZUxx-qnE4"
        );

        Swal.fire("Đã gửi phản hồi!", "", "success");
      }
    } catch (error) {
      console.error("Lỗi phản hồi:", error);
      Swal.fire("Lỗi", "Không thể gửi phản hồi.", "error");
    }
  };

  const handleReturnOrder = async (orderId) => {
    try {
      const res = await fetch(
        `https://localhost:7022/minimal/api/get-order-by-id?id=${orderId}`
      );
      const dataArray = await res.json();

      if (!Array.isArray(dataArray) || dataArray.length === 0) {
        Swal.fire("Lỗi", "Không thể xác định đơn hàng để hoàn trả.", "error");
        return;
      }

      const order = dataArray[0];
      const orderItem = order?.orderItems?.[0];

      const { value: reason } = await Swal.fire({
        title: "Lý do hoàn trả đơn hàng",
        input: "textarea",
        inputPlaceholder: "Vui lòng nhập lý do...",
        showCancelButton: true,
        confirmButtonText: "Gửi yêu cầu",
      });

      if (reason && reason.trim()) {
        const user = JSON.parse(localStorage.getItem("user"));
        const customer_name = order?.address?.fullName || "Khách hàng";
        const customer_email = user?.email || "no-reply@example.com";

        // Gửi email đến người bán
        const sellerParams = {
          customer_name,
          product_name: orderItem?.productName || "Không xác định",
          reason,
          productId: orderItem?.productId,
          company: "SHOP VANTOI",
          email: "tovantoi2003@gmail.com", // Email người bán
          website: `http://localhost:3000/product/${orderItem.productId}`,
        };

        await emailjs.send(
          "service_yfcmf9d",
          "template_j2yfbsu",
          sellerParams,
          "xt-Des4pkFzceYTHY"
        );

        // Gửi phản hồi tự động cho khách hàng
        const autoReplyParams = {
          customer_name,
          email: customer_email,
          message: `Chúng tôi đã nhận được yêu cầu hoàn trả sản phẩm "${orderItem?.productName}". Chúng tôi sẽ liên hệ với bạn sớm nhất để xử lý.`,
          type: "Hoàn trả đơn hàng",
        };

        await emailjs.send(
          "service_yfcmf9d",
          "template_nxahxjp",
          autoReplyParams,
          "xt-Des4pkFzceYTHY"
        );

        Swal.fire("Yêu cầu hoàn trả đã được gửi!", "", "success");
      }
    } catch (err) {
      console.error("Lỗi gửi yêu cầu hoàn trả:", err);
      Swal.fire("Lỗi", "Không thể gửi yêu cầu hoàn trả.", "error");
    }
  };

  const handleCancelOrder = async (orderId) => {
    const { value: reason } = await Swal.fire({
      title: "Chọn lý do huỷ đơn hàng",
      input: "select",
      inputOptions: {
        "": "Vui lòng chọn lý do",
        "Không muốn mua nữa": "Không muốn mua nữa",
        "Tìm thấy giá rẻ hơn": "Tìm thấy giá rẻ hơn",
        "Thay đổi sản phẩm": "Thay đổi sản phẩm",
        "Thời gian giao hàng quá lâu": "Thời gian giao hàng quá lâu",
        Khác: "Khác (vui lòng nhập ở bước sau)",
      },
      inputPlaceholder: "Chọn lý do",
      showCancelButton: true,
      confirmButtonText: "Tiếp tục",
    });

    if (!reason) return;

    let finalReason = reason;

    // Nếu chọn "Khác", cho người dùng nhập lý do cụ thể
    if (reason === "Khác") {
      const { value: customReason } = await Swal.fire({
        title: "Nhập lý do huỷ đơn hàng",
        input: "textarea",
        inputPlaceholder: "Nhập lý do cụ thể...",
        showCancelButton: true,
      });

      if (!customReason || !customReason.trim()) return;
      finalReason = customReason.trim();
    }

    // Xác nhận huỷ
    const confirm = await Swal.fire({
      title: "Xác nhận huỷ đơn hàng?",
      text: `Lý do: ${finalReason}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Huỷ đơn",
      cancelButtonText: "Đóng",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/change-status-order-user",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: orderId,
            status: 4, // Đã huỷ
          }),
        }
      );

      if (!response.ok) throw new Error("Không thể huỷ đơn hàng.");

      Swal.fire("Huỷ đơn hàng thành công!", "", "success");

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 4 } : o))
      );
    } catch (err) {
      Swal.fire(
        "Lỗi",
        err.message || "Không thể kết nối đến máy chủ.",
        "error"
      );
    }
  };
  const getOrderCountByStatus = (statusKey) => {
    if (statusKey === "all") return orders.length;
    return orders.filter((o) => o.status.toString() === statusKey).length;
  };
  // Hàm kiểm tra và cập nhật trạng thái đơn quá hạn
  const autoCancelExpiredOrders = async (orders) => {
    const now = new Date();
    const expiredOrders = orders.filter(
      (order) =>
        order.status === 0 &&
        order.createdAt &&
        (now - new Date(order.createdAt)) / (1000 * 60 * 60 * 24) > 3
    );

    for (const expiredOrder of expiredOrders) {
      // Gọi API cập nhật trạng thái sang Đã huỷ (status: 4)
      await fetch(
        `https://localhost:7022/minimal/api/change-status-order?id=${expiredOrder.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: 4 }),
        }
      );
    }

    // Nếu có đơn hết hạn, reload lại danh sách
    if (expiredOrders.length > 0) {
      return true; // báo hiệu cần reload
    }
    return false;
  };
  const getOrderStatusText = (status) => {
    switch (status) {
      case 0:
        return "Chờ xác nhận";
      case 1:
        return "Đã xác nhận";
      case 2:
        return "Đang giao hàng";
      case 3:
        return "Đã giao hàng";
      case 4:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status.toString() === filterStatus);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-3">Đang tải đơn hàng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-5">
        <strong>{error}</strong>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ height: "80vh" }}>
      <div className="row h-100">
        {/* Sidebar cố định bên trái */}
        <div className="col-md-3">
          <div
            className="card shadow-sm p-3 h-100 sticky-top"
            style={{ top: "100px" }}
          >
            <h5 className="mb-3">Tài khoản của tôi</h5>
            <ul className="list-group list-group-flush">
              <li
                className="list-group-item active"
                onClick={() => navigate("/cart")}
                style={{ cursor: "pointer" }}
              >
                Giỏ hàng
              </li>
              <li
                className="list-group-item"
                onClick={() =>
                  Swal.fire("Thông báo", "Tính năng đang phát triển", "info")
                }
                style={{ cursor: "pointer" }}
              >
                Thông báo
              </li>
              <li
                className="list-group-item"
                onClick={() => navigate("/my-account")}
                style={{ cursor: "pointer" }}
              >
                Cài đặt tài khoản
              </li>
            </ul>
          </div>
        </div>

        {/* Nội dung đơn hàng cuộn riêng */}
        <div className="col-md-9 d-flex flex-column">
          {/* Header cố định */}
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
              <p>ĐƠN HÀNG CỦA BẠN</p>
            </center>
          </motion.h1>
          <div className="mb-4 d-flex justify-content-between flex-wrap gap-3 border-bottom pb-2">
            {[
              { key: "all", label: "Tất cả" },
              { key: "0", label: "🕐 Chờ xác nhận" },
              { key: "1", label: "📦 Đã xác nhận" },
              { key: "2", label: "🚚 Đang giao hàng" },
              { key: "3", label: "✅ Đã giao hàng" },
              { key: "4", label: "❌ Đã hủy" },
            ].map((item) => {
              const count = getOrderCountByStatus(item.key);
              return (
                <button
                  key={item.key}
                  className={`btn btn-sm position-relative px-3 fw-semibold ${
                    filterStatus === item.key
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setFilterStatus(item.key)}
                >
                  {item.label}
                  {count > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "0.6rem" }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Danh sách đơn hàng cuộn */}
          <div className="overflow-auto flex-grow-1 order-list-container">
            {orders.length === 0 ? (
              <div className="alert alert-warning">
                Bạn chưa có đơn hàng nào.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <motion.div
                  className="order-card p-3 mb-4 shadow-sm rounded"
                  key={order.id}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    localStorage.setItem(
                      "selectedOrder",
                      JSON.stringify(order)
                    );
                    navigate(`/order/${order.id}`);
                  }}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        order.orderItems[0]?.imagePath ||
                        "https://via.placeholder.com/120"
                      }
                      alt="product"
                      className="rounded"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1">
                        {order.orderItems[0]?.productName || "Sản phẩm"}
                      </h6>
                      <small className="text-muted">
                        Số lượng:{" "}
                        {order.orderItems.reduce(
                          (total, item) => total + (item.quantity || 0),
                          0
                        )}
                      </small>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-danger">
                        {order.totalPrice?.toLocaleString()} VND
                      </div>
                      <div className="badge bg-success mt-1">
                        {getOrderStatusText(order.status)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 d-flex gap-2 justify-content-end">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFeedback(order.id);
                      }}
                    >
                      💬 Phản hồi
                    </button>

                    {order.status === 3 && (
                      <button
                        className="btn btn-outline-warning btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReturnOrder(order.id);
                        }}
                      >
                        🔄 Hoàn trả
                      </button>
                    )}
                    {order.status === 3 && (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          const productId = order.orderItems[0]?.productId;
                          if (productId) {
                            navigate(`/product/${productId}#review`);
                          }
                        }}
                      >
                        ⭐ Đánh giá
                      </button>
                    )}

                    {(order.status === 0 || order.status === 1) && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelOrder(order.id);
                        }}
                      >
                        ❌ Huỷ đơn
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagementPage;
