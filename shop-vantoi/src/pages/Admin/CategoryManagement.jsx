import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://localhost:7022/minimal/api/get-categories"
        );
        if (!response.ok) throw new Error("Không thể tải danh mục.");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải danh mục.");
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (categoryId, categoryName) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có chắc muốn xóa danh mục?",
        text: `Danh mục: ${categoryName}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `https://localhost:7022/minimal/api/delete-category?id=${categoryId}`,
          { method: "DELETE" }
        );

        const data = await response.json(); // Lấy dữ liệu trả về (gồm message nếu có)

        if (!response.ok) {
          // ❌ Hiển thị lỗi từ backend bằng SweetAlert2
          await Swal.fire({
            title: "Không thể xóa!",
            text:
              data?.message || "Có sản phẩm vẫn còn nằm trong danh mục này.",
            icon: "error",
            confirmButtonText: "OK",
          });
          return; // Dừng xử lý
        }

        // ✅ Nếu xóa thành công
        setCategories(
          categories.filter((category) => category.id !== categoryId)
        );

        await Swal.fire({
          title: "Thành công!",
          text: "Danh mục đã được xóa.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      // ❗ Trường hợp lỗi bất ngờ (mạng, lỗi cú pháp...)
      await Swal.fire({
        title: "Lỗi hệ thống!",
        text: err.message || "Đã xảy ra lỗi khi xóa danh mục.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="container my-4">
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
          <p>QUẢN LÍ DANH MỤC</p>
        </center>
      </motion.h1>
      {error && (
        <motion.div
          className="alert alert-danger"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.div>
      )}
      <Link
        to="/admin/add-category"
        className="btn btn-primary mb-3"
        as={motion.a}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        Thêm Danh mục
      </Link>
      <motion.div
        className="category-list d-flex flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {categories.map((category) => (
          <motion.div
            className="category-item card m-2"
            key={category.id}
            style={{ width: "200px" }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
            }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to={`/admin/category-products/${category.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <motion.img
                src={
                  category.imagePath && category.imagePath.trim() !== ""
                    ? category.imagePath
                    : "https://via.placeholder.com/400"
                }
                alt={category.name}
                style={{
                  width: "200px",
                  height: "250px",
                  objectFit: "cover",
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400"; // fallback nếu ảnh lỗi
                }}
              />
              <motion.div
                className="card-body"
                whileHover={{ color: "#ff5722" }}
              >
                <h5>{category.name}</h5>
              </motion.div>
            </Link>
            <div className="card-body d-flex justify-content-around">
              <Link
                to={`/admin/edit-category/${category.id}`}
                className="btn btn-warning m-1"
                as={motion.a}
                whileHover={{ scale: 1.1, backgroundColor: "#ffc107" }}
                whileTap={{ scale: 0.95 }}
              >
                Chỉnh sửa
              </Link>
              <motion.button
                onClick={() => handleDelete(category.id, category.name)}
                className="btn btn-danger m-1"
                whileHover={{ scale: 1.1, backgroundColor: "#e53935" }}
                whileTap={{ scale: 0.95 }}
              >
                Xóa
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryManagement;
