import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./CSS/Order.css";
import Swal from "sweetalert2";

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
        setOrders(data);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
              <p>Đơn hàng của bạn</p>
            </center>
          </motion.h1>

          {/* Danh sách đơn hàng cuộn */}
          <div className="overflow-auto flex-grow-1 order-list-container">
            {orders.length === 0 ? (
              <div className="alert alert-warning">
                Bạn chưa có đơn hàng nào.
              </div>
            ) : (
              orders.map((order) => (
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
