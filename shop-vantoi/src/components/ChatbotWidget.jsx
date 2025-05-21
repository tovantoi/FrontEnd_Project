import React, { useState } from "react";
import { SendHorizonal, MessageCircle } from "lucide-react";
import "../chatbot.css";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  const toggleChat = () => {
    setIsOpen((prev) => {
      if (!prev && messages.length === 0) {
        setMessages([
          { sender: "bot", text: "Chào mừng quý khách đã đến với Shop VanToi." },        
        ]);
      }
      return !prev;
    });
  };  
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });
      const data = await res.json();
      const reply = data.reply || "Xin lỗi, tôi không thể phản hồi lúc này.";

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Có lỗi khi kết nối đến chatbot." },
      ]);
    }

    setUserInput("");
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
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input-area">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="chatbot-input"
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={sendMessage} className="chatbot-send-button">
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
