import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const RequestOtpPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `https://localhost:7022/minimal/api/change-password?email=${encodeURIComponent(
          email
        )}`,
        {
          method: "PUT",
          headers: {
            accept: "*/*",
          },
        }
      );

      const result = await response.json();
      console.log(result); // Kiểm tra phản hồi API

      if (response.ok && result.isSuccess) {
        localStorage.setItem("userEmail", email);
        Swal.fire({
          title: "Gửi mã OTP thành công",
          text: result.message || "Vui lòng kiểm tra email của bạn!",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/change-password", { state: { email } });
      } else {
        setError(result.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Error fetching OTP: ", err); // Log thêm lỗi
      setError("Không thể kết nối tới server. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="container mt-5">
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
          <p>NHẬP EMAIL CỦA BẠN ĐỂ NHẬN MÃ "OTP"</p>
        </center>
      </motion.h1>
      <form onSubmit={handleRequestOtp} className="mt-3">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Gửi mã OTP
        </button>
      </form>
    </div>
  );
};

export default RequestOtpPage;
