import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const FashionCorner1 = () => {
  return (
    <div className="container py-5">
      <Helmet>
        <title>Xu hướng thời trang hè 2025 - VANTOI</title>
      </Helmet>

      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="fw-bold mb-3" style={{ color: "#ff6f61" }}>
          Xu hướng thời trang hè 2025
        </h1>
        <p className="lead text-muted">Mát mẻ, năng động và cực kỳ phá cách!</p>
      </motion.div>

      <motion.img
        src="/assets/3.png"
        alt="Xu hướng hè"
        className="img-fluid rounded shadow mb-5"
        initial={{ scale: 0.9 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1 }}
      />

      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">1. Màu pastel lên ngôi</h3>
        <p>
          Các gam màu nhẹ nhàng như xanh mint, hồng phấn, vàng bơ chiếm trọn
          spotlight mùa hè này.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">
          2. Chất liệu lụa, linen mát mẻ
        </h3>
        <p>
          Nhẹ nhàng, thoáng khí nhưng vẫn rất sang trọng - đó là đặc trưng của
          mùa hè năm nay.
        </p>
      </section>

      <blockquote className="blockquote text-center my-5">
        <p className="mb-0 fst-italic">
          "Mùa hè là thời gian để tỏa sáng rực rỡ."
        </p>
      </blockquote>

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

export default FashionCorner1;
