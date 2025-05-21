import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const CollectionUrbanDream = () => {
  return (
    <div className="container py-5">
      <Helmet>
        <title>Urban Dream 2025 - Bộ sưu tập mới | VANTOI</title>
      </Helmet>

      {/* Header */}
      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="fw-bold mb-3" style={{ color: "#1e90ff" }}>
          Urban Dream 2025
        </h1>
        <p className="lead text-muted">
          Tự do thể hiện phong cách trong nhịp sống đô thị.
        </p>
      </motion.div>

      {/* Ảnh chính */}
      <motion.img
        src="/assets/collection-banner.jpg"
        alt="Urban Dream 2025"
        className="img-fluid rounded shadow mb-5"
        initial={{ scale: 0.8 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Section 1 */}
      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">1. Cảm hứng từ thành phố</h3>
        <p>
          Urban Dream ra đời từ cảm hứng cuộc sống năng động, sôi động giữa
          những thành phố hiện đại. Các thiết kế mang đậm tinh thần tự do, phá
          cách và năng lượng tích cực.
        </p>
      </section>

      {/* Ảnh phụ */}
      <motion.img
        src="/assets/urban2.jpg"
        alt="Urban style"
        className="img-fluid rounded shadow mb-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Section 2 */}
      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">
          2. Những item không thể thiếu
        </h3>
        <ul>
          <li>Áo khoác bomber phá cách</li>
          <li>Quần jogger cá tính</li>
          <li>Áo thun oversize tự do</li>
          <li>Giày sneakers cực chất</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">3. Dành cho ai?</h3>
        <p>
          Bộ sưu tập hướng tới những bạn trẻ yêu thích phong cách streetwear
          hiện đại, tự tin và không ngại thể hiện cá tính riêng.
        </p>
      </section>

      {/* Blockquote */}
      <blockquote className="blockquote text-center my-5">
        <p className="mb-0 fst-italic">
          "Phong cách thành phố - Phong cách của chính bạn."
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

export default CollectionUrbanDream;
