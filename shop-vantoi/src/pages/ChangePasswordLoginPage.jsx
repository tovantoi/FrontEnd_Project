import React, { useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const ChangePasswordLoginPage = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) return Swal.fire("Lỗi", "Vui lòng nhập email.", "warning");
    setLoading(true);
    try {
      const res = await fetch(
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
      const data = await res.json();
      if (res.ok && data.isSuccess) {
        setOtpSent(true);
        Swal.fire("Thành công", "Mã OTP đã được gửi tới email.", "success");
      } else {
        Swal.fire("Lỗi", data.message || "Gửi OTP thất bại.", "error");
      }
    } catch (err) {
      Swal.fire("Lỗi", "Không thể kết nối đến máy chủ.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await fetch("https://localhost:7022/minimal/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.isSuccess) {
        Swal.fire("Đã gửi lại mã OTP", "Vui lòng kiểm tra email.", "success");
      } else {
        Swal.fire("Lỗi", data.message || "Gửi lại OTP thất bại.", "error");
      }
    } catch (err) {
      Swal.fire("Lỗi", "Không thể gửi lại mã OTP.", "error");
    }
  };

  const handleChangePassword = async () => {
    if (!otp || !newPassword || !confirmPassword)
      return Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin.", "warning");

    if (newPassword !== confirmPassword)
      return Swal.fire("Lỗi", "Mật khẩu xác nhận không khớp.", "warning");

    setLoading(true);
    try {
      const res = await fetch(
        `https://localhost:7022/minimal/api/update-customer-password?email=${email}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp, newPassword, confirmPassword }),
        }
      );
      const data = await res.json();
      if (res.ok && data.isSuccess) {
        Swal.fire("Thành công", "Mật khẩu đã được thay đổi.", "success");
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setOtpSent(false);
      } else {
        Swal.fire("Lỗi", data.message || "Đổi mật khẩu thất bại.", "error");
      }
    } catch (err) {
      Swal.fire("Lỗi", "Không thể kết nối đến máy chủ.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "500px" }}>
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
          <p>ĐỔI MẬT KHẨU</p>
        </center>
      </motion.h1>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {!otpSent ? (
        <button
          className="btn btn-warning w-100"
          onClick={handleSendOtp}
          disabled={loading}
        >
          {loading ? "Đang gửi mã..." : "Gửi mã xác nhận"}
        </button>
      ) : (
        <>
          <div className="mb-3 mt-3">
            <label className="form-label">Mã OTP</label>
            <input
              type="text"
              className="form-control"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu mới</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Xác nhận mật khẩu</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary w-100 mb-2"
            onClick={handleChangePassword}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
          <button
            className="btn btn-outline-secondary w-100"
            onClick={handleResendOtp}
            disabled={loading}
          >
            Gửi lại mã OTP
          </button>
        </>
      )}
    </div>
  );
};

export default ChangePasswordLoginPage;
