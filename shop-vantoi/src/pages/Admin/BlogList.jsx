import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const res = await fetch("https://localhost:7022/minimal/api/get-blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error("Lỗi khi lấy blog:", err);
    }
  };

  const handleToggleActive = async (blog) => {
    const isCurrentlyActive = blog.isActive === true || blog.isActive === 1;

    const confirm = await Swal.fire({
      title: isCurrentlyActive
        ? "Xác nhận ẩn bài viết"
        : "Xác nhận hiện bài viết",
      text: isCurrentlyActive
        ? "Bạn có chắc muốn ẩn bài viết này không?"
        : "Bạn có muốn hiển thị lại bài viết này không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: isCurrentlyActive ? "Ẩn bài" : "Hiện bài",
      cancelButtonText: "Hủy",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(
        `https://localhost:7022/minimal/api/delete-blog?id=${blog.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: !blog.isActive }),
        }
      );

      if (res.ok) {
        await Swal.fire(
          "Thành công",
          isCurrentlyActive
            ? "Bài viết đã được ẩn"
            : "Bài viết đã được hiển thị lại",
          "success"
        );
        fetchBlogs();
      } else {
        throw new Error("Lỗi API");
      }
    } catch (err) {
      Swal.fire("Lỗi", "Không thể cập nhật trạng thái", "error");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
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
            <p>QUẢN LÍ BÀI BLOGS</p>
          </center>
        </motion.h1>
        <button
          className="btn btn-success"
          onClick={() => navigate("/admin/blog/create")}
        >
          Tạo mới
        </button>
      </div>

      <div className="row">
        {blogs.map((blog) => (
          <motion.div
            className="col-md-4 mb-4"
            key={blog.id}
            whileHover={{ scale: 1.03 }}
          >
            <div className="card shadow-sm">
              {blog.coverImage && (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}

              <div className="card-body">
                <h5 className="card-title">{blog.title}</h5>
                <p className="text-muted">
                  Trạng thái:{" "}
                  {blog.isActive === false || blog.isActive === 0 ? (
                    <span className="text-danger">Đã ẩn</span>
                  ) : (
                    <span className="text-success">Đang hiển thị</span>
                  )}
                </p>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <button
                    className="btn btn-info"
                    onClick={() => navigate(`/admin/blog/detail/${blog.id}`)}
                  >
                    Chi tiết
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => navigate(`/admin/blog/edit/${blog.id}`)}
                  >
                    Sửa
                  </button>
                  <button
                    className={`btn ${
                      blog.isActive ? "btn-secondary" : "btn-success"
                    }`}
                    onClick={() => handleToggleActive(blog)}
                  >
                    {blog.isActive ? "Ẩn bài" : "Hiện bài"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
