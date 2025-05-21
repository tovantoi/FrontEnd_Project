import React from "react";
import { motion } from "framer-motion";

const Stores = () => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }} // Bắt đầu nhỏ và mờ
      animate={{ scale: 1, opacity: 1 }} // Hiển thị rõ và kích thước bình thường
      exit={{ scale: 0.8, opacity: 0 }} // Thu nhỏ và mờ dần khi rời trang
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
      className="container py-5"
    >
      <h1>Hệ Thống Cửa Hàng</h1>
      <p>Thông tin về các cửa hàng của chúng tôi trên toàn quốc.</p>
    </motion.div>
  );
};

export default Stores;
