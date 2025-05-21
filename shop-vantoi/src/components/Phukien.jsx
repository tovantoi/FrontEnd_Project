import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../CSS/ProductList.css"; // Dùng lại CSS chung

const ProductsByCategory = () => {
  const [products, setProducts] = useState([]);
  const [productRatings, setProductRatings] = useState({});
  const [error, setError] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const categoryId = 42;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-products-by-category?id=${categoryId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            setError("Không tìm thấy sản phẩm nào thuộc danh mục này.");
            setProducts([]);
            return;
          }
          throw new Error("Đã xảy ra lỗi khi tải sản phẩm.");
        }

        const data = await response.json();
        setProducts(data.data || []);
        setTotalPages(data.totalPages || 1);
        setError("");
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải sản phẩm.");
      }
    };

    fetchProducts();
  }, [categoryId, pageNumber]);

  useEffect(() => {
    const fetchProductRatings = async () => {
      const ratings = {};
      await Promise.all(
        products.map(async (product) => {
          try {
            const res = await fetch(
              `https://localhost:7022/minimal/api/get-product-cmt-start?id=${product.id}`
            );
            if (res.ok) {
              const data = await res.json();
              ratings[product.id] = {
                totalReviews: data.totalReviews,
                averageRating: data.averageRating,
                totalSold: data.totalSold,
              };
            }
          } catch (error) {
            console.error("Lỗi khi lấy đánh giá:", product.id);
          }
        })
      );
      setProductRatings(ratings);
    };
    if (products.length > 0) {
      fetchProductRatings();
    }
  }, [products]);

  const handlePageChange = (newPageNumber) => {
    if (newPageNumber > 0 && newPageNumber <= totalPages) {
      setPageNumber(newPageNumber);
    }
  };

  const formatSoldCount = (count) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + "k";
    return count;
  };

  return (
    <div className="product-list container py-5">
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
          <p>DANH SÁCH PHỤ KIỆN</p>
        </center>
      </motion.h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        {products.length > 0 ? (
          products.map((product, index) => (
            <motion.div
              className="col-6 col-md-3"
              key={product.id}
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
                          100 -
                            (product.discountPrice / product.regularPrice) * 100
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
                    {productRatings[product.id] ? (
                      <>
                        <motion.span
                          className="fw-bold text-warning"
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          ★{" "}
                          {productRatings[product.id].averageRating.toFixed(1)}
                        </motion.span>
                        <small className="text-muted">
                          ({productRatings[product.id].totalReviews} đánh giá)
                        </small>
                        <span className="text-muted small">
                          | Đã bán{" "}
                          {formatSoldCount(
                            productRatings[product.id].totalSold || 0
                          )}
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
          ))
        ) : (
          <div className="alert alert-warning">Không có sản phẩm nào.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination mt-5 d-flex justify-content-center align-items-center">
        <motion.button
          className="btn btn-outline-primary mx-2"
          whileHover={{ scale: 1.1 }}
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
        >
          ⬅️ Trang trước
        </motion.button>
        <span className="fw-bold">
          {pageNumber} / {totalPages}
        </span>
        <motion.button
          className="btn btn-outline-primary mx-2"
          whileHover={{ scale: 1.1 }}
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={pageNumber === totalPages}
        >
          Trang sau ➡️
        </motion.button>
      </div>
    </div>
  );
};

export default ProductsByCategory;
