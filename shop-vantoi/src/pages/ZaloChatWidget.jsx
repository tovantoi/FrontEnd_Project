import React, { useEffect } from "react";

const ZaloChatWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sp.zalo.me/plugins/sdk.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="zalo-chat-widget"
      data-oaid="1234567890123456789"
      data-welcome-message="Xin chào! Tôi có thể giúp gì cho bạn?"
      data-autopopup="0"
      data-width=""
      data-height=""
    ></div>
  );
};

export default ZaloChatWidget;
