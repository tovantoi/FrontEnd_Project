import React from "react";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} // Bắt đầu mờ và di chuyển từ dưới lên
      animate={{ opacity: 1, y: 0 }} // Hiển thị rõ và đúng vị trí
      exit={{ opacity: 0, y: -30 }} // Mờ dần và di chuyển lên trên khi rời trang
      transition={{
        duration: 0.5, // Thời gian thực hiện hiệu ứng
        ease: "easeInOut", // Làm mềm hiệu ứng
      }}
      className="container py-5"
    >
      <h1>Chính Sách Bảo Mật</h1>
      <p>
        Chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Các thông tin cá nhân
        sẽ được bảo mật và sử dụng theo quy định của pháp luật.
      </p>
      <h3>Thu Thập Thông Tin</h3>
      <p>
        Chúng tôi thu thập thông tin cá nhân của bạn khi bạn sử dụng trang web,
        bao gồm họ tên, địa chỉ email và số điện thoại.
      </p>
      <h3>Sử Dụng Thông Tin</h3>
      <p>
        Thông tin cá nhân của bạn được sử dụng để cung cấp dịch vụ, liên hệ và
        hỗ trợ bạn một cách tốt nhất.
      </p>
      <h3>Quyền Của Người Dùng</h3>
      <p>
        Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân bất kỳ lúc
        nào. Vui lòng liên hệ với chúng tôi để biết thêm chi tiết.
      </p>
    </motion.div>
  );
};

export default PrivacyPolicy;
