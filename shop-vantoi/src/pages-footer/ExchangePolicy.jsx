import React from "react";
import { motion } from "framer-motion";

const ExchangePolicy = () => {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -10 }}
      animate={{ opacity: 1, rotate: 0 }}
      exit={{ opacity: 0, rotate: 10 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="container py-5"
    >
      <h1>Quy Định Đổi Hàng</h1>
      <p>Chúng tôi chấp nhận đổi hàng trong các trường hợp sau:</p>
      <ul>
        <li>Sản phẩm bị lỗi do nhà sản xuất.</li>
        <li>Sản phẩm không đúng kích cỡ.</li>
        <li>Thời gian đổi hàng: Trong vòng 7 ngày kể từ ngày nhận hàng.</li>
      </ul>
    </motion.div>
  );
};

export default ExchangePolicy;
