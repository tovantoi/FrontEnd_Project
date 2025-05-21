import React, { useState, useEffect } from "react";

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) {
      setError(
        "Không tìm thấy thông tin email. Vui lòng quay lại bước gửi mã OTP."
      );
    }
  }, [email]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7022/minimal/api/update-customer-password?email=${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: formData.otp,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.isSuccess) {
        setSuccess("Mật khẩu đã được thay đổi thành công.");
      } else {
        setError(result.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Không thể kết nối tới server. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Thay đổi mật khẩu</h2>
      <form onSubmit={handleChangePassword} className="mt-3">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="mb-3">
          <label htmlFor="otp" className="form-label">
            OTP
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={formData.otp}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">
            Mật khẩu mới
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Thay đổi mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
