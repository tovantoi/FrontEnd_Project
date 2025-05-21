import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const CouponDetail = () => {
  const { id } = useParams();
  const [coupon, setCoupon] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCoupon();
  }, [id]);

  const fetchCoupon = async () => {
    try {
      const response = await fetch(
        `https://localhost:7022/minimal/api/get-coupon-by-id?id=${id}`
      );
      if (!response.ok) throw new Error("Không thể lấy thông tin mã giảm giá.");
      const data = await response.json();
      setCoupon(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Đang tải...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container my-4">
      <motion.button
        className="btn btn-secondary mb-4"
        onClick={() => navigate("/admin/coupon")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ← Quay lại
      </motion.button>
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
          <p>THÔNG TIN CHI TIẾT MÃ GIẢM GIÁ</p>
        </center>
      </motion.h1>
      {coupon && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Thông tin mã giảm giá</h5>
            <p className="card-text">
              <strong>Mã giảm giá:</strong> {coupon.code}
            </p>
            <p className="card-text">
              <strong>Mô tả:</strong> {coupon.description}
            </p>
            <p className="card-text">
              <strong>Số lần sử dụng:</strong> {coupon.timesUsed} /{" "}
              {coupon.maxUsage}
            </p>
            <p className="card-text">
              <strong>Thời gian hết hạn:</strong>{" "}
              {new Date(coupon.couponEndDate).toLocaleDateString()}
            </p>
            <p className="card-text">
              <strong>Trạng thái:</strong>{" "}
              {coupon.isActive ? (
                <span className="badge bg-success">Còn hiệu lực</span>
              ) : (
                <span className="badge bg-danger">Hết hiệu lực</span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponDetail;
