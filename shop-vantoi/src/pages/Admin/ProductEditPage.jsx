import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const ProductEditPage = () => {
  const { productId } = useParams(); // Lấy productId từ URL
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    productName: "",
    regularPrice: "",
    discountPrice: "",
    description: "",
    brand: "",
    size: "",
    color: "",
    material: "",
    gender: "",
    packaging: "",
    origin: "",
    manufacturer: "",
    stockQuantity: "",
    imageMimeType: "",
    imagePath: "",
    seoTitle: "",
    seoAlias: "",
    isActive: true,
    categoryIds: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-product-detail?id=${productId}`
        );
        if (!response.ok) throw new Error("Không thể tải thông tin sản phẩm.");
        const data = await response.json();
        setProduct((prev) => ({
          ...data,
          categoryIds: Array.isArray(data.categoryIds) ? data.categoryIds : [],
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...product,
      categoryIds: Array.isArray(product.categoryIds)
        ? product.categoryIds
        : product.categoryIds.split(",").map((id) => parseInt(id.trim(), 10)),
    };
    try {
      const response = await fetch(
        `https://localhost:7022/minimal/api/update-product?id=${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        Swal.fire({
          title: "Cập nhật sản phẩm thất bại",
          text: result.message || "Vui lòng kiểm tra lại thông tin sản phẩm.",
          icon: "error",
          confirmButtonText: "Thử lại",
        });
      }
      Swal.fire({
        title: "Cập nhật sản phẩm thành công!",
        text: result.message || "Chào mừng bạn!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (err) {
      Swal.fire({
        title: "Lỗi kết nối",
        text: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1]; // Lấy phần base64 sau dấu phẩy
        setProduct((prevState) => ({
          ...prevState,
          imageData: base64String,
          imageMimeType: file.type, // Lưu thêm mimeType
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCategoryIdsChange = (e) => {
    const value = e.target.value;
    setProduct((prevProduct) => ({
      ...prevProduct,
      categoryIds: value, // Lưu chuỗi thô trước khi xử lý
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: checked,
    }));
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  return (
    <div className="container mt-4">
      <motion.button
        onClick={() => navigate(-1)} // Quay lại trang trước đó
        className="btn btn-secondary mb-4"
        initial={{ opacity: 0, x: -100 }} // Nút bắt đầu từ bên trái và mờ
        animate={{ opacity: 1, x: 0 }} // Nút hiện rõ và về đúng vị trí
        whileHover={{
          scale: 1.1, // Phóng to nhẹ khi hover
          backgroundColor: "blue",
          color: "#ff5722", // Màu chữ trắng khi hover
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)", // Thêm bóng mờ khi hover
        }}
        whileTap={{
          scale: 0.95, // Thu nhỏ nhẹ khi click
          backgroundColor: "#5a6268", // Đổi màu nền khi click
        }}
        transition={{
          duration: 0.3, // Thời gian thực hiện hiệu ứng
          ease: "easeInOut", // Làm mượt hiệu ứng
        }}
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
          <p>CHỈNH SỬA THÔNG TIN SẢN PHẨM</p>
        </center>
      </motion.h1>
      <form onSubmit={handleSubmit}>
        <div className="col-md-12">
          <label className="form-label">
            Danh mục (ID cách nhau bằng dấu phẩy)
          </label>
          <input
            type="text"
            value={
              Array.isArray(product.categoryIds)
                ? product.categoryIds.join(",")
                : product.categoryIds
            } // Hiển thị chuỗi danh mục
            onChange={handleCategoryIdsChange}
            onKeyPress={(e) => {
              // Chỉ cho phép nhập số, dấu phẩy và xóa (Backspace)
              if (!/[0-9,]/.test(e.key) && e.key !== "Backspace") {
                e.preventDefault();
              }
            }}
            className="form-control"
          />
        </div>
        {/* Hiển thị hình ảnh hiện tại nếu có và chưa chọn hình ảnh mới */}
        {product.imagePath && !product.imageData && (
          <div className="form-group">
            <label>Hình ảnh hiện tại</label>
            <div>
              <img
                src={
                  product.imagePath && product.imagePath.trim() !== ""
                    ? product.imagePath
                    : "https://via.placeholder.com/400"
                }
                alt={product.productName}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        )}

        {/* Chọn hình ảnh mới */}
        <div className="mb-3">
          <label htmlFor="imageData" className="form-label">
            Hình ảnh sản phẩm
          </label>
          <input
            type="file"
            id="imageData"
            name="imageData"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>
        {/* Hiển thị hình ảnh xem trước nếu người dùng chọn ảnh mới */}
        {product.imageData && (
          <div className="mb-3">
            <label className="form-label">Ảnh xem trước</label>
            <div className="d-flex align-items-center">
              <img
                src={`data:${product.imageMimeType};base64,${product.imageData}`}
                alt="Xem trước sản phẩm"
                className="img-thumbnail me-3"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                }}
              />
              <span className="text-muted">Hình ảnh xem trước</span>
            </div>
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="productName" className="form-label">
            Tên sản phẩm
          </label>
          <input
            type="text"
            className="form-control"
            id="productName"
            name="productName"
            value={product.productName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="regularPrice" className="form-label">
            Giá thường
          </label>
          <input
            type="number"
            className="form-control"
            id="regularPrice"
            name="regularPrice"
            value={product.regularPrice}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="discountPrice" className="form-label">
            Giá khuyến mãi
          </label>
          <input
            type="number"
            className="form-control"
            id="discountPrice"
            name="discountPrice"
            value={product.discountPrice}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Mô tả
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Các trường mới được thêm */}
        <div className="mb-3">
          <label htmlFor="brand" className="form-label">
            Thương hiệu
          </label>
          <input
            type="text"
            className="form-control"
            id="brand"
            name="brand"
            value={product.brand}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="size" className="form-label">
            Kích thước
          </label>
          <input
            type="text"
            className="form-control"
            id="size"
            name="size"
            value={product.size}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="color" className="form-label">
            Màu sắc
          </label>
          <input
            type="text"
            className="form-control"
            id="color"
            name="color"
            value={product.color}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="material" className="form-label">
            Chất liệu
          </label>
          <input
            type="text"
            className="form-control"
            id="material"
            name="material"
            value={product.material}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="gender" className="form-label">
            Giới tính
          </label>
          <select
            className="form-select"
            id="gender"
            name="gender"
            value={product.gender}
            onChange={handleChange}
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="packaging" className="form-label">
            Bao bì
          </label>
          <input
            type="text"
            className="form-control"
            id="packaging"
            name="packaging"
            value={product.packaging}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="origin" className="form-label">
            Xuất xứ
          </label>
          <input
            type="text"
            className="form-control"
            id="origin"
            name="origin"
            value={product.origin}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="manufacturer" className="form-label">
            Nhà sản xuất
          </label>
          <input
            type="text"
            className="form-control"
            id="manufacturer"
            name="manufacturer"
            value={product.manufacturer}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="stockQuantity" className="form-label">
            Số lượng tồn kho
          </label>
          <input
            type="number"
            className="form-control"
            id="stockQuantity"
            name="stockQuantity"
            value={product.stockQuantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="seoTitle" className="form-label">
            Tiêu đề SEO
          </label>
          <input
            type="text"
            className="form-control"
            id="seoTitle"
            name="seoTitle"
            value={product.seoTitle}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="seoAlias" className="form-label">
            SEO Alias
          </label>
          <input
            type="text"
            className="form-control"
            id="seoAlias"
            name="seoAlias"
            value={product.seoAlias}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="isActive" className="form-label">
            Trạng thái sản phẩm
          </label>
          <input
            type="checkbox"
            className="form-check-input"
            id="isActive"
            name="isActive"
            checked={product.isActive}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="isActive">
            Còn hàng
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          Cập nhật sản phẩm
        </button>
      </form>
    </div>
  );
};

export default ProductEditPage;
