import React from "react";
import { motion } from "framer-motion";

const FAQ = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="container py-5"
    >
      <h1>Hỏi Đáp</h1>
      <p>Dưới đây là một số câu hỏi thường gặp:</p>
      <ul>
        <li>
          <strong>Hỏi:</strong> Làm thế nào để đặt hàng?
        </li>
        <li>
          <strong>Đáp:</strong> Bạn có thể đặt hàng trực tuyến trên trang web
          của chúng tôi.
        </li>
        <li>
          <strong>Hỏi:</strong> Tôi có thể đổi trả sản phẩm không?
        </li>
        <li>
          <strong>Đáp:</strong> Vâng, bạn có thể đổi trả trong vòng 7 ngày với
          các sản phẩm còn nguyên tem.
        </li>
      </ul>
    </motion.div>
  );
};

export default FAQ;
