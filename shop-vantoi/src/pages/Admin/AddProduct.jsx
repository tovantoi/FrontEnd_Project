import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import Select from "react-select";

const AddProduct = () => {
  const [formData, setFormData] = useState({
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
    imageData: "",
    seoTitle: "",
    seoAlias: "",
    isActive: false,
    categoryIds: [],
  });

  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const [extraImages, setExtraImages] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://localhost:7022/minimal/api/get-name-categories"
        );
        const result = await response.json();
        setCategories(result); // Giả sử API trả về danh sách tên và ID danh mục
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
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
          imageData: base64Data.split(",")[1],
          mimeType: mimeType, // Lưu MIME type
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleExtraImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target.result;
        const mimeType = base64Data.split(";")[0].split(":")[1];

        setExtraImages((prev) => [
          ...prev,
          {
            imageData: base64Data.split(",")[1],
            mimeType: mimeType,
            preview: base64Data,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCategoryIdsChange = (selectedOptions) => {
    // Lấy id của các danh mục được chọn từ `react-select`
    const selectedCategories = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setFormData({
      ...formData,
      categoryIds: selectedCategories, // Cập nhật danh sách categoryIds
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      categoryIds: formData.categoryIds, // Danh mục đã chọn
    };

    try {
      Swal.fire({
        title: "Đang gửi yêu cầu...",
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

      const response = await fetch(
        "https://localhost:7022/minimal/api/create-product",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        const createdProductId = result?.data?.id || result?.id;

        // 🔁 Gửi ảnh phụ nếu có
        for (const [index, image] of extraImages.entries()) {
          await fetch(
            "https://localhost:7022/minimal/api/create-product-image",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                productId: createdProductId,
                imageUrl: image.imageData,
                color: formData.color || "default",
                sortOrder: index + 1,
              }),
            }
          );
        }

        Swal.fire({
          title: "Thêm sản phẩm thành công!",
          text: result.message || "Đã thêm sản phẩm!",
          icon: "success",
          confirmButtonText: "OK",
        });

        setErrors([]);
        setExtraImages([]); // Xóa ảnh phụ sau khi thêm xong

        setTimeout(() => {
          setFormData({
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
            imageData: "",
            seoTitle: "",
            seoAlias: "",
            isActive: false,
            categoryIds: [],
          });
          setMessage("");
          setErrors([]);
        }, 5000);
      } else {
        Swal.fire({
          title: "Thêm sản phẩm thất bại",
          text: result.message || "Vui lòng kiểm tra lại thông tin sản phẩm.",
          icon: "error",
          confirmButtonText: "Thử lại",
        });
        setErrors(result.errors || []);
      }
    } catch (error) {
      Swal.fire({
        title: "Đã xảy ra lỗi khi gọi API",
        text: error.message || "Vui lòng kiểm tra lại server.",
        icon: "error",
        confirmButtonText: "Thử lại",
      });
      setErrors([]);
      console.error(error);
    }
  };

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

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
          <p>THÊM MỚI SẢN PHẨM</p>
        </center>
      </motion.h1>

      {message && <div className="alert alert-info">{message}</div>}
      {errors.length > 0 && (
        <div className="alert alert-danger">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
      <motion.button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/admin/products")}
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

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Tên sản phẩm</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Giá gốc</label>
          <input
            type="number"
            name="regularPrice"
            value={formData.regularPrice}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Giá giảm</label>
          <input
            type="number"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-12">
          <label className="form-label">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Thương hiệu</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Kích thước</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Màu sắc</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Chất liệu</label>
          <input
            type="text"
            name="material"
            value={formData.material}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Giới tính</label>
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Đóng gói</label>
          <input
            type="text"
            name="packaging"
            value={formData.packaging}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Xuất xứ</label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Nhà sản xuất</label>
          <input
            type="text"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleInputChange}
            className="form-control"
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
        <div className="col-md-12">
          <label className="form-label">Ảnh phụ (có thể chọn nhiều)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            multiple
            onChange={handleExtraImageUpload}
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
        {extraImages.length > 0 && (
          <div className="mb-3">
            <label className="form-label fw-bold">Xem trước ảnh phụ:</label>
            <div className="d-flex flex-wrap gap-2">
              {extraImages.map((img, index) => (
                <img
                  key={index}
                  src={img.preview}
                  alt={`Ảnh phụ ${index + 1}`}
                  className="img-thumbnail"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div className="col-md-6">
          <label className="form-label">SEO Title</label>
          <input
            type="text"
            name="seoTitle"
            value={formData.seoTitle}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">SEO Alias</label>
          <input
            type="text"
            name="seoAlias"
            value={formData.seoAlias}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-12">
          <label className="form-label">Danh mục</label>
          <Select
            isMulti // Cho phép chọn nhiều mục
            name="categoryIds"
            options={categoryOptions} // Sử dụng các lựa chọn danh mục
            value={categoryOptions.filter((option) =>
              formData.categoryIds.includes(option.value)
            )} // Chỉ giữ các mục đã chọn
            onChange={handleCategoryIdsChange} // Cập nhật khi người dùng thay đổi lựa chọn
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Chọn danh mục"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Kích hoạt</label>
          <div className="form-check">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="form-check-input"
            />
            <label className="form-check-label">Có</label>
          </div>
        </div>
        <div className="col-12 text-center">
          <button type="submit" className="btn btn-primary">
            Thêm Sản Phẩm
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
