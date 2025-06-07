import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/get-products-admin"
      );
      if (!response.ok) throw new Error("Không thể lấy danh sách sản phẩm.");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, productName) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có chắc muốn xóa sản phẩm?",
        text: `Sản phẩm: ${productName}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      });

      if (!result.isConfirmed) return;

      const response = await fetch(
        `https://localhost:7022/minimal/api/delete-product?id=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json(); // 🔄 Lấy response JSON (chứa message nếu có)

      if (!response.ok) {
        // ❌ Hiển thị thông báo lỗi rõ ràng từ backend
        await Swal.fire({
          title: "Không thể xóa!",
          text:
            data?.message ||
            "Không thể xóa sản phẩm vì đang được sử dụng trong đơn hàng.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      // ✅ Nếu thành công
      setProducts(products.filter((product) => product.id !== id));

      await Swal.fire({
        title: "Thành công!",
        text: "Sản phẩm đã được xóa.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      // ⚠️ Bắt lỗi hệ thống hoặc mạng
      await Swal.fire({
        title: "Lỗi!",
        text: err.message || "Đã xảy ra lỗi khi xóa sản phẩm.",
        icon: "error",
        confirmButtonText: "OK",
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
          <p>QUẢN LÍ SẢN PHẨM</p>
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
      {successMessage && (
        <motion.div
          className="alert alert-success"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {successMessage}
        </motion.div>
      )}

      <motion.button
        className="btn btn-success mb-3"
        onClick={() => navigate("/admin/add-product")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        Thêm sản phẩm
      </motion.button>

      <motion.table
        className="table table-striped"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <motion.tbody
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center">
                Đang tải...
              </td>
            </tr>
          ) : products.length > 0 ? (
            products.map((product) => (
              <motion.tr
                key={product.productId}
                whileHover={{ scale: 1.02, backgroundColor: "#f8f9fa" }}
                transition={{ duration: 0.3 }}
              >
                <td>
                  <motion.img
                    src={
                      product.imagePath && product.imagePath.trim() !== ""
                        ? product.imagePath
                        : "https://via.placeholder.com/400"
                    }
                    alt={product.productName}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400"; // fallback nếu ảnh lỗi
                    }}
                  />
                </td>
                <td>{product.productName}</td>
                <td>{product.discountPrice || product.regularPrice} VND</td>
                <td>
                  {product.isActive == 1 ? (
                    <span className="badge bg-success">Còn hàng</span>
                  ) : (
                    <span className="badge bg-danger">Hết hàng</span>
                  )}
                </td>
                <td>
                  <motion.button
                    className="btn btn-info me-2"
                    onClick={() =>
                      navigate(`/admin/product/detail/${product.id}`)
                    }
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Chi tiết
                  </motion.button>
                  <motion.button
                    className="btn btn-warning me-2 text-dark fw-bold"
                    onClick={() =>
                      navigate(`/admin/products/${product.id}/add-images`)
                    }
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: "6px 12px",
                      fontSize: "0.9rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ➕ Ảnh phụ
                  </motion.button>

                  <motion.button
                    className="btn btn-warning me-2"
                    onClick={() =>
                      navigate(`/admin/editproducts/${product.id}`)
                    }
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sửa
                  </motion.button>
                  <motion.button
                    className="btn btn-danger"
                    onClick={() =>
                      handleDelete(product.id, product.productName)
                    }
                    whileHover={{ scale: 1.1, backgroundColor: "#e53935" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Xóa
                  </motion.button>
                </td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Không có sản phẩm
              </td>
            </tr>
          )}
        </motion.tbody>
      </motion.table>
    </motion.div>
  );
};

export default ProductManagement;
