import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

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
      <div className="row">
        <div className="col-md-6">
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

        <div className="col-md-6">
          <h4>Thông tin liên hệ</h4>
          <p>Công ty Cổ phần Thời Trang Việt Nam</p>
          <p>
            Hotline: <a href="tel:19008079">1900 8079</a>
          </p>
          <p>
            Email:{" "}
            <a href="mailto:support@fashionstore.com">
              support@fashionstore.com
            </a>
          </p>
          <p>Địa chỉ: Tầng 17, Tòa nhà Vincom, Phường 5, Trà Vinh</p>
          <hr />
          <h4>Bản đồ</h4>
          <iframe
            title="Bản đồ"
            src="https://www.google.com/maps/embed?pb=!1m18..."
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
