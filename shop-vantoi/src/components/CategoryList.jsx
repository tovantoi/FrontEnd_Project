import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import "../pages/AdminCss/Categorylist.css";

const CategorySearch = () => {
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const navigate = useNavigate();
  const [productRatings, setProductRatings] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      Swal.fire({
        title: "Đang tải sản phẩm...",
        showConfirmButton: false,
        allowOutsideClick: false,
      });
      try {
        const response = await fetch(
          "https://localhost:7022/minimal/api/get-categories"
        );
        if (!response.ok) throw new Error("Không thể tải danh mục.");
        const data = await response.json();
        setCategories(data);
        Swal.close();
      } catch (err) {
        setError(err.message);
        Swal.close();
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategoryId(categoryId); // 🆗 nhớ category nào đang chọn
    setPageNumber(1);
    try {
      const response = await fetch(
        `https://localhost:7022/minimal/api/get-products-by-category?id=${categoryId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      if (!response.ok)
        throw new Error("Không tìm thấy sản phẩm nào thuộc danh mục này.");
      const data = await response.json();
      const products = data.data || [];

      setTotalPages(data.totalPages || 1);
      setFilteredProducts(products);
      setError("");

      // Gọi thêm để lấy rating/sold cho từng sản phẩm
      const ratings = {};
      await Promise.all(
        products.map(async (product) => {
          try {
            const res = await fetch(
              `https://localhost:7022/minimal/api/get-product-cmt-start?id=${product.id}`
            );
            if (res.ok) {
              const ratingData = await res.json();
              ratings[product.id] = {
                totalReviews: ratingData.totalReviews,
                averageRating: ratingData.averageRating,
                totalSold: ratingData.totalSold,
              };
            }
          } catch (err) {
            console.error("Lỗi lấy rating/sold:", err.message);
          }
        })
      );
      setProductRatings(ratings);
    } catch (err) {
      Swal.fire({
        title: "Đã có lỗi xảy ra",
        text: err.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const formatSoldCount = (count) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + "k";
    return count;
  };
  const handlePageChange = async (newPageNumber) => {
    if (
      newPageNumber > 0 &&
      newPageNumber <= totalPages &&
      selectedCategoryId
    ) {
      setPageNumber(newPageNumber);
      try {
        const response = await fetch(
          `https://localhost:7022/minimal/api/get-products-by-category?id=${selectedCategoryId}&pageNumber=${newPageNumber}&pageSize=${pageSize}`
        );
        if (!response.ok) throw new Error("Không thể tải sản phẩm.");

        const data = await response.json();
        const products = data.data || [];

        setFilteredProducts(products);
        setError("");
        setTotalPages(data.totalPages || 1); // Update lại totalPages (nếu server trả)

        const ratings = {};
        await Promise.all(
          products.map(async (product) => {
            try {
              const res = await fetch(
                `https://localhost:7022/minimal/api/get-product-cmt-start?id=${product.id}`
              );
              if (res.ok) {
                const ratingData = await res.json();
                ratings[product.id] = {
                  totalReviews: ratingData.totalReviews,
                  averageRating: ratingData.averageRating,
                  totalSold: ratingData.totalSold,
                };
              }
            } catch (err) {
              console.error("Lỗi lấy rating/sold:", err.message);
            }
          })
        );
        setProductRatings(ratings);
      } catch (err) {
        console.error("Lỗi phân trang:", err.message);
      }
    }
  };

  return (
    <div style={{ backgroundColor: "#f8f9fc" }}>
      {" "}
      {/* hoặc bg-light nếu có */}
      <div
        className="mx-auto"
        style={{ maxWidth: "1600px", padding: "0 24px" }}
      >
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {/* --- Dành riêng phần danh mục sản phẩm --- */}
        <section className="category-slide-wrapper-section mb-5">
          <motion.h1
            className="product-name-title mb-3 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{
              scale: 1.05,
              textShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            KHÔNG NGẠI HẾT ĐỒ - CHỈ NGẠI HẾT TIỀN
          </motion.h1>
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            loop
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 2 },
              576: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              992: { slidesPerView: 5 },
            }}
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <div className="category-slide-wrapper">
                  <motion.div
                    className="card h-100 category-card card-hover-effect"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleCategoryClick(category.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={
                        category.imagePath || "https://via.placeholder.com/400"
                      }
                      alt={category.name}
                      className="card-img-top"
                      style={{ height: 180, objectFit: "cover" }}
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title mb-0">{category.name}</h5>
                    </div>
                  </motion.div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* --- Danh sách sản phẩm --- */}
        {filteredProducts.length > 0 ? (
          <div className="row g-4 mt-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                className="col-6 col-md-3"
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className="card h-100 shadow-sm product-card card-hover-effect position-relative"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="position-relative">
                    <img
                      src={
                        product.imagePath || "https://via.placeholder.com/400"
                      }
                      alt={product.productName}
                      className="card-img-top"
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
                              (product.discountPrice / product.regularPrice) *
                                100
                          )}
                          %
                        </div>
                      )}
                    <div className="product-hover-overlay">
                      <button className="btn btn-sm btn-primary">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                  <div className="card-body text-center d-flex flex-column justify-content-between p-2">
                    <h6
                      className="card-title fw-bold text-truncate mb-2"
                      title={product.productName}
                    >
                      {product.productName}
                    </h6>
                    <div className="d-flex flex-wrap justify-content-center align-items-center mb-2 gap-2 small text-muted">
                      {productRatings[product.id] ? (
                        <>
                          <span className="text-warning fw-bold">
                            ★{" "}
                            {productRatings[product.id].averageRating.toFixed(
                              1
                            )}
                          </span>
                          <span className="text-muted">
                            ({productRatings[product.id].totalReviews} đánh giá)
                          </span>
                          <span className="text-muted">
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
                      <p className="mb-0 text-danger fs-6 fw-bold">
                        ₫{product.discountPrice?.toLocaleString() || "N/A"}
                      </p>
                      {product.discountPrice && product.regularPrice && (
                        <p className="text-muted text-decoration-line-through small">
                          ₫{product.regularPrice?.toLocaleString() || "N/A"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center">Chọn danh mục để xem sản phẩm.</p>
        )}

        {/* --- PHÂN TRANG --- */}
        {filteredProducts.length > 0 && (
          <div className="pagination mt-4 d-flex justify-content-center align-items-center">
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
        )}
        <br></br>
        {/* Góc thời trang */}
        <section className="mb-5 bg-light p-4 rounded">
          <motion.h2
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
              <p>Góc thời trang</p>
            </center>
          </motion.h2>
          <div className="row g-4">
            {[
              { src: "/assets/3.jpg", link: "/fashion-corner-1" },
              { src: "/assets/2.jpg", link: "/fashion-corner-2" },
              { src: "/assets/1.jpg", link: "/fashion-corner-3" },
            ].map((item, idx) => (
              <div className="col-12 col-md-4" key={idx}>
                <motion.div
                  className="card h-100 shadow-sm card-hover-effect"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={item.src}
                    className="card-img-top"
                    alt="fashion"
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                  <div className="card-body text-center">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate(item.link)}
                    >
                      Xem thêm
                    </button>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </section>

        {/* Giới thiệu về shop */}
        <section className="about-store my-5">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <motion.img
                src="/assets/story-store.jpg"
                alt="Câu chuyện thương hiệu"
                className="img-fluid rounded shadow-sm"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="col-md-6">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              >
                <motion.h2
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
                    <p>Về VANTOI</p>
                  </center>
                </motion.h2>
                <p className="lead">
                  Được thành lập từ đam mê thời trang hiện đại, VANTOI cam kết
                  mang đến những sản phẩm tinh tế, cá tính và luôn bắt kịp xu
                  hướng toàn cầu.
                </p>
                <button
                  onClick={() => navigate("/about-us")}
                  className="btn btn-primary mt-3"
                >
                  Khám phá thêm
                </button>
              </motion.div>
            </div>
          </div>
        </section>
        <section className="hero-banner position-relative mb-5">
          <img
            src="/assets/banner.jpg"
            alt="Banner"
            className="w-100"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
          <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
            <h1 className="display-4 fw-bold">Khám Phá Phong Cách Của Bạn</h1>
            <p className="lead">Bộ sưu tập mới nhất - Ưu đãi không thể bỏ lỡ</p>
            <button
              className="btn btn-light mt-2"
              onClick={() => navigate("/collection")}
            >
              Mua ngay
            </button>
          </div>
        </section>

        {/* Bộ sưu tập mới */}
        <section className="highlight-collection my-5 py-5 bg-light rounded shadow-sm">
          <div className="text-center">
            <motion.h2
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
                <p>Bộ sưu tập Uber Dream 2025</p>
              </center>
            </motion.h2>
            <motion.p
              className="mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Đắm mình trong sự phá cách và tự do của bộ sưu tập mới nhất - nơi
              thời trang đường phố giao thoa với phong cách đương đại.
            </motion.p>
            <motion.img
              src="/assets/collection.jpg"
              alt="Urban Dream 2025"
              className="img-fluid rounded shadow"
              style={{ maxHeight: "450px", objectFit: "cover" }}
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1 }}
            />
            <div className="mt-4">
              <button
                onClick={() => navigate("/collection")}
                className="btn btn-outline-dark"
              >
                Xem Bộ Sưu Tập
              </button>
            </div>
          </div>
        </section>

        {/* Phong cách sống */}
        <section className="lifestyle-tips my-5">
          <div className="text-center mb-5">
            <motion.h2
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
                <p>Phong cách & cuộc sống</p>
              </center>
            </motion.h2>
          </div>
          <div className="row g-4">
            {[
              {
                title: "Bí quyết phối layer mùa hè",
                img: "/assets/tip1.jpg",
                link: "/fashion-tip-1",
              },
              {
                title: "Phong cách Minimalism",
                img: "/assets/minimails.jpg",
                link: "/fashion-tip-2",
              },
              {
                title: "Mẹo chọn giày cho từng outfit",
                img: "/assets/giay.jpg",
                link: "/fashion-tip-3",
              },
            ].map((tip, index) => (
              <div className="col-md-4" key={index}>
                <motion.div
                  className="card h-100 shadow-sm card-hover-effect"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={tip.img}
                    className="card-img-top"
                    alt={tip.title}
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{tip.title}</h5>
                    <button
                      className="btn btn-outline-primary mt-2"
                      onClick={() => navigate(tip.link)}
                    >
                      Xem thêm
                    </button>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CategorySearch;
