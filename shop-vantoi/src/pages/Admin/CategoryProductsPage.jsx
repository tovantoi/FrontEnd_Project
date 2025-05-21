import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import "../../CSS/ProductList.css"; // đường dẫn tùy chỉnh

const CategoryProductsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [productRatings, setProductRatings] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-products-by-category?id=${id}&pageNumber=${pageNumber}&pageSize=${pageSize}`
        );

        if (!response.ok) throw new Error("Không thể tải sản phẩm.");
        const data = await response.json();
        setProducts(data.data || []);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id, pageNumber, pageSize]);

  useEffect(() => {
    const fetchRatings = async () => {
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
          } catch {}
        })
      );
      setProductRatings(ratings);
    };
    if (products.length > 0) fetchRatings();
  }, [products]);

  const handlePageChange = (direction) => {
    setPageNumber((prevPage) => {
      const newPage = direction === "next" ? prevPage + 1 : prevPage - 1;
      return newPage > 0 && newPage <= totalPages ? newPage : prevPage;
    });
  };

  const formatSold = (count) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + "k";
    return count;
  };

  return (
    <div className="product-list container py-5">
      <motion.button
        onClick={() => navigate(-1)}
        className="btn btn-secondary mb-4"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{
          scale: 1.1,
          backgroundColor: "blue",
          color: "#fff",
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
        }}
        transition={{ duration: 0.3 }}
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
          <p>Sản phẩm trong danh mục</p>
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
                {/* Ảnh sản phẩm */}
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

                  {/* Rating + Đã bán */}
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
                          {formatSold(
                            productRatings[product.id].totalSold || 0
                          )}
                        </span>
                      </>
                    ) : (
                      <small className="text-muted">Đang cập nhật...</small>
                    )}
                  </div>

                  {/* Giá */}
                  <div className="price-section mt-2">
                    <p className="mb-0 text-danger fs-5 fw-bold">
                      <i>
                        <u>đ</u>
                      </i>{" "}
                      {product.discountPrice?.toLocaleString() || "N/A"}
                    </p>
                    {product.discountPrice && product.regularPrice && (
                      <p className="text-muted text-decoration-line-through small">
                        <i>
                          <u>đ</u>
                        </i>{" "}
                        {product.regularPrice?.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : loading ? (
          <div className="text-center">Đang tải...</div>
        ) : (
          <div className="alert alert-warning">Không có sản phẩm nào.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination mt-5 d-flex justify-content-center align-items-center">
        <motion.button
          className="btn btn-outline-primary mx-2"
          whileHover={{ scale: 1.1 }}
          onClick={() => handlePageChange("prev")}
          disabled={pageNumber <= 1}
        >
          ⬅️ Trang trước
        </motion.button>
        <span className="fw-bold">
          {pageNumber} / {totalPages}
        </span>
        <motion.button
          className="btn btn-outline-primary mx-2"
          whileHover={{ scale: 1.1 }}
          onClick={() => handlePageChange("next")}
          disabled={pageNumber >= totalPages}
        >
          Trang sau ➡️
        </motion.button>
      </div>
    </div>
  );
};

export default CategoryProductsPage;
