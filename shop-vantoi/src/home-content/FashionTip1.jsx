import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const FashionTip1 = () => {
  return (
    <div className="container py-5">
      <Helmet>
        <title>Bí quyết phối Layer mùa hè - VANTOI</title>
      </Helmet>

      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="fw-bold mb-3" style={{ color: "#20c997" }}>
          Bí quyết phối Layer mùa hè
        </h1>
        <p className="lead text-muted">Mát mẻ, thời trang và cá tính.</p>
      </motion.div>

      <motion.img
        src="/assets/tips1.jpg"
        alt="Layer mùa hè"
        className="img-fluid rounded shadow mb-5"
        initial={{ scale: 0.9 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Section 1 */}
      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">1. Chất liệu là chìa khóa</h3>
        <p>
          Hãy chọn vải linen, cotton siêu nhẹ. Layer bằng áo sơ mi mỏng ngoài áo
          thun trơn sẽ giúp bạn thoáng mát mà vẫn cá tính.
        </p>
      </section>

      {/* Section 2 */}
      <motion.img
        src="/assets/layer-cotton.jpg"
        alt="Layer cotton"
        className="img-fluid rounded shadow mb-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">
          2. Gam màu pastel nhẹ nhàng
        </h3>
        <p>
          Pastel không chỉ giúp bạn cảm thấy dịu mát mà còn bắt kịp xu hướng hè
          2025.
        </p>
      </section>

      {/* Section 3 */}
      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">
          3. Layer phụ kiện thông minh
        </h3>
        <p>
          Khăn mỏng, túi tote nhẹ, mũ bucket là phụ kiện layer cực kỳ hợp mùa
          hè.
        </p>
      </section>

      {/* Quote */}
      <blockquote className="blockquote text-center my-5">
        <p className="mb-0 fst-italic">
          "Layer chính là vũ khí bí mật cho mùa hè năng động."
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

export default FashionTip1;
