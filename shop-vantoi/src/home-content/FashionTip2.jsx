import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const FashionTip2 = () => {
  return (
    <div className="container py-5">
      <Helmet>
        <title>Phong cách Minimalism - VANTOI</title>
      </Helmet>

      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="fw-bold mb-3" style={{ color: "#6f42c1" }}>
          Phong cách Minimalism
        </h1>
        <p className="lead text-muted">Đơn giản mà nổi bật.</p>
      </motion.div>

      <motion.img
        src="/assets/tips2.jpg"
        alt="Phong cách tối giản"
        className="img-fluid rounded shadow mb-5"
        initial={{ scale: 0.9 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Section */}
      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">1. Tinh thần Minimalism</h3>
        <p>
          Không cần quá nhiều màu sắc, chỉ cần đúng items: áo trắng, quần đen,
          giày trắng - bạn đã toát lên phong cách tối giản thực thụ.
        </p>
      </section>

      {/* Section */}
      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">
          2. Chất lượng hơn số lượng
        </h3>
        <p>
          Đầu tư vào một chiếc blazer đẹp, một đôi sneakers chất lượng thay vì
          nhiều món đồ rẻ tiền.
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

export default FashionTip2;
