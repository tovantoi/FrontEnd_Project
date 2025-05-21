import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return { label: "Pending", color: "text-warning" };
      case 1:
        return { label: "Accepted", color: "text-primary" };
      case 2:
        return { label: "Shipping", color: "text-info" };
      case 3:
        return { label: "Successed", color: "text-success" };
      case 4:
        return { label: "Canceled", color: "text-danger" };
      default:
        return { label: "Unknown Status", color: "text-muted" };
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await fetch(
        `https://localhost:7022/minimal/api/get-order-by-id?id=${id}`
      );
      if (!response.ok) throw new Error("Không thể lấy thông tin đơn hàng.");
      const data = await response.json();
      setOrder(Array.isArray(data) ? data[0] : data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Đang tải...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!order)
    return <div className="alert alert-warning">Không có đơn hàng.</div>;

  const { label, color } = getStatusLabel(order.status);

  return (
    <div className="container my-4">
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

      <motion.button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/admin/order")}
      >
        ← Quay lại
      </motion.button>

      <div className="card mb-4">
        <div className="card-body">
          <h5>Thông tin đơn hàng</h5>
          <p>
            <strong>Mã đơn:</strong> {order.id}
          </p>
          <p>
            <strong>Email:</strong> {order.email}
          </p>
          <p>
            <strong>Tổng tiền:</strong> {order.totalPrice.toLocaleString()} VND
          </p>
          <p>
            <strong>Trạng thái:</strong> <span className={color}>{label}</span>
          </p>

          {order.address && (
            <>
              <h5>Thông tin người nhận</h5>
              <p>
                <strong>Họ tên:</strong> {order.address.fullName}
              </p>
              <p>
                <strong>SĐT:</strong> {order.address.phone}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {order.address.finalAddress}
              </p>
            </>
          )}

          {order.orderItems?.length > 0 && (
            <>
              <h5 className="mt-4">Danh sách sản phẩm</h5>
              <ul className="list-group">
                {order.orderItems.map((item, index) => {
                  const price = item.discountPrice ?? 0;
                  const total = item.quantity * price;

                  return (
                    <li
                      key={index}
                      className="list-group-item d-flex gap-3 align-items-center"
                    >
                      <img
                        src={
                          item.imagePath?.trim() ||
                          "https://via.placeholder.com/100"
                        }
                        alt={item.productName || "Sản phẩm"}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                      <div>
                        <p className="mb-1 fw-bold">
                          {item.productName || "Không rõ"}
                        </p>
                        <p className="mb-0">Số lượng: {item.quantity}</p>
                        <p className="mb-0">
                          Đơn giá: {price.toLocaleString()} VND
                        </p>
                        <p className="mb-0">
                          Thành tiền: {total.toLocaleString()} VND
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
