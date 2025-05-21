import React from "react";
import { motion } from "framer-motion";

const PurchaseGuide = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="container py-5"
    >
      <h1>Hướng Dẫn Mua Hàng</h1>
      <p>Các bước mua hàng trực tuyến tại VANTOI:</p>
      <ol>
        <li>Chọn sản phẩm yêu thích và thêm vào giỏ hàng.</li>
        <li>Nhấp vào giỏ hàng và tiến hành thanh toán.</li>
        <li>Điền thông tin giao hàng và chọn phương thức thanh toán.</li>
        <li>Xác nhận đơn hàng và chờ giao hàng.</li>
      </ol>
    </motion.div>
  );
};

export default PurchaseGuide;
