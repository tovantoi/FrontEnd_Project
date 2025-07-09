import React, { useState, useRef } from "react";
import { SendHorizonal, MessageCircle, Image as ImageIcon } from "lucide-react";
import "../chatbot.css";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();
  const user = JSON.parse(localStorage.getItem("user")); // hoặc lấy từ context nếu có
  const userId = user?.id;
  const toggleChat = () => {
    setIsOpen((prev) => {
      if (!prev && messages.length === 0) {
        setMessages([
          {
            sender: "bot",
            text: "Chào mừng quý khách đã đến với Shop VanToi.",
          },
        ]);
      }
      return !prev;
    });
  };

  const sendMessage = async () => {
    if (!userInput.trim() && !imageFile) return;

    setMessages((prev) => [
      ...prev,
      ...(userInput ? [{ sender: "user", text: userInput }] : []),
      ...(imageFile
        ? [
            {
              sender: "user",
              text: "🖼️ Đã gửi hình ảnh.",
              image: imagePreview,
            },
          ]
        : []),
    ]);

    const formData = new FormData();
    formData.append("message", userInput);
    if (imageFile) formData.append("image", imageFile);
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user?.id;
    if (user_id) {
      formData.append("user_id", user_id);
    }

    try {
      const res = await fetch("http://localhost:5050/api/chat", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const reply = data.reply || "Xin lỗi, tôi không thể phản hồi lúc này.";

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Không kết nối được đến chatbot." },
      ]);
    }

    setUserInput("");
    setImageFile(null);
    setImagePreview(null);
  };
  const renderMessageText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split("\n").map((line, i) => (
      <p key={i}>
        {line.split(urlRegex).map((part, j) =>
          urlRegex.test(part) ? (
            <a
              key={j}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007bff", textDecoration: "underline" }}
            >
              {part}
            </a>
          ) : (
            part
          )
        )}
      </p>
    ));
  };

  return (
    <>
      <div className="chatbot-container">
        <button onClick={toggleChat} className="chatbot-button">
          <MessageCircle size={24} />
        </button>
      </div>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">SHOP-VAN TOI</div>
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chatbot-message ${
                  msg.sender === "user" ? "user" : "bot"
                }`}
              >
                <div>{renderMessageText(msg.text)}</div>
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Hình ảnh đã gửi"
                    style={{
                      marginTop: 8,
                      maxWidth: "100%",
                      borderRadius: 8,
                      border: "1px solid #ccc",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="chatbot-input-area">
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="preview" />
                <button
                  className="remove-image"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  title="Xoá ảnh"
                >
                  ×
                </button>
              </div>
            )}
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="chatbot-input"
              placeholder="Nhập tin nhắn..."
            />

            <button
              onClick={() => fileInputRef.current.click()}
              className="chatbot-send-button"
              title="Gửi ảnh"
            >
              <ImageIcon size={18} />
            </button>

            <button onClick={sendMessage} className="chatbot-send-button">
              <SendHorizonal size={18} />
            </button>

            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files[0];
                setImageFile(file);
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setImagePreview(event.target.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
