import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CSS/LoginPage.css";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) navigate("/");
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(
        "https://localhost:7022/minimal/api/login-customer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (res.ok && data.isSuccess) {
        localStorage.setItem("user", JSON.stringify(data.query));
        Swal.fire(
          "Thành công",
          data.message || "Đăng nhập thành công!",
          "success"
        );
        navigate(data.query.role === 1 ? "/admin/dashboard" : "/");
        window.location.reload();
      } else {
        Swal.fire("Lỗi", data.message || "Sai thông tin đăng nhập!", "error");
      }
    } catch (err) {
      Swal.fire("Lỗi", "Không thể kết nối đến máy chủ.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      // Giải mã token để lấy thông tin người dùng
      const decoded = jwtDecode(token);
      const avatar = decoded.picture;
      const { email, given_name, family_name, picture, sub } = decoded;

      // Gửi token lên backend để xử lý và lưu nếu cần
      const res = await fetch(
        "https://localhost:7022/minimal/api/register-google",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ googleCredential: token }),
        }
      );

      const data = await res.json();

      if (res.ok && data.isSuccess) {
        // Lưu thông tin người dùng vào localStorage
        const user = {
          id: data.query?.id || 0,
          email,
          firstName: given_name,
          lastName: family_name,
          avatarImagePath: picture,
          role: 0,
        };
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...data.query,
            avatarImagePath: avatar,
          })
        );
        window.dispatchEvent(new Event("storage"));

        Swal.fire(
          "Thành công",
          data.message || "Đăng nhập Google thành công!",
          "success"
        ).then(() => {
          navigate(user.role === 1 ? "/admin/dashboard" : "/");
          window.location.reload();
        });
      } else {
        Swal.fire("Lỗi", data.message || "Đăng nhập Google thất bại!", "error");
      }
    } catch (err) {
      console.error("Lỗi khi xử lý token Google:", err);
      Swal.fire("Lỗi", "Không thể xử lý token đăng nhập Google.", "error");
    }
  };

  const handleGoogleLoginError = () => {
    console.log("Đăng nhập Google thất bại");
    Swal.fire("Lỗi", "Đăng nhập Google thất bại", "error");
  };

  return (
    <div className="login-background">
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="row w-100 shadow-lg rounded-4 overflow-hidden login-container"
          style={{ maxWidth: "900px" }}
        >
          {/* BÊN TRÁI - SHOP VANTOI */}
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-center p-5 text-white border-3d">
            <h1
              className="text-center mb-3"
              style={{
                fontSize: "2.8rem",
                fontWeight: "900",
                background: "linear-gradient(90deg, #ff6ec7, #42a5f5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
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
              Thời trang là chất VANTOI là gu
            </p>
          </div>

          {/* BÊN PHẢI - FORM */}
          <div className="col-md-6 glassmorphism p-5 text-white">
            <h2
              className="text-center mb-4"
              style={{
                color: "#80d0ff",
                fontSize: "2rem",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "1px",
                textShadow:
                  "0 0 8px rgba(128, 208, 255, 0.4), 0 0 18px rgba(80, 160, 255, 0.4)",
              }}
            >
              OFFICIAL LOGIN FORM
            </h2>

            <form onSubmit={handleLogin}>
              <div className="form-group mb-3">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control bg-transparent text-white border-bottom rounded-0"
                  placeholder="mail@example.com"
                  required
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control bg-transparent text-white border-bottom rounded-0"
                  placeholder="Password"
                  required
                />
                <div className="text-end mt-1">
                  <a
                    href="/change-pw-login"
                    className="text-warning small"
                    style={{ textDecoration: "underline" }}
                  >
                    Quên mật khẩu?
                  </a>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
                disabled={isLoading}
              >
                {isLoading ? "Đang đăng nhập..." : "Login"}
              </button>
            </form>

            <p className="text-center mt-4 small">
              Đăng nhập nhanh bằng tài khoản Google
            </p>

            <div className="d-flex justify-content-center">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
              />
            </div>

            <div className="text-center mt-3">
              <small>
                Đã chưa tài khoản?{" "}
                <a href="/register" className="text-info">
                  Đăng kí
                </a>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
