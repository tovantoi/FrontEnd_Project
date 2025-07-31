// pages/ZaloChatWidget.jsx
import { useEffect } from "react";

const ZaloChatWidget = () => {
  useEffect(() => {
    // Nếu đã có thì không thêm lại
    const existingScript = document.querySelector(
      'script[src="https://sp.zalo.me/plugins/sdk.js"]'
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://sp.zalo.me/plugins/sdk.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      className="zalo-chat-widget"
      data-oaid="3273899609458188228"
      data-welcome-message="Xin chào! Shop rất vui được hỗ trợ bạn!"
      data-autopopup="0"
      data-width=""
      data-height=""
    ></div>
  );
};

export default ZaloChatWidget;
