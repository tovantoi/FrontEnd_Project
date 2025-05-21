import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: "",
    description: "",
    parentId: null,
    isActive: true,
    imageData: null,
    imageMimeType: "",
    imagePath: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-category-by-id?id=${id}`
        );
        if (!response.ok) throw new Error("Không thể tải thông tin danh mục.");
        const data = await response.json();
        setCategory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1]; // Lấy phần base64 sau dấu phẩy
        setCategory((prevState) => ({
          ...prevState,
          imageData: base64String,
          imageMimeType: file.type, // Lưu thêm mimeType
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `https://localhost:7022/minimal/api/update-category?id=${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...category,
            imageData: category.imageData,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.isSuccess) {
        Swal.fire({
          title: "Chỉnh sửa danh mục thành công!",
          text: result.message || "Danh mục đã được cập nhật!",
          icon: "success",
          confirmButtonText: "OK",
        });
        setTimeout(() => {
          navigate("/admin/category");
        }, 1500);
      } else {
        setError("Không thể cập nhật danh mục.");
      }
    } catch (err) {
      Swal.fire({
        title: "Chỉnh sửa danh mục thất bại!",
        text: err.message || "Đã xảy ra lỗi khi cập nhật danh mục.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <motion.button
        className="btn btn-secondary mb-4"
        onClick={() => navigate("/admin/category")}
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
          <p>CHỈNH SỬA THÔNG TIN DANH MỤC</p>
        </center>
      </motion.h1>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Tên danh mục</label>
          <input
            type="text"
            id="name"
            name="name"
            value={category.name || ""}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Mô tả</label>
          <textarea
            id="description"
            name="description"
            value={category.description || ""}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="parentId">Danh mục cha</label>
          <input
            type="number"
            id="parentId"
            name="parentId"
            value={category.parentId || ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {category.imagePath && !category.imageData && (
          <div className="form-group">
            <label>Hình ảnh hiện tại</label>
            <div>
              <img
                src={
                  category.imagePath && category.imagePath.trim() !== ""
                    ? category.imagePath
                    : "https://via.placeholder.com/400"
                }
                alt={category.name}
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="imageData">Hình ảnh danh mục</label>
          <input
            type="file"
            id="imageData"
            name="imageData"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>
        {category.imageData && (
          <div className="mb-3">
            <img
              src={`data:${category.imageMimeType};base64,${category.imageData}`}
              alt={category.name || "Ảnh danh mục"}
              className="img-thumbnail"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="isActive">Kích hoạt</label>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={category.isActive || false}
            onChange={(e) =>
              handleChange({
                target: { name: "isActive", value: e.target.checked },
              })
            }
            className="form-check-input"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-3"
          disabled={loading}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật danh mục"}
        </button>
      </form>
    </div>
  );
};

export default UpdateCategory;
