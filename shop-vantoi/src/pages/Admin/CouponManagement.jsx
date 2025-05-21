import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/get-coupons"
      );
      if (!response.ok) throw new Error("Không thể lấy danh sách mã giảm giá.");
      const data = await response.json();
      setCoupons(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, couponName) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có chắc muốn xóa mã giảm giá?",
        text: `Mã giảm giá: ${couponName}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      });

      if (!result.isConfirmed) return;

      const response = await fetch(
        `https://localhost:7022/minimal/api/get-coupon-by-id?id=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể xóa mã giảm giá.");
      }

      setCoupons(coupons.filter((coupon) => coupon.id !== id));

      await Swal.fire({
        title: "Thành công!",
        text: "Mã giảm giá đã được xóa.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      await Swal.fire({
        title: "Lỗi!",
        text: `Lỗi: ${err.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <motion.div
      className="container my-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
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
          <p>QUẢN LÍ MÃ GIẢM GIÁ</p>
        </center>
      </motion.h1>

      {error && (
        <motion.div
          className="alert alert-danger"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.div>
      )}
      {successMessage && (
        <motion.div
          className="alert alert-success"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {successMessage}
        </motion.div>
      )}

      <motion.button
        className="btn btn-success mb-3"
        onClick={() => navigate("/admin/create-coupon")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        Thêm mã giảm giá
      </motion.button>

      <motion.table
        className="table table-striped"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <thead>
          <tr>
            <th>CODE</th>
            <th>Mô tả</th>
            <th>Số lần sử dụng</th>
            <th>Thời gian hết hạn</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <motion.tbody
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center">
                Đang tải...
              </td>
            </tr>
          ) : coupons.length > 0 ? (
            coupons.map((coupon) => (
              <motion.tr
                key={coupon.id}
                whileHover={{ scale: 1.02, backgroundColor: "#f8f9fa" }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(`/admin/coupon-detail/${coupon.id}`)} // Chuyển đến trang chi tiết khi nhấp vào hàng
              >
                <td>{coupon.code}</td>
                <td>{coupon.description}</td>
                <td>{coupon.maxUsage}</td>
                <td>{new Date(coupon.couponEndDate).toLocaleDateString()}</td>
                <td>{coupon.isActive ? "Còn hiệu lực" : "Hết hiệu lực"}</td>
                <td>
                  {/* Ngăn chặn sự kiện nhấp chuột khi nhấn vào nút */}
                  <motion.button
                    className="btn btn-warning me-2"
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn chặn sự kiện nhấp chuột từ lan ra ngoài
                      navigate(`/admin/editcoupon/${coupon.id}`);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sửa
                  </motion.button>
                  <motion.button
                    className="btn btn-danger"
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn chặn sự kiện nhấp chuột từ lan ra ngoài
                      handleDelete(coupon.id, coupon.code);
                    }}
                    whileHover={{ scale: 1.1, backgroundColor: "#e53935" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Xóa
                  </motion.button>
                </td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Không có mã giảm giá nào
              </td>
            </tr>
          )}
        </motion.tbody>
      </motion.table>
    </motion.div>
  );
};

export default CouponManagement;
