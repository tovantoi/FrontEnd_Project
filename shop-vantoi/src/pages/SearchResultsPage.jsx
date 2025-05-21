import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook để điều hướng
  const { results = [], query } = location.state || {};

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Điều hướng tới trang chi tiết sản phẩm
  };

  return (
    <div className="search-results container py-4">
      <motion.h2
        className="text-center mb-4"
        initial={{ opacity: 0, scale: 0.8, y: -30 }} // Bắt đầu mờ, nhỏ và di chuyển từ trên xuống
        animate={{ opacity: 1, scale: 1, y: 0 }} // Hiển thị rõ, kích thước bình thường và đúng vị trí
        transition={{
          duration: 1.2, // Thời gian thực hiện hiệu ứng
          ease: "easeOut", // Làm mềm hiệu ứng
        }}
        whileHover={{
          scale: 1.1, // Phóng to nhẹ khi hover
          textShadow: "0px 0px 10px rgba(255, 255, 255, 0.8)", // Ánh sáng khi hover
          color: "#e91e63", // Đổi màu chữ khi hover
        }}
        style={{
          color: "#1e88e5", // Màu mặc định của tiêu đề
          fontWeight: "bold",
        }}
      >
        Kết quả tìm kiếm cho: "{query}"
      </motion.h2>
      {results.length === 0 ? (
        <p className="text-center">Không tìm thấy sản phẩm nào phù hợp.</p>
      ) : (
        <div className="row">
          {results.map((product) => (
            <div
              className="col-md-3 mb-4"
              key={product.id}
              onClick={() => handleProductClick(product.id)} // Thêm sự kiện click
              style={{ cursor: "pointer" }} // Thêm style để hiển thị con trỏ tay
            >
              <div className="card h-100">
                <img
                  src={
                    product.imagePath && product.imagePath.trim() !== ""
                      ? product.imagePath
                      : "https://via.placeholder.com/400"
                  }
                  className="card-img-top"
                  alt={product.productName}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.productName}</h5>
                  <p className="card-text text-primary">
                    Giá: {product.discountPrice || product.regularPrice} VND
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
