import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BlogCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    coverImage: "",
    videoUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Dùng chung cho cả ảnh và video, lưu phần sau dấu phẩy của base64
  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target.result;
      const mimeType = base64Data.split(";")[0].split(":")[1];

      setFormData((prev) => ({
        ...prev,
        [field]: base64Data.split(",")[1], // chỉ lấy phần sau dấu phẩy
        [`${field}MimeType`]: mimeType, // nếu bạn cần lưu MIME type
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      coverImage: formData.coverImage,
      videoUrl: formData.videoUrl,
    };

    await fetch("https://localhost:7022/minimal/api/create-blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    navigate("/admin/blog");
  };

  return (
    <div className="container mt-4">
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
          <p>TẠO MỚI BLOGS</p>
        </center>
      </motion.h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Tiêu đề</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Slug</label>
          <input
            type="text"
            name="slug"
            className="form-control"
            value={formData.slug}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Mô tả</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Nội dung chi tiết</label>
          <textarea
            name="content"
            className="form-control"
            rows={6}
            value={formData.content}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Ảnh bìa</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => handleFileUpload(e, "coverImage")}
          />
        </div>
        <div className="mb-3">
          <label>Video (nếu có)</label>
          <input
            type="file"
            accept="video/*"
            className="form-control"
            onChange={(e) => handleFileUpload(e, "videoUrl")}
          />
        </div>
        <motion.button
          className="btn btn-secondary mb-3"
          onClick={() => navigate("/admin/blog")}
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
        <button type="submit" className="btn btn-primary">
          Tạo Blog
        </button>
      </form>
    </div>
  );
};

export default BlogCreate;
