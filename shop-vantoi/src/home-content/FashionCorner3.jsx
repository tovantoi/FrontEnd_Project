import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const FashionCorner3 = () => {
  return (
    <div className="container py-5">
      <Helmet>
        <title>Phụ kiện - điểm nhấn hoàn hảo | VANTOI</title>
      </Helmet>

      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="fw-bold mb-3" style={{ color: "#e67e22" }}>
          Phụ kiện: điểm nhấn hoàn hảo
        </h1>
        <p className="lead text-muted">
          Những chi tiết nhỏ tạo nên tổng thể hoàn hảo.
        </p>
      </motion.div>

      <motion.img
        src="/assets/1.png"
        alt="Phụ kiện thời trang"
        className="img-fluid rounded shadow mb-5"
        initial={{ scale: 0.9 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1 }}
      />

      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">1. Túi mini</h3>
        <p>
          Đơn giản, gọn nhẹ, túi mini là điểm nhấn cực chất cho outfit tối giản.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">2. Mũ bucket</h3>
        <p>Mang đậm phong cách streetwear, mũ bucket chưa bao giờ lỗi mốt.</p>
      </section>

      <blockquote className="blockquote text-center my-5">
        <p className="mb-0 fst-italic">
          "Phụ kiện - vũ khí bí mật để định hình cá tính."
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

export default FashionCorner3;
