import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import "./CSS/MyAccountPage.css"; // 👉 mình sẽ tạo 1 file CSS riêng

const MyAccountPage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    avatarImagePath: "",
    imageData: "",
    imageMimeType: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomerById = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData || !userData.id)
          throw new Error("Người dùng chưa đăng nhập.");
        const userId = userData.id;

        const response = await fetch(
          `https://localhost:7022/minimal/api/get-customer-by-id?id=${userId}`
        );

        const data = await response.json();
        if (!response.ok || !data.isSuccess) throw new Error(data.message);

        setUser(data.data);
        setFormData({
          firstName: data.data.firstName || "",
          lastName: data.data.lastName || "",
          email: data.data.email || "",
          phoneNumber: data.data.phoneNumber || "",
          avatarImagePath: data.data.avatarImagePath || "",
          imageData: "",
          imageMimeType: "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerById();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setFormData((prev) => ({
          ...prev,
          imageData: base64String,
          imageMimeType: file.type,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData.id;

      const updatedData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        imageData: formData.imageData || null,
        imageMimeType: formData.imageMimeType || null,
      };

      const response = await fetch(
        `https://localhost:7022/minimal/api/update-profile-customer?id=${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      const result = await response.json();
      if (!response.ok || !result.isSuccess) throw new Error(result.message);

      setUser({ ...userData, ...updatedData });
      localStorage.setItem(
        "user",
        JSON.stringify({ ...userData, ...updatedData })
      );
      setIsEditing(false);

      Swal.fire("Thành công!", "Thông tin đã được cập nhật!", "success");
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      Swal.fire("Lỗi!", err.message || "Cập nhật thất bại.", "error");
    }
  };

  if (loading) {
    return (
      <div className="account-loading">
        <div className="spinner-border text-primary"></div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  return (
    <div className="container my-5 account-page">
      <div className="card account-card shadow p-4">
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
            <p>Tài khoản cá nhân</p>
          </center>
        </motion.h1>

        <div className="text-center mb-4">
          <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
            <img
              src={
                formData.imageData
                  ? `data:${formData.imageMimeType};base64,${formData.imageData}`
                  : formData.avatarImagePath ||
                    "https://via.placeholder.com/150"
              }
              alt="Avatar"
              className="rounded-circle shadow avatar-preview"
            />
          </label>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {isEditing ? (
          <>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Họ</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Tên</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-success flex-fill"
                onClick={handleSave}
              >
                Lưu thay đổi
              </button>
              <button
                className="btn btn-secondary flex-fill"
                onClick={() => setIsEditing(false)}
              >
                Hủy
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-2">
              <strong>Họ tên:</strong> {user.firstName} {user.lastName}
            </div>
            <div className="mb-2">
              <strong>Email:</strong> {user.email}
            </div>
            <div className="mb-2">
              <strong>Số điện thoại:</strong>{" "}
              {user.phoneNumber || "Chưa cập nhật"}
            </div>

            <button
              className="btn btn-primary w-100"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa thông tin
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyAccountPage;
