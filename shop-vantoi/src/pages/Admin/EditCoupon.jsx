import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const EditCoupon = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState({
    code: "",
    description: "",
    timesUsed: 0,
    maxUsage: 1,
    discount: "",
    isActive: true,
    couponEndDate: "", // Khởi tạo với giá trị mặc định
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCoupon();
  }, [id]);

  const fetchCoupon = async () => {
    setLoading(true);
    setError("");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoupon((prev) => ({
      ...prev,
      [name]: name === "isActive" ? e.target.checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://localhost:7022/minimal/api/update-coupon?id=${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(coupon),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể cập nhật mã giảm giá.");
      }

      await Swal.fire({
        title: "Thành công!",
        text: "Mã giảm giá đã được cập nhật.",
        icon: "success",
        confirmButtonText: "OK",
      });

      navigate("/admin/coupon");
    } catch (err) {
      await Swal.fire({
        title: "Lỗi!",
        text: `Lỗi: ${err.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (loading) return <div>Đang tải...</div>;

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
          <p>CHỈNH SỬA THÔNG TIN MÃ GIẢM GIÁ</p>
        </center>
      </motion.h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Mã giảm giá</label>
          <input
            type="text"
            className="form-control"
            name="code"
            value={coupon.code}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <input
            type="text"
            className="form-control"
            name="description"
            value={coupon.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Thời gian hết hạn</label>
          <input
            type="date" // Thay đổi loại thành 'date'
            className="form-control"
            name="couponEndDate" // Đảm bảo tên trường khớp với trạng thái
            value={
              coupon.couponEndDate ? coupon.couponEndDate.split("T")[0] : ""
            } // Kiểm tra trước khi sử dụng split
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Số lần tối đa</label>
          <input
            type="number"
            className="form-control"
            name="maxUsage"
            value={coupon.maxUsage}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Giảm giá</label>
          <input
            type="text"
            className="form-control"
            name="discount"
            value={coupon.discount}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="isActive"
            checked={coupon.isActive}
            onChange={handleChange}
          />
          <label className="form-check-label">Còn hiệu lực</label>
        </div>

        <button type="submit" className="btn btn-primary">
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default EditCoupon;
