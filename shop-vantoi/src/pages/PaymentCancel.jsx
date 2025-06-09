import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      icon: "warning",
      title: "Thanh toán đã bị hủy!",
      text: "Bạn đã hủy giao dịch hoặc xảy ra lỗi trong quá trình thanh toán.",
      confirmButtonText: "Quay lại giỏ hàng",
      showCancelButton: true,
      cancelButtonText: "Trang chủ",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/cart");
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <motion.div
      className="container text-center mt-5"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 style={{ fontWeight: "bold", color: "#c0392b" }}>
        ❌ Thanh toán không thành công!
      </h1>
      <p className="mt-3">
        Nếu bạn gặp sự cố khi thanh toán, vui lòng thử lại hoặc chọn phương thức
        khác.
      </p>
    </motion.div>
  );
};

export default PaymentCancel;
