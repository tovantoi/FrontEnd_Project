import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../CSS/ProductList.css";

const CategoryProductList = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [products, setProducts] = useState([]);
  const [productRatings, setProductRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🧠 Lấy sản phẩm theo danh mục
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-products-by-category?id=${categoryId}&pageNumber=1&pageSize=20`
        );
        if (!response.ok) throw new Error("Lỗi khi tải sản phẩm.");
        const data = await response.json();
        setProducts(data.data || []);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);
  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const res = await fetch(
          `https://localhost:7022/minimal/api/get-category-name-by-id?id=${categoryId}`
        );
        if (!res.ok) throw new Error("Không lấy được tên danh mục");
        const data = await res.text(); // hoặc .json() nếu trả về object
        setCategoryName(data); // hoặc setCategoryName(data.name)
      } catch (err) {
        console.error("Lỗi lấy tên danh mục:", err);
      }
    };

    fetchCategoryName();
  }, [categoryId]);

  // 🧠 Lấy đánh giá theo sản phẩm
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
            console.error("Lỗi lấy đánh giá cho sản phẩm", product.id);
          }
        })
      );
      setProductRatings(ratings);
    };

    if (products.length > 0) {
      fetchProductRatings();
    }
  }, [products]);

  const formatSoldCount = (count) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + "k";
    return count;
  };

  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container my-4">
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
          <p>
            SẢN PHẨM TRONG DANH MỤC
            {categoryName && (
              <span className="text-primary ms-2">: {categoryName}</span>
            )}
          </p>
        </center>
      </motion.h1>

      <div className="row">
        {products.length > 0 ? (
          products.map((product, index) => (
            <motion.div
              key={product.id}
              className="col-md-3 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className="card h-100 shadow-sm"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="position-relative">
                  <img
                    src={product.imagePath || "https://via.placeholder.com/400"}
                    className="card-img-top"
                    alt={product.productName}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  {product.discountPrice &&
                    product.regularPrice &&
                    product.discountPrice < product.regularPrice && (
                      <span className="position-absolute top-0 start-0 badge bg-danger m-2">
                        -
                        {Math.round(
                          100 -
                            (product.discountPrice / product.regularPrice) * 100
                        )}
                        %
                      </span>
                    )}
                </div>

                <div className="card-body text-center">
                  <h5
                    className="card-title text-truncate"
                    title={product.productName}
                  >
                    {product.productName}
                  </h5>

                  {/* Đánh giá */}
                  {productRatings[product.id] ? (
                    <div className="mb-2 small text-muted">
                      ⭐ {productRatings[product.id].averageRating.toFixed(1)} |{" "}
                      {productRatings[product.id].totalReviews} đánh giá | Đã
                      bán{" "}
                      {formatSoldCount(productRatings[product.id].totalSold)}
                    </div>
                  ) : (
                    <div className="mb-2 small text-muted">
                      Đang tải đánh giá...
                    </div>
                  )}

                  {/* Giá */}
                  <p className="text-danger fw-bold fs-5 mb-1">
                    {product.discountPrice?.toLocaleString()} VND
                  </p>
                  {product.regularPrice &&
                    product.discountPrice &&
                    product.discountPrice < product.regularPrice && (
                      <p className="text-muted text-decoration-line-through mb-0">
                        {product.regularPrice.toLocaleString()} VND
                      </p>
                    )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="alert alert-warning text-center">
            Không có sản phẩm nào trong danh mục này.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProductList;
