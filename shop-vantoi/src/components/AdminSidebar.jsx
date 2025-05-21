import React from "react";
import "../pages/AdminCss/AdminSidebar.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FaHome,
  FaListAlt,
  FaBoxOpen,
  FaUserFriends,
  FaKey,
  FaSignOutAlt,
} from "react-icons/fa"; // Import icons

const AdminSidebar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      // Lấy thông tin vai trò từ localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const role = user?.role;

      const response = await fetch(
        "https://localhost:7022/minimal/api/customer-logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }), // Gửi vai trò cho API
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Đăng xuất thành công!",
          text: data.message || "Hẹn gặp lại!",
          icon: "success",
          confirmButtonText: "OK",
        });
        // Xóa thông tin người dùng khỏi localStorage
        localStorage.removeItem("user");

        // Điều hướng về trang đăng nhập
        navigate("/login");
      } else {
        Swal.fire({
          title: "Đăng xuất thất bại",
          text: data.message || "Vui lòng kiểm tra lại thông tin đăng nhập.",
          icon: "error",
          confirmButtonText: "Thử lại",
        });
      }
    } catch (err) {
      console.error("Error during logout:", err);
      Swal.fire({
        title: "Lỗi kết nối",
        text: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const showConfirmDialog = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Bạn có chắc muốn đăng xuất?",
      text: "Bạn sẽ bị đăng xuất khỏi tài khoản hiện tại.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
      }
    });
  };
  return (
    <div className="admin-sidebar">
      <motion.h2
        initial={{ opacity: 0, scale: 0.8, y: -50 }} // Xuất hiện từ nhỏ, dịch xuống
        animate={{ opacity: 1, scale: 1, y: 0 }} // Phóng to về kích thước ban đầu
        transition={{
          duration: 1, // Thời gian chuyển động
          ease: "easeOut", // Làm mượt
        }}
        whileHover={{
          scale: 1.1, // Phóng to khi hover
          textShadow: "0px 0px 10px rgba(255, 255, 255, 0.8)", // Ánh sáng khi hover
          color: "#4caf50", // Màu xanh lá khi hover
        }}
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          textTransform: "uppercase",
          textAlign: "center",
          color: "#ffffff",
        }}
      >
        Admin Dashboard
      </motion.h2>
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaHome style={{ marginRight: "8px" }} />
            TRANG CHỦ
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/admin/category"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaListAlt style={{ marginRight: "8px" }} />
            QUẢN LÍ DANH MỤC
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaBoxOpen style={{ marginRight: "8px" }} />
            QUẢN LÍ SẢN PHẨM
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaUserFriends style={{ marginRight: "8px" }} />
            QUẢN LÍ KHÁCH HÀNG
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/admin/coupon"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaUserFriends style={{ marginRight: "8px" }} />
            QUẢN LÍ MÃ GIẢM GIÁ
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/admin/order"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaUserFriends style={{ marginRight: "8px" }} />
            QUẢN LÍ ĐƠN HÀNG
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/admin/blog"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaUserFriends style={{ marginRight: "8px" }} />
            QUẢN LÍ BLOGS
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/admin/request-otp"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <FaKey style={{ marginRight: "8px" }} />
            THAY ĐỔI MẬT KHẨU
          </NavLink>
        </li>
        <li className="nav-item">
          <a href="/logout" className="nav-link" onClick={showConfirmDialog}>
            <FaSignOutAlt style={{ marginRight: "8px" }} />
            <b>ĐĂNG XUẤT</b>
          </a>
        </li>
        <button
          className="admin-sidebar-toggle"
          onClick={() =>
            document.querySelector(".admin-sidebar").classList.toggle("active")
          }
        >
          ☰
        </button>
      </ul>
    </div>
  );
};

export default AdminSidebar;
