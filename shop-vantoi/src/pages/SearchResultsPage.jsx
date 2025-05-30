// pages/SearchResults.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import "./CSS/Search.css";

const SearchResults = () => {
  const location = useLocation();
  const { results = [], query = "" } = location.state || {};
  const [productRatings, setProductRatings] = useState({});

  useEffect(() => {
    const fetchRatings = async () => {
      const ratings = {};
      await Promise.all(
        results.map(async (product) => {
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
          } catch {
            ratings[product.id] = null;
          }
        })
      );
      setProductRatings(ratings);
    };

    if (results.length > 0) fetchRatings();
  }, [results]);

  return (
    <div className="container py-5">
      <motion.h2
        className="search-heading text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Kết quả tìm kiếm cho: <span className="highlight-query">"{query}"</span>
      </motion.h2>

      {results.length > 0 ? (
        <div className="row g-4">
          {results.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              ratingData={productRatings[product.id]}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="alert alert-warning text-center">
          Không tìm thấy sản phẩm nào phù hợp.
        </div>
      )}
    </div>
  );
};

export default SearchResults;
