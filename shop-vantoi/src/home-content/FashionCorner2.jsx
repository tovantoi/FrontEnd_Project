import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const FashionCorner2 = () => {
  return (
    <div className="container py-5">
      <Helmet>
        <title>Mẹo phối đồ với quần jeans - VANTOI</title>
      </Helmet>

      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="fw-bold mb-3" style={{ color: "#3498db" }}>
          Mẹo phối đồ với quần jeans
        </h1>
        <p className="lead text-muted">Đơn giản nhưng chưa bao giờ lỗi mốt!</p>
      </motion.div>

      <motion.img
        src="/assets/2.png"
        alt="Phối đồ quần jeans"
        className="img-fluid rounded shadow mb-5"
        initial={{ scale: 0.9 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1 }}
      />

      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">1. Áo thun basic</h3>
        <p>
          Áo thun trơn màu trắng/đen phối với quần jeans tạo nên phong cách
          casual cực kỳ ấn tượng.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">2. Blazer và jeans</h3>
        <p>
          Mix blazer cùng jeans vừa lịch sự vừa trẻ trung - một sự kết hợp không
          thể thiếu.
        </p>
      </section>

      <blockquote className="blockquote text-center my-5">
        <p className="mb-0 fst-italic">
          "Một chiếc quần jeans đẹp - nền tảng cho mọi outfit."
        </p>
      </blockquote>

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

export default FashionCorner2;
