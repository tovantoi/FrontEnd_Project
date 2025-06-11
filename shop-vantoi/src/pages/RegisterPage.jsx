import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/LoginPage.css";
import { GoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/register-customer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        Swal.fire(
          "Thành công",
          data.message || "Đăng ký thành công.",
          "success"
        );
        setStep(2);
      } else {
        Swal.fire("Lỗi", data.message || "Đăng ký thất bại.", "error");
        setMessage("");
      }
    } catch {
      Swal.fire("Lỗi", "Đã xảy ra lỗi. Vui lòng thử lại.", "error");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://localhost:7022/minimal/api/authen-customer?email=${formData.email}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        Swal.fire(
          "Thành công",
          data.message || "Xác thực thành công!",
          "success"
        ).then(() => navigate("/login"));
      } else {
        Swal.fire("Lỗi", data.message || "Xác thực thất bại.", "error");
      }
    } catch {
      Swal.fire("Lỗi", "Đã xảy ra lỗi. Vui lòng thử lại.", "error");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const token = credentialResponse.credential;
    const decoded = jwtDecode(token);
    const avatar = decoded.picture;
    console.log("Thông tin từ token:", decoded);

    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/register-google",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ googleCredential: token }),
        }
      );

      const data = await response.json();

      if (response.ok && data.isSuccess) {
        // ✅ Thêm 2 dòng này
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...data.query,
            avatarImagePath: avatar,
          })
        );
        window.dispatchEvent(new Event("storage")); // 🔥 cập nhật Header ngay

        Swal.fire(
          "Thành công",
          data.message || "Đăng ký Google thành công",
          "success"
        ).then(() => {
          navigate("/"); // chuyển hướng tùy bạn
        });
      } else {
        Swal.fire("Lỗi", data.message || "Đăng ký Google thất bại", "error");
      }
    } catch (error) {
      console.error("Lỗi gửi token về backend:", error);
      Swal.fire("Lỗi", "Không thể kết nối server.", "error");
    }
  };

  return (
    <div className="login-background">
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="row w-100 shadow-lg rounded-4 overflow-hidden login-container"
          style={{ maxWidth: "900px" }}
        >
          {/* BÊN TRÁI */}
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-center p-4 text-white border-3d">
            <h1
              className="text-center mb-3"
              style={{
                fontSize: "2.4rem",
                fontWeight: "900",
                background: "linear-gradient(90deg, #ff6ec7, #42a5f5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 15px rgba(255,255,255,0.2)",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              SHOP-VANTOI
            </h1>
            <p
              className="mt-3 fw-bold text-center text-uppercase"
              style={{
                fontSize: "1.1rem",
                color: "#fff",
                padding: "10px 20px",
                background: "rgba(0, 0, 0, 0.5)",
                borderRadius: "12px",
                textShadow: "0 0 5px #ff8a00, 0 0 10px #e52e71",
                letterSpacing: "1px",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.2)",
                maxWidth: "90%",
                margin: "0 auto",
              }}
            >
              Thời trang là chất<br></br> VANTOI là gu
            </p>
          </div>

          {/* BÊN PHẢI */}
          <div
            className="col-md-6 glassmorphism p-4 text-white d-flex flex-column justify-content-center"
            style={{ minHeight: "550px" }}
          >
            <h2
              className="text-center mb-4"
              style={{
                color: "#80d0ff",
                fontSize: "1.8rem",
                fontWeight: "bold",
                textTransform: "uppercase",
                textShadow: "0 0 8px rgba(128, 208, 255, 0.4)",
              }}
            >
              Đăng ký tài khoản
            </h2>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {step === 1 && (
              <form onSubmit={handleRegister}>
                {[
                  "firstName",
                  "lastName",
                  "email",
                  "password",
                  "confirmPassword",
                ].map((field, idx) => (
                  <div className="mb-2" key={idx}>
                    <input
                      type={field.includes("password") ? "password" : "text"}
                      name={field}
                      className="form-control form-control-sm bg-transparent text-white border-bottom rounded-0"
                      placeholder={
                        field === "firstName"
                          ? "Họ"
                          : field === "lastName"
                          ? "Tên"
                          : field === "email"
                          ? "Email"
                          : field === "password"
                          ? "Mật khẩu"
                          : "Xác nhận mật khẩu"
                      }
                      value={formData[field]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ))}
                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Đăng ký
                </button>

                <div className="text-center my-3 text-light">
                  Hoặc đăng ký bằng
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() =>
                      Swal.fire("Lỗi", "Google đăng nhập thất bại", "error")
                    }
                  />
                </div>

                <div className="text-center mt-3">
                  <small>
                    Đã có tài khoản?{" "}
                    <a href="/login" className="text-info">
                      Đăng nhập
                    </a>
                  </small>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <h4 className="text-center mb-4">Xác thực OTP</h4>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm bg-transparent text-white border-bottom rounded-0"
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success w-100 mt-2">
                  Xác thực
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
