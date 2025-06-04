import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import "./CSS/ContactPage.css";
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    let fileUrl = "";

    if (file) {
      try {
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("upload_preset", "SHOP-VANTOI");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/ddzdect5z/upload",
          {
            method: "POST",
            body: uploadData,
          }
        );

        const data = await res.json();
        fileUrl = data.secure_url;
      } catch (error) {
        console.error("Upload lỗi:", error);
        setErrorMessage("Không thể upload file.");
        return;
      }
    }

    const templateParams = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
    };

    if (fileUrl && typeof fileUrl === "string" && fileUrl.trim() !== "") {
      templateParams.file_url = fileUrl;
    }
    console.log("📨 Dữ liệu gửi đi:", templateParams);
    emailjs
      .send(
        "service_50yvdrt",
        "template_wfeplcj",
        templateParams,
        "HF6Wcu5eZUxx-qnE4"
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          Swal.fire({
            title: "Phản hồi đã được gửi thành công!",
            text: "Cảm ơn bạn đã liên hệ.",
            icon: "success",
            confirmButtonText: "OK",
          });
          setFormData({ name: "", email: "", message: "" });
          setFile(null);
          document.getElementById("file").value = "";
        },
        (err) => {
          console.error("FAILED...", err);
          setErrorMessage("Không thể gửi phản hồi.");
        }
      );
  };

  return (
    <div className="contact-page container py-5">
      <motion.h1
        className="product-name-title mb-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        whileHover={{
          scale: 1.05,
          textShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <center>
          <p>LIÊN HỆ VỚI CHÚNG TÔI</p>
        </center>
      </motion.h1>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="p-4 shadow rounded contact-form-box bg-white">
            <form onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}

              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Họ và tên
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="Nhập họ và tên"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Nhập email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Tin nhắn
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Nội dung tin nhắn"
                  value={formData.message}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="file" className="form-label">
                  Đính kèm ảnh/video
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="file"
                  name="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Gửi phản hồi
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          <div className="p-4 shadow rounded bg-white contact-info-box">
            <h4>Thông tin liên hệ</h4>
            <p>Công ty Cổ phần Thời Trang Việt Nam</p>
            <p>
              Hotline: <a href="tel:19008079">1900 8079</a>
            </p>
            <p>
              Email:{" "}
              <a href="tovantoi2003@gmail.com">support@vantoistore.com</a>
            </p>
            <p>Địa chỉ: Tầng 17, Tòa nhà Vincom, Phường 2, Trà Vinh</p>
            <hr />
            <h4>Bản đồ</h4>
            <iframe
              title="Vincom Plaza Trà Vinh"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3556.4234040774572!2d106.33434407450783!3d9.9359625741344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0171399cdfc8b%3A0x3089b158067e5c18!2sVincom%20Plaza%20Tr%C3%A0%20Vinh!5e1!3m2!1svi!2s!4v1748852679518!5m2!1svi!2s"
              width="100%"
              height="400"
              style={{
                border: "4px solid #ffc002",
                borderRadius: "16px",
                boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)",
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
