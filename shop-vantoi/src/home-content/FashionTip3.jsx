import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const FashionTip3 = () => {
  return (
    <div className="container py-5">
      <Helmet>
        <title>Mẹo chọn giày phù hợp - VANTOI</title>
      </Helmet>

      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="fw-bold mb-3" style={{ color: "#f39c12" }}>
          Mẹo chọn giày hoàn hảo
        </h1>
        <p className="lead text-muted">Giày đẹp nâng tầm phong cách.</p>
      </motion.div>

      <motion.img
        src="/assets/tips3.jpg"
        alt="Chọn giày"
        className="img-fluid rounded shadow mb-5"
        initial={{ scale: 0.9 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Section */}
      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">1. Sneakers trắng</h3>
        <p>
          Basic, clean và cực kỳ linh hoạt. Dùng được với 90% các loại outfit.
        </p>
      </section>

      {/* Section */}
      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">2. Boots cổ ngắn</h3>
        <p>
          Thời trang và mạnh mẽ, hợp cho mùa đông và phong cách streetwear chất
          lừ.
        </p>
      </section>

      {/* Nút quay lại */}
      <div className="text-center mt-5">
        <motion.button
          className="btn btn-lg btn-outline-primary"
          whileHover={{ scale: 1.1 }}
          onClick={() => window.history.back()}
        >
          ⬅️ Quay lại
        </motion.button>
      </div>
    </div>
  );
};

export default FashionTip3;
