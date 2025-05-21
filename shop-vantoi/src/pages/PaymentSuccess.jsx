import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const query = new URLSearchParams(useLocation().search);
  const responseCode = query.get("vnp_ResponseCode");

  useEffect(() => {
    if (responseCode === "00") {
      alert("Thanh toán thành công!");
    } else {
      alert("Thanh toán thất bại hoặc bị hủy!");
    }
  }, [responseCode]);

  return (
    <div className="text-center mt-5">Đang xử lý kết quả thanh toán...</div>
  );
};

export default PaymentSuccess;
