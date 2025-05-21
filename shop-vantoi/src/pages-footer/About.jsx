import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Bắt đầu mờ và di chuyển từ dưới lên
      animate={{ opacity: 1, y: 0 }} // Hiển thị rõ và đúng vị trí
      exit={{ opacity: 0, y: -50 }} // Mờ dần và di chuyển lên trên khi rời trang
      transition={{
        duration: 0.5, // Thời gian thực hiện hiệu ứng
        ease: "easeInOut", // Làm mượt hiệu ứng
      }}
      className="container py-5"
    >
      <h1>Giới Thiệu VANTOI</h1>
      <p>
        Chào mừng bạn đến với VANTOI, thương hiệu thời trang hàng đầu mang đến
        phong cách thanh lịch và hiện đại.
      </p>
    </motion.div>
  );
};

export default About;
