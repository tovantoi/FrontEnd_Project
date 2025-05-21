import React from "react";
import { motion } from "framer-motion";

const SizeGuide = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="container py-5"
    >
      <h1>Hướng Dẫn Chọn Kích Cỡ</h1>
      <p>
        Để đảm bảo bạn chọn được kích cỡ phù hợp, vui lòng tham khảo bảng kích
        cỡ bên dưới:
      </p>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Size</th>
            <th>Chiều cao (cm)</th>
            <th>Cân nặng (kg)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>S</td>
            <td>150-160</td>
            <td>40-50</td>
          </tr>
          <tr>
            <td>M</td>
            <td>160-170</td>
            <td>50-60</td>
          </tr>
          <tr>
            <td>L</td>
            <td>170-180</td>
            <td>60-70</td>
          </tr>
        </tbody>
      </table>
    </motion.div>
  );
};

export default SizeGuide;
