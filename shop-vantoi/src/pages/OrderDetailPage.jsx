import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import "./CSS/OrderDetailPage.css";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [cachedOrder, setCachedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const cachedOrderData = JSON.parse(
          localStorage.getItem("selectedOrder")
        );
        if (cachedOrderData && cachedOrderData.id === parseInt(orderId, 10)) {
          setCachedOrder(cachedOrderData);
        }

        const response = await fetch(
          `https://localhost:7022/minimal/api/get-order-by-id?id=${orderId}`
        );
        if (!response.ok) {
          throw new Error("Không thể tải chi tiết đơn hàng.");
        }

        const apiData = await response.json();

        // ✅ FIX: API trả về mảng, lấy phần tử đầu tiên
        if (Array.isArray(apiData) && apiData.length > 0) {
          setOrder(apiData[0]);
        } else {
          setOrder(null);
        }
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải chi tiết đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="alert alert-danger text-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <strong>{error}</strong>
      </motion.div>
    );
  }

  if (!order) {
    return (
      <motion.div
        className="alert alert-warning text-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Không tìm thấy đơn hàng.
      </motion.div>
    );
  }

  return (
    <div className="container my-4">
      <motion.button
        className="btn btn-outline-primary btn-lg mb-3"
        whileHover={{ scale: 1.05 }}
        onClick={() => navigate("/my-orders")}
      >
        ← Quay lại đơn hàng
      </motion.button>

      <motion.div
        className="card shadow-lg border-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="card-body">
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
              <p>CHI TIẾT ĐƠN HÀNG</p>
            </center>
          </motion.h1>
          <hr />

          <div className="row mb-4">
            <div className="col-md-6">
              <p>
                <strong>Người nhận:</strong> {order.address?.fullName || "N/A"}
              </p>
              <p>
                <strong>SĐT:</strong> {order.address?.phone || "N/A"}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {order.address?.finalAddress || "N/A"}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Trạng thái đơn:</strong>{" "}
                {order.status === 0 ? "Đang giao hàng" : order.status}
              </p>
              <p>
                <strong>Shipper:</strong> Nguyễn Xuân Sơn
              </p>
              <p>
                <strong>Số điện thoại:</strong> 0123456789
              </p>
            </div>
          </div>

          <motion.h4
            className="mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Sản phẩm đã mua
          </motion.h4>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Tổng giá</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(order.orderItems) &&
                  order.orderItems.map((item, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td>
                        <img
                          src={
                            item.imagePath && item.imagePath.trim() !== ""
                              ? item.imagePath
                              : "https://via.placeholder.com/400"
                          }
                          alt={item.productName || "Sản phẩm"}
                          className="product-img"
                        />
                      </td>
                      <td>{item.productName}</td>
                      <td>{item.quantity || 0}</td>
                      <td>
                        {(
                          (item.discountPrice || item.regularPrice) *
                          item.quantity
                        ).toLocaleString()}{" "}
                        VND
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetailPage;
