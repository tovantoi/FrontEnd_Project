import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const BlogEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    coverImage: "",
    videoUrl: "",
    isActive: "",
  });

  useEffect(() => {
    fetch(`https://localhost:7022/minimal/api/get-detail-blog?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData(data);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setFormData((prevState) => ({
          ...prevState,
          [fieldName]: base64String,
          [`${fieldName}MimeType`]: file.type, // nếu bạn cần lưu thêm mimeType
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`https://localhost:7022/minimal/api/update-blog?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
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
          <p>CHỈNH SỬA BLOG</p>
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
            onChange={(e) => handleFileChange(e, "coverImage")}
          />
        </div>
        <div className="mb-3">
          <label>Video</label>
          <input
            type="file"
            accept="video/*"
            className="form-control"
            onChange={(e) => handleFileChange(e, "videoUrl")}
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
          />
          <label className="form-check-label" htmlFor="isActive">
            Hiển thị bài viết
          </label>
        </div>
        <button type="submit" className="btn btn-success">
          Lưu cập nhật
        </button>
      </form>
    </div>
  );
};

export default BlogEdit;
