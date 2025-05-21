import React from "react";
import { motion } from "framer-motion";

const ShippingPolicy = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="container py-5"
    >
      <h1>Chính Sách Vận Chuyển</h1>
      <p>
        Chúng tôi cam kết giao hàng nhanh chóng và đảm bảo. Dưới đây là các
        thông tin về vận chuyển:
      </p>
      <ul>
        <li>Thời gian giao hàng: 2-5 ngày làm việc.</li>
        <li>Phí vận chuyển: Miễn phí với đơn hàng trên 500,000 VND.</li>
        <li>
          Đối với các khu vực vùng sâu, thời gian giao hàng có thể lâu hơn.
        </li>
      </ul>
    </motion.div>
  );
};

export default ShippingPolicy;
