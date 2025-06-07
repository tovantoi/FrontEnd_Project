import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const orderCode = queryParams.get("orderCode");
    const status = queryParams.get("status");

    if (!orderCode || !status) {
      Swal.fire("Lỗi", "Thông tin thanh toán không hợp lệ", "error");
      return;
    }

    fetch("https://localhost:7022/api/payos/ipn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderCode, status }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Không cập nhật được trạng thái");
        return res.text();
      })
      .then(() => {
        Swal.fire(
          "🎉 Thanh toán thành công",
          "Đơn hàng của bạn đã được cập nhật",
          "success"
        );
        localStorage.removeItem("buyNowProduct");
        localStorage.removeItem("selectedProducts");
        setTimeout(() => navigate("/my-orders"), 2000);
      })
      .catch(() => {
        Swal.fire("❌", "Có lỗi khi cập nhật đơn hàng", "error");
        navigate("/my-orders");
      });
  }, [navigate]);

  return (
    <div className="text-center mt-5">
      <h2>Đang xử lý thanh toán...</h2>
    </div>
  );
};

export default PaymentSuccess;
