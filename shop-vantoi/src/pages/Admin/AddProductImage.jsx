// AddProductImage.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

const AddProductImage = () => {
  const { productId } = useParams(); // lấy id từ URL
  const navigate = useNavigate();
  const [extraImages, setExtraImages] = useState([]);
  const [color, setColor] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

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
            preview: base64Data,
            mimeType: mimeType,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const [index, image] of extraImages.entries()) {
      const res = await fetch(
        "https://localhost:7022/minimal/api/create-product-image",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: parseInt(productId),
            imageUrl: image.imageData,
            color: color,
            sortOrder: index + 1,
            stockQuantity: parseInt(stockQuantity) || 0,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        Swal.fire("Lỗi", data.message || "Không thể thêm ảnh phụ", "error");
        return;
      }
    }

    Swal.fire("Thành công", "Đã thêm ảnh phụ", "success").then(() => {
      navigate("/admin/products");
    });
  };

  return (
    <div className="container mt-4">
      <h3>Thêm ảnh phụ cho sản phẩm #{productId}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Màu sắc</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập màu ảnh (ví dụ: Đỏ, Xanh...)"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Số lượng tồn kho</label>
          <input
            type="number"
            className="form-control"
            placeholder="Nhập số lượng tồn kho cho màu này"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            min="0"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Ảnh phụ (có thể chọn nhiều):</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            multiple
            onChange={handleExtraImageUpload}
          />
        </div>

        {extraImages.length > 0 && (
          <div className="mb-3">
            <label className="form-label">Xem trước:</label>
            <div className="d-flex flex-wrap gap-2">
              {extraImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img.preview}
                  alt={`preview-${idx}`}
                  className="img-thumbnail"
                  style={{ width: 100, height: 100, objectFit: "cover" }}
                />
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          Thêm ảnh phụ
        </button>
      </form>
    </div>
  );
};

export default AddProductImage;
