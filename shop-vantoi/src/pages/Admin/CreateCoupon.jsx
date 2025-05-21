import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const CreateCoupon = () => {
  const [couponData, setCouponData] = useState({
    code: "",
    description: "",
    maxUsage: "",
    discount: "",
    isActive: true,
    couponStartDate: "",
    couponEndDate: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setCouponData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/create-coupon",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(couponData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        await Swal.fire({
          title: "Thành công!",
          text: result.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/admin/coupon"); // Chuyển hướng về trang quản lý đơn hàng
      } else {
        throw new Error(result.message || "Có lỗi xảy ra.");
      }
    } catch (error) {
      await Swal.fire({
        title: "Lỗi!",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <p>TẠO MÃ GIẢM GIÁ</p>
        </center>
      </motion.h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Mã giảm giá</label>
          <input
            type="text"
            className="form-control"
            name="code"
            value={couponData.code}
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
            value={couponData.description}
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
            value={couponData.maxUsage}
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
            value={couponData.discount}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Thời gian bắt đầu</label>
          <input
            type="date"
            className="form-control"
            name="couponStartDate"
            value={couponData.couponStartDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Thời gian hết hạn</label>
          <input
            type="date"
            className="form-control"
            name="couponEndDate"
            value={couponData.couponEndDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="isActive"
            checked={couponData.isActive}
            onChange={handleChange}
          />
          <label className="form-check-label">Còn hiệu lực</label>
        </div>

        <button
          type="submit"
          className={`btn btn-primary ${loading ? "disabled" : ""}`}
        >
          {loading ? "Đang tạo..." : "Tạo mã giảm giá"}
        </button>
      </form>
    </div>
  );
};

export default CreateCoupon;
