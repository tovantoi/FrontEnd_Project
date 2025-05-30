import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, ratingData, index }) => {
  const navigate = useNavigate();

  const formatSoldCount = (count) =>
    count >= 1000 ? (count / 1000).toFixed(1) + "k" : count;

  return (
    <motion.div
      className="col-6 col-md-3"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
    >
      <div
        className="card h-100 shadow-sm product-card card-hover-effect position-relative"
        style={{ cursor: "pointer", overflow: "hidden" }}
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <div className="position-relative">
          <img
            src={
              product.imagePath && product.imagePath.trim() !== ""
                ? product.imagePath
                : "https://via.placeholder.com/400"
            }
            alt={product.productName}
            className="card-img-top img-fluid"
            style={{
              height: "250px",
              objectFit: "cover",
              transition: "transform 0.5s ease",
            }}
          />
          {product.discountPrice &&
            product.regularPrice &&
            product.discountPrice < product.regularPrice && (
              <div className="discount-badge">
                -
                {Math.round(
                  100 - (product.discountPrice / product.regularPrice) * 100
                )}
                %
              </div>
            )}
        </div>

        <div className="card-body text-center d-flex flex-column justify-content-between p-2">
          <h5
            className="card-title fw-bold text-truncate mb-2"
            title={product.productName}
          >
            {product.productName}
          </h5>

          <div className="d-flex justify-content-center align-items-center gap-2 mb-2 flex-wrap">
            {ratingData ? (
              <>
                <motion.span
                  className="fw-bold text-warning"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  ★ {ratingData.averageRating?.toFixed(1)}
                </motion.span>
                <small className="text-muted">
                  ({ratingData.totalReviews} đánh giá)
                </small>
                <span className="text-muted small">
                  | Đã bán {formatSoldCount(ratingData.totalSold || 0)}
                </span>
              </>
            ) : (
              <small className="text-muted">Đang cập nhật...</small>
            )}
          </div>

          <div className="price-section mt-2">
            <p className="mb-0 text-danger fs-5 fw-bold">
              <i>
                <u>đ</u>
              </i>
              {product.discountPrice?.toLocaleString() || "N/A"}
            </p>
            {product.discountPrice && product.regularPrice && (
              <p className="text-muted text-decoration-line-through small">
                <i>
                  <u>đ</u>
                </i>
                {product.regularPrice?.toLocaleString() || "N/A"}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
