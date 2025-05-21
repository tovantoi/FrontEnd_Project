import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import "../CSS/ProductDetail.css";

const ProductDetail = ({ addToCart }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [virtualTryOnImage, setVirtualTryOnImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [previewFiles, setPreviewFiles] = useState([]);
  const [mediaBase64List, setMediaBase64List] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(15);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showSizeChart, setShowSizeChart] = useState(false);

  // const colorOptions = [
  //   { label: "Anime01 Đen", image: "/images/color1.jpg" },
  //   { label: "Anime01 Trắng", image: "/images/color2.jpg" },
  //   { label: "TS02-Xám", image: "/images/color3.jpg" },
  //   { label: "TS02-Đen", image: "/images/color4.jpg" },
  //   { label: "TOM-Đen", image: "/images/color5.jpg" },
  //   { label: "TOM-Trắng", image: "/images/color6.jpg" },
  //   { label: "FIRE-Xám", image: "/images/color7.jpg" },
  //   { label: "FIRE-Đen", image: "/images/color8.jpg" },
  //   { label: "FIRE-Trắng", image: "/images/color9.jpg" },
  // ];

  const sizeOptions = [
    { label: "M (Dưới 46Kg)" },
    { label: "L (46-65Kg)" },
    { label: "XL (65-75Kg)" },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      Swal.fire({
        title: "Đang tải sản phẩm...",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-product-detail?id=${productId}`
        );
        if (!response.ok) throw new Error("Không tìm thấy sản phẩm.");
        const data = await response.json();
        setProduct(data);
        Swal.close();
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi.");
        Swal.close();
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-product-review-by-id?id=${productId}`
        );
        if (!response.ok) throw new Error("Không thể tải bình luận");
        const data = await response.json();
        setReviews(data || []);
      } catch (err) {
        console.error("Lỗi tải bình luận:", err.message);
      }
    };

    fetchProduct();
    fetchReviews(); // ✅ Đặt trong useEffect nên sẽ gọi đúng
  }, [productId]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!product) {
    return null;
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUserImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleVirtualTryOn = async () => {
    if (!userImage) {
      Swal.fire("Lỗi!", "Vui lòng tải ảnh của bạn lên trước!", "warning");
      return;
    }

    if (!product || !product.imagePath) {
      Swal.fire("Lỗi!", "Không tìm thấy ảnh sản phẩm để thử!", "warning");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("person", userImage);

      // 🧥 Tải ảnh áo từ URL của sản phẩm
      const clothRes = await fetch(product.imagePath);
      if (!clothRes.ok) throw new Error("Không thể tải ảnh quần áo từ URL");

      const clothBlob = await clothRes.blob();
      if (!clothBlob.type.startsWith("image/")) {
        throw new Error("Ảnh sản phẩm không hợp lệ");
      }

      formData.append("cloth", clothBlob, "cloth.jpg");

      // 📡 Gửi form đến Flask API
      const apiRes = await fetch("http://localhost:5000/tryon", {
        method: "POST",
        body: formData,
      });

      if (!apiRes.ok) {
        const errorText = await apiRes.text();
        throw new Error("Lỗi từ API: " + errorText);
      }

      const result = await apiRes.json();
      console.log("✅ URL ảnh kết quả:", result.result_url);

      if (!result.result_url) {
        throw new Error("Không nhận được ảnh kết quả từ server");
      }

      // 🖼️ Cập nhật state ảnh kết quả
      setVirtualTryOnImage(result.result_url);
      Swal.fire("Thành công!", "Thử đồ ảo thành công!", "success");
    } catch (error) {
      console.error("Lỗi thử đồ:", error);
      Swal.fire("Thất bại", error.message || "Lỗi không xác định", "error");
    }
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result;
        const mimeType = base64Data.split(";")[0].split(":")[1];
        const data = base64Data.split(",")[1]; // Lấy phần base64 sau dấu phẩy
        resolve({ base64: data, mimeType });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setPreviewFiles([...previewFiles, ...files]);

    const base64Promises = files.map((file) => convertToBase64(file));
    const converted = await Promise.all(base64Promises);
    setMediaBase64List([...mediaBase64List, ...converted]);
  };
  const handleRemoveFile = (index) => {
    const newPreviews = [...previewFiles];
    const newBase64s = [...mediaBase64List];
    newPreviews.splice(index, 1);
    newBase64s.splice(index, 1);
    setPreviewFiles(newPreviews);
    setMediaBase64List(newBase64s);
  };
  const handleReviewSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userID || user?.id; // Dùng đúng key thực tế

    if (!userId) {
      await Swal.fire({
        title: "Bạn chưa đăng nhập",
        text: "Vui lòng đăng nhập để đánh giá sản phẩm.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    let imageBase64 = null;
    let videoBase64 = null;

    mediaBase64List.forEach((media) => {
      if (media.mimeType.startsWith("image/")) {
        imageBase64 = media.base64;
      } else if (media.mimeType.startsWith("video/")) {
        videoBase64 = media.base64;
      }
    });

    const requestBody = {
      productId,
      userId,
      rating,
      comment,
      ImageUrl: imageBase64,
      VideoUrl: videoBase64,
    };

    try {
      const res = await fetch(
        "https://localhost:7022/minimal/api/create-product-review",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await res.json();
      console.log("📦 Review Response:", data);

      if (res.ok && data.isSuccess) {
        await Swal.fire({
          title: "Thành công!",
          text: "Đánh giá của bạn đã được gửi.",
          icon: "success",
          confirmButtonText: "OK",
        });

        setRating(0);
        setComment("");
        setPreviewFiles([]);
        setMediaBase64List([]);
      } else {
        await Swal.fire({
          title: "Không thể gửi đánh giá",
          text:
            data?.message || "Bạn chưa mua sản phẩm này hoặc đã có lỗi xảy ra.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      await Swal.fire({
        title: "Lỗi hệ thống!",
        text: err.message || "Không thể gửi đánh giá do lỗi kết nối.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const getDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3); // +3 ngày

    const formatDay = (day) => (day < 10 ? `0${day}` : day);
    const formatMonth = (month) => (month < 10 ? `0${month}` : month);

    const day = formatDay(deliveryDate.getDate());
    const month = formatMonth(deliveryDate.getMonth() + 1);

    return `${day} Th${month}`;
  };

  return (
    <div className="container mt-4">
      <motion.button
        onClick={() => navigate(-1)}
        className="btn btn-primary mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{
          scale: 1.1,
          backgroundColor: "#0056b3",
          boxShadow: "0px 0px 10px rgba(0, 0, 255, 0.5)",
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        ← Quay lại
      </motion.button>

      <div className="row g-4 mb-5">
        {/* Hình ảnh sản phẩm */}
        <div className="col-md-6">
          <motion.img
            src={product.imagePath || "https://via.placeholder.com/400"}
            alt={product.productName}
            className="img-fluid rounded shadow-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            style={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
              border: "2px solid #eee",
            }}
          />

          {/* Ảnh nhỏ cố định */}
          {/* <div className="d-flex gap-2 mt-3 flex-wrap">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={`/images/preview${i}.jpg`}
                alt={`preview-${i}`}
                className="rounded"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  border: "1px solid #ddd",
                }}
              />
            ))}
          </div> */}
        </div>

        {/* Thông tin sản phẩm */}
        <div className="col-md-6">
          <h2 className="fw-bold">{product.productName}</h2>

          {/* Giá */}
          <div className="d-flex align-items-center gap-3 my-3">
            <h3 className="text-danger mb-0">
              ₫{product.discountPrice?.toLocaleString()}
            </h3>
            <span className="text-muted text-decoration-line-through">
              ₫{product.regularPrice?.toLocaleString()}
            </span>
            <span className="badge bg-danger">
              -
              {Math.round(
                100 - (product.discountPrice / product.regularPrice) * 100
              )}
              %
            </span>
          </div>
          {/* Vận chuyển */}
          <div className="border-top pt-3 mb-3">
            <h6 className="fw-bold mb-2">
              <i className="bi bi-truck"></i> Vận Chuyển
            </h6>
            <div className="d-flex flex-column gap-1">
              <span>
                🚚 Nhận từ <strong>{getDeliveryDate()}</strong>
              </span>
              <span>🚛 Miễn phí vận chuyển</span>
              <small className="text-muted">
                Tặng Voucher ₫15.000 nếu đơn giao sau thời gian trên.
              </small>
            </div>
          </div>

          {/* An tâm mua sắm */}
          <div className="border-top pt-3 mb-3">
            <h6 className="fw-bold mb-2">
              <i className="bi bi-shield-check"></i> An tâm mua sắm cùng Shopee
            </h6>
            <div className="text-muted small">
              🛡️ Trả hàng miễn phí 15 ngày · Bảo hiểm Thời trang
            </div>
          </div>

          {/* Màu sắc chọn */}
          {/* <div className="mb-4">
            <h5 className="fw-bold">Màu Sắc</h5>
            <div className="d-flex flex-wrap gap-2">
              {colorOptions.map((color, index) => (
                <div
                  key={index}
                  className={`color-option ${
                    selectedColor === index ? "active" : ""
                  }`}
                  onClick={() => setSelectedColor(index)}
                >
                  <img
                    src={color.image}
                    alt={color.label}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <div className="text-center small mt-1">{color.label}</div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Size */}
          <div className="mb-4">
            <h5 className="fw-bold">Kích Cỡ</h5>
            <div className="d-flex flex-wrap gap-2">
              {sizeOptions.map((size, index) => (
                <button
                  key={index}
                  className={`btn btn-outline-secondary ${
                    selectedSize === index ? "active" : ""
                  }`}
                  onClick={() => setSelectedSize(index)}
                  style={{ minWidth: "100px" }}
                >
                  {size.label}
                </button>
              ))}
            </div>
            <div className="mt-2">
              <button
                className="btn btn-link text-primary p-0"
                style={{ textDecoration: "none" }}
                onClick={() => setShowSizeChart(true)}
              >
                ➡️ Bảng Quy Đổi Kích Cỡ
              </button>
            </div>
          </div>

          {/* Số lượng */}
          <div className="mb-4 d-flex align-items-center gap-3">
            <h6 className="mb-0 fw-bold">Số Lượng:</h6>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-light border"
                onClick={() => setQuantity(Math.max(quantity - 1, 1))}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                readOnly
                style={{
                  width: "50px",
                  textAlign: "center",
                  border: "1px solid #ddd",
                  margin: "0 5px",
                  borderRadius: "4px",
                }}
              />
              <button
                className="btn btn-light border"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <div className="small text-muted">1842846 sản phẩm có sẵn</div>
          </div>

          {/* Nút hành động */}
          <div className="d-flex gap-3">
            <motion.button
              className="btn btn-outline-danger flex-fill"
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                // if (selectedColor === null || selectedSize === null) {
                //   Swal.fire("Bạn chưa chọn màu/size", "", "warning");
                //   return;
                // }
                addToCart({
                  ...product,
                  quantity,
                  // selectedColor: colorOptions[selectedColor]?.label,
                  selectedSize: sizeOptions[selectedSize]?.label,
                });
                Swal.fire("Đã thêm vào giỏ hàng", "", "success");
              }}
            >
              🛒 Thêm vào giỏ hàng
            </motion.button>

            <motion.button
              className="btn btn-danger flex-fill"
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                // if (selectedColor === null || selectedSize === null) {
                //   Swal.fire("Bạn chưa chọn màu/size", "", "warning");
                //   return;
                // }

                const productToBuyNow = {
                  ...product,
                  quantity,
                  // selectedColor: colorOptions[selectedColor]?.label,
                  selectedSize: sizeOptions[selectedSize]?.label,
                };

                localStorage.setItem(
                  "buyNowProduct",
                  JSON.stringify(productToBuyNow)
                );

                navigate("/checkout");
              }}
            >
              Mua Ngay
            </motion.button>
          </div>
        </div>
      </div>
      {/* Chi tiết sản phẩm */}
      {/* Chi tiết sản phẩm */}
      <div className="product-detail-specs mt-5 p-4 bg-white rounded-3 shadow-sm">
        <h3 className="fw-bold mb-4 border-bottom pb-2">Chi tiết sản phẩm</h3>
        <div className="row">
          <div className="col-md-6">
            <ul className="list-unstyled">
              <li className="spec-item">
                <span className="spec-label">Thương hiệu:</span>
                <span className="spec-value">
                  {product.brand || "Đang cập nhật"}
                </span>
              </li>
              <li className="spec-item">
                <span className="spec-label">Chất liệu:</span>
                <span className="spec-value">
                  {product.material || "Đang cập nhật"}
                </span>
              </li>
              <li className="spec-item">
                <span className="spec-label">Màu sắc:</span>
                <span className="spec-value">
                  {product.color || "Đang cập nhật"}
                </span>
              </li>
              <li className="spec-item">
                <span className="spec-label">Xuất xứ:</span>
                <span className="spec-value">
                  {product.origin || "Đang cập nhật"}
                </span>
              </li>
              <li className="spec-item">
                <span className="spec-label">Nhà sản xuất:</span>
                <span className="spec-value">
                  {product.manufacturer || "Đang cập nhật"}
                </span>
              </li>
            </ul>
          </div>
          <div className="col-md-6">
            <ul className="list-unstyled">
              <li className="spec-item">
                <span className="spec-label">Giới tính phù hợp:</span>
                <span className="spec-value">
                  {product.gender || "Đang cập nhật"}
                </span>
              </li>
              <li className="spec-item">
                <span className="spec-label">Đóng gói:</span>
                <span className="spec-value">
                  {product.packaging || "Đang cập nhật"}
                </span>
              </li>
              <li className="spec-item">
                <span className="spec-label">Tên SEO:</span>
                <span className="spec-value">
                  {product.seoTitle || "Đang cập nhật"}
                </span>
              </li>
              <li className="spec-item">
                <span className="spec-label">Đường dẫn SEO:</span>
                <span className="spec-value">
                  {product.seoAlias || "Đang cập nhật"}
                </span>
              </li>
              <li className="spec-item">
                <span className="spec-label">Kích thước:</span>
                <span className="spec-value">
                  {product.size || "Đang cập nhật"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3>Mô tả sản phẩm</h3>
        <p>{product.description}</p>
      </div>
      {showSizeChart && (
        <div className="modal-backdrop-custom">
          <div className="modal-content-custom">
            <div className="modal-header">
              <h5 className="modal-title">Bảng Quy Đổi Kích Cỡ</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowSizeChart(false)}
              ></button>
            </div>
            <div className="modal-body">
              <p className="small text-muted">
                Bảng quy đổi kích cỡ này được cung cấp bởi người bán và có thể
                lệch 1-2cm so với thực tế.
              </p>

              <table className="table table-bordered text-center">
                <thead className="table-light">
                  <tr>
                    <th>Size (Quốc tế)</th>
                    <th>Chiều rộng (cm)</th>
                    <th>Chiều dài áo (cm)</th>
                    <th>Chiều dài tay áo (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>M</td>
                    <td>51</td>
                    <td>67</td>
                    <td>23</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>53</td>
                    <td>70</td>
                    <td>23</td>
                  </tr>
                  <tr>
                    <td>XL</td>
                    <td>56</td>
                    <td>73</td>
                    <td>23</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="mb-3">
          <label className="form-label">Tải ảnh của bạn lên:</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageUpload}
          />
          {previewImage && (
            <img src={previewImage} alt="Preview" className="img-fluid mt-2" />
          )}
        </div>

        <button className="btn btn-primary" onClick={handleVirtualTryOn}>
          Thử đồ ảo
        </button>
      </div>
      {virtualTryOnImage && (
        <div className="mt-4">
          <h4>Kết quả thử đồ ảo</h4>
          <img
            src={virtualTryOnImage}
            alt="Kết quả thử đồ"
            className="img-fluid rounded border"
            style={{ maxWidth: "100%", maxHeight: "500px" }}
          />
        </div>
      )}

      <div className="mt-4">
        <h3>Đánh giá sản phẩm</h3>

        <div className="mb-4 d-flex align-items-center gap-2">
          <label className="fw-semibold me-2">Chọn đánh giá:</label>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(rating)}
              style={{
                cursor: "pointer",
                fontSize: "28px",
                transition: "transform 0.2s",
                color: star <= (hover || rating) ? "#FFD700" : "#E4E5E9",
                transform: star === hover ? "scale(1.2)" : "scale(1)",
              }}
              title={`${star} sao`}
            >
              <FaStar />
            </span>
          ))}
          {rating > 0 && (
            <span className="ms-2 text-success fw-medium">{rating} sao</span>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">
            Viết bình luận và tải ảnh/video đánh giá:
          </label>

          <div className="position-relative border rounded p-3">
            {/* Hiển thị preview các ảnh/video */}
            <div className="d-flex gap-2 flex-wrap mb-3">
              {previewFiles.map((file, index) => (
                <div
                  key={index}
                  className="position-relative"
                  style={{ width: "100px", height: "100px" }}
                >
                  {file.type.startsWith("image/") ? (
                    <img
                      src={file.url}
                      alt="preview"
                      className="rounded"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <video
                      src={file.url}
                      controls
                      className="rounded"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  {/* Nút X xoá */}
                  <button
                    type="button"
                    className="position-absolute top-0 end-0 btn btn-sm btn-danger rounded-circle"
                    style={{
                      transform: "translate(50%, -50%)",
                      padding: "2px 6px",
                    }}
                    onClick={() => handleRemoveFile(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Nút dấu cộng đẹp */}
            <label
              htmlFor="file-upload"
              className="d-inline-block mb-2"
              style={{ cursor: "pointer" }}
            >
              <div className="badge bg-primary text-white rounded-circle p-3 d-flex justify-content-center align-items-center">
                <span style={{ fontSize: "24px", fontWeight: "bold" }}>+</span>
              </div>
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*,video/*"
              className="d-none"
              onChange={handleFileChange}
            />

            {/* Textarea bên dưới preview */}
            <textarea
              className="form-control mt-3"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Viết bình luận..."
            ></textarea>
          </div>
        </div>

        <button
          className="btn btn-success w-100 mt-3"
          onClick={handleReviewSubmit}
        >
          Gửi đánh giá
        </button>
      </div>
      <div className="mt-5">
        <h4>Bình luận sản phẩm</h4>

        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            paddingRight: "10px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #dee2e6",
          }}
        >
          {reviews.slice(0, visibleReviews).map((review, index) => (
            <div
              key={index}
              className="p-3 mb-2"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #dee2e6",
                borderRadius: "6px",
              }}
            >
              <div className="d-flex align-items-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={18}
                    color={i < review.rating ? "#FFD700" : "#E4E5E9"}
                  />
                ))}
              </div>

              {/* Hiển thị bình luận dù không có ảnh */}
              <p className="mb-0">{review.comment}</p>

              {/* Nếu có ảnh thì mới hiển thị */}
              {review.imageUrl && (
                <img
                  src={review.imageUrl}
                  alt="Ảnh đánh giá"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    marginTop: "8px",
                  }}
                  className="img-fluid rounded"
                />
              )}

              {review.videoUrl && (
                <video
                  src={review.videoUrl}
                  controls
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    marginTop: "10px",
                  }}
                />
              )}
            </div>
          ))}

          {visibleReviews < reviews.length && (
            <button
              className="btn btn-outline-primary w-100 my-2"
              onClick={() => setVisibleReviews(visibleReviews + 15)}
            >
              Hiển thị thêm bình luận
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
