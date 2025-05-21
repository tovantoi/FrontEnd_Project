import React from "react";

const ProductCard = ({ product }) => {
  if (!product) {
    return null; // Trả về null nếu `product` không được truyền
  }

  return (
    <div className="product-card">
      <img
        src={
          product.imagePath && product.imagePath.trim() !== ""
            ? `https://localhost:7022/${product.imagePath}`
            : "https://via.placeholder.com/400"
        }
        alt={product.productName}
        style={{ width: "100%", height: "150px", objectFit: "cover" }}
      />
      <h3>{product.productName}</h3>
      <p>{product.discountPrice || product.regularPrice} VND</p>
      <button>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
