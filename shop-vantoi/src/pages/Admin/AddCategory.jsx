import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    parentId: null,
    name: "",
    description: "",
    isActive: true,
    imageData: "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const swalInstance = Swal.fire({
        title: "Đang lấy thông tin danh mục...",
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff",
        backdrop: `
          rgba(0,0,123,0.4)
          url("/assets/loading.png")
          left top
          no-repeat
        `,
      });
      try {
        const response = await fetch(
          "https://localhost:7022/minimal/api/get-categories"
        );
        if (!response.ok) throw new Error("Không thể tải danh mục.");
        const data = await response.json();
        setCategories(data);
        swalInstance.close();
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải danh mục.");
        swalInstance.close();
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Lấy dữ liệu base64
        const base64Data = event.target.result;

        // Xác định định dạng của ảnh từ phần đầu base64
        const mimeType = base64Data.split(";")[0].split(":")[1]; // Lấy MIME type

        setFormData({
          ...formData,
          imageData: base64Data.split(",")[1], // Lưu phần sau dấu phẩy của base64
          mimeType: mimeType, // Lưu MIME type
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/create-category",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();

      if (!response.ok || !result.isSuccess) {
        throw new Error(result.message || "Không thể thêm danh mục.");
      }

      Swal.fire({
        title: "Thêm danh mục thành công!",
        text: result.message || "Đã thêm danh mục!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setTimeout(() => {
        navigate("/admin/category");
      }, 1000);
    } catch (err) {
      Swal.fire({
        title: "Thêm danh mục thất bại",
        text: err.message || "Vui lòng kiểm tra lại thông tin danh mục.",
        icon: "error",
        confirmButtonText: "Thử lại",
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
          <p>THÊM MỚI DANH MỤC</p>
        </center>
      </motion.h1>

      {error && <div className="alert alert-danger">{error}</div>}
      <motion.button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/admin/category")}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{
          scale: 1.1,
          backgroundColor: "blue",
          color: "#ff5722", // Màu chữ trắng khi hover
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)", // Thêm bóng mờ khi hover
        }}
        transition={{ duration: 0.3 }}
      >
        ← Quay lại
      </motion.button>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="parentId">Danh mục cha</label>
          <select
            className="form-control"
            id="parentId"
            name="parentId"
            value={formData.parentId || ""}
            onChange={handleInputChange}
          >
            <option value="">Không có</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="name">Tên danh mục</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Mô tả</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Hình ảnh</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        {formData.imageData && formData.mimeType && (
          <div className="mb-3">
            <div className="d-flex align-items-center">
              <img
                // Thêm tiền tố base64 với MIME type tự động
                src={`data:${formData.mimeType};base64,${formData.imageData}`}
                alt={formData.name || "Ảnh danh mục"}
                className="img-thumbnail me-3"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <span className="text-muted">Hình ảnh xem trước</span>
            </div>
          </div>
        )}
        <br />
        <div className="form-group">
          <label htmlFor="isActive">Kích hoạt</label>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
          />
        </div>
        <br />
        <motion.button
          type="submit"
          className="btn btn-primary"
          whileHover={{
            scale: 1.1,
            backgroundColor: "#007bff",
            boxShadow: "0px 0px 10px rgba(0, 123, 255, 0.5)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Thêm
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddCategory;
