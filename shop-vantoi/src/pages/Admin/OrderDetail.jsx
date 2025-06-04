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
        return { label: "Chờ xác nhận", color: "bg-warning text-dark" };
      case 1:
        return { label: "Đã xác nhận", color: "bg-primary text-white" };
      case 2:
        return { label: "Đang giao hàng", color: "bg-info text-dark" };
      case 3:
        return { label: "Hoàn tất", color: "bg-success text-white" };
      case 4:
        return { label: "Đã huỷ", color: "bg-danger text-white" };
      default:
        return { label: "Không rõ", color: "bg-secondary text-white" };
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

  if (loading) return <div className="text-center py-5">Đang tải...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!order)
    return <div className="alert alert-warning">Không có đơn hàng.</div>;

  const { label, color } = getStatusLabel(order.status);

  return (
    <div className="container my-4">
      <motion.h1
        className="text-center mb-4 fw-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        CHI TIẾT ĐƠN HÀNG
      </motion.h1>

      <motion.button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate("/admin/order")}
        whileHover={{ scale: 1.05 }}
      >
        ← Quay lại danh sách
      </motion.button>

      <div className="card shadow-sm rounded-4">
        <div className="card-body">
          <h4 className="mb-3">Thông tin đơn hàng</h4>
          <div className="row">
            <div className="col-md-6">
              <p>
                <strong>Mã đơn:</strong> OD{id}
              </p>
              <p>
                <strong>Email khách hàng:</strong> {order.email}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <span className={`badge ${color} px-3 py-2`}>{label}</span>
              </p>
            </div>
            <div className="col-md-6">
              {order.address && (
                <>
                  <p>
                    <strong>Người nhận:</strong> {order.address.fullName}
                  </p>
                  <p>
                    <strong>SĐT:</strong> {order.address.phone}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {order.address.finalAddress}
                  </p>
                </>
              )}
            </div>
          </div>

          {order.orderItems?.length > 0 && (
            <>
              <h4 className="mt-4">Danh sách sản phẩm</h4>
              <ul className="list-group mb-3">
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
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          <div className="mt-4 p-3 border rounded shadow-sm bg-light">
            <h5 className="mb-3 text-dark">Tổng kết thanh toán</h5>
            <div className="d-flex justify-content-between">
              <span className="fw-semibold">Thành tiền (chưa giảm):</span>
              <span>
                {(
                  order.totalPrice +
                  (order.coupon?.discount
                    ? parseFloat(order.coupon.discount)
                    : 0)
                ).toLocaleString()}{" "}
                VND
              </span>
            </div>

            {order.coupon && (
              <div className="d-flex justify-content-between text-success">
                <span className="fw-semibold">
                  Mã giảm giá ({order.coupon.code}):
                </span>
                <span>
                  -{parseFloat(order.coupon.discount).toLocaleString()} VND
                </span>
              </div>
            )}

            <hr className="my-2" />

            <div className="d-flex justify-content-between fs-5 fw-bold text-primary">
              <span>Tổng tiền phải trả:</span>
              <span>{order.totalPrice.toLocaleString()} VND</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
