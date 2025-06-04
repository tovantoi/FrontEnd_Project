import React from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";

const AutoReplyEmailPage = ({ customerName, customerEmail, message, type }) => {
  const sendAutoReply = async () => {
    try {
      const templateParams = {
        customer_name: customerName,
        email: customerEmail,
        message: message,
        type: type || "phản hồi",
      };

      const result = await emailjs.send(
        "service_yfcmf9d", // Service ID
        "template_nxahxjp", // Template phản hồi tự động
        templateParams,
        "xt-Des4pkFzceYTHY" // Public Key
      );

      console.log("✅ Email phản hồi đã gửi: ", result);
      Swal.fire("Thành công", "Đã gửi phản hồi đến khách hàng!", "success");
    } catch (error) {
      console.error("❌ Gửi email lỗi:", error);
      Swal.fire("Lỗi", "Không thể gửi phản hồi qua email.", "error");
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h2 className="mb-3">Gửi phản hồi tự động cho khách hàng</h2>
      <button className="btn btn-success" onClick={sendAutoReply}>
        Gửi phản hồi ngay
      </button>
    </div>
  );
};

export default AutoReplyEmailPage;
