import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VnpayResultPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const responseCode = params.get("vnp_ResponseCode");

    if (responseCode === "00") {
      alert("✅ Thanh toán thành công!");
    } else {
      alert("❌ Thanh toán thất bại hoặc bị huỷ!");
    }

    // Chuyển hướng về trang đơn hàng
    setTimeout(() => {
      navigate("/my-orders");
    }, 3000);
  }, [navigate]);

  return (
    <div className="container text-center mt-5">
      <h2>Đang xác nhận kết quả thanh toán...</h2>
    </div>
  );
};

export default VnpayResultPage;
