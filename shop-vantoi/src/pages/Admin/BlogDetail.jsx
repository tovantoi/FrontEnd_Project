import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
const BlogDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(`https://localhost:7022/minimal/api/get-detail-blog?id=${id}`)
      .then((res) => res.json())
      .then((data) => setBlog(data));
  }, [id]);

  if (!blog) return <div className="container mt-5">Đang tải dữ liệu...</div>;

  return (
    <div className="container mt-5">
      <h2>{blog.title}</h2>
      <p className="text-muted">{blog.slug}</p>
      <img
        src={blog.coverImage}
        alt="Ảnh bìa"
        className="img-fluid rounded mb-4"
        style={{ maxHeight: "400px", objectFit: "cover" }}
      />
      <p>
        <strong>Mô tả:</strong> {blog.description}
      </p>
      <div className="mb-4">
        <strong>Nội dung:</strong>
        <div
          className="mt-2"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
      {blog.videoUrl && (
        <div className="mb-4">
          <video controls width="100%" style={{ maxHeight: "400px" }}>
            <source src={blog.videoUrl} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        </div>
      )}
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
    </div>
  );
};

export default BlogDetail;
