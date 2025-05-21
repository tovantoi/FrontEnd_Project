import React from "react";
import { motion } from "framer-motion";

const PaymentGuide = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="container py-5"
    >
      <h1>Hướng Dẫn Thanh Toán</h1>
      <p>Chúng tôi hỗ trợ nhiều phương thức thanh toán để bạn lựa chọn:</p>
      <ul>
        <li>Thanh toán khi nhận hàng (COD).</li>
        <li>Chuyển khoản ngân hàng.</li>
        <li>Thanh toán qua thẻ tín dụng hoặc thẻ ghi nợ.</li>
      </ul>
    </motion.div>
  );
};

export default PaymentGuide;
