import React from "react";
import "../pages/AdminCss/AdminSidebar.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FaHome,
  FaListAlt,
  FaBoxOpen,
  FaUserFriends,
  FaKey,
  FaSignOutAlt,
  FaTags,
  FaClipboardList,
  FaBlog,
  FaWarehouse, // ADD ICON FOR INVENTORY
} from "react-icons/fa";

const menuItems = [
  {
    to: "/admin/dashboard",
    icon: <FaHome />,
    label: "TRANG CHỦ",
    color: "#4caf50",
  },
  {
    to: "/admin/category",
    icon: <FaListAlt />,
    label: "QUẢN LÍ DANH MỤC",
    color: "#2196f3",
  },
  {
    to: "/admin/products",
    icon: <FaBoxOpen />,
    label: "QUẢN LÍ SẢN PHẨM",
    color: "#ff9800",
  },
  {
    to: "/admin/inventory", // THÊM ĐƯỜNG DẪN QUẢN LÍ TỒN KHO
    icon: <FaWarehouse />,
    label: "QUẢN LÍ TỒN KHO",
    color: "#607d8b",
  },
  {
    to: "/admin/customers",
    icon: <FaUserFriends />,
    label: "QUẢN LÍ KHÁCH HÀNG",
    color: "#9c27b0",
  },
  {
    to: "/admin/coupon",
    icon: <FaTags />,
    label: "QUẢN LÍ MÃ GIẢM GIÁ",
    color: "#e91e63",
  },
  {
    to: "/admin/order",
    icon: <FaClipboardList />,
    label: "QUẢN LÍ ĐƠN HÀNG",
    color: "#00bcd4",
  },
  {
    to: "/admin/blog",
    icon: <FaBlog />,
    label: "QUẢN LÍ BLOGS",
    color: "#8bc34a",
  },
  {
    to: "/admin/request-otp",
    icon: <FaKey />,
    label: "THAY ĐỔI MẬT KHẨU",
    color: "#fbc02d",
  },
];

const AdminSidebar = ({ open = true }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const role = user?.role;

      const response = await fetch(
        "https://localhost:7022/minimal/api/customer-logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
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
        localStorage.removeItem("user");
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
    <div className={`admin-sidebar${!open ? " collapsed" : ""}`}>
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="sidebar-header"
      >
        <span className="sidebar-logo">🛒</span>
        {open && <span className="sidebar-title">ADMIN DASHBOARD</span>}
      </motion.div>
      <ul className="sidebar-menu">
        {menuItems.map((item, idx) => (
          <motion.li
            key={idx}
            className="sidebar-menu-item"
            whileHover={{
              scale: 1.03,
              background: "rgba(255,255,255,0.08)",
              boxShadow: "0 2px 8px rgba(76,175,80,0.10)",
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
              style={({ isActive }) => ({
                borderLeft: isActive
                  ? `4px solid ${item.color}`
                  : "4px solid transparent",
                color: isActive ? item.color : "#fff",
                background: isActive ? "rgba(255,255,255,0.11)" : "none",
                paddingLeft: open ? 20 : 10,
                justifyContent: open ? "flex-start" : "center",
              })}
            >
              <span
                className="sidebar-icon"
                style={{
                  color: item.color,
                  marginRight: open ? "14px" : 0,
                  fontSize: "1.15em",
                  filter: "drop-shadow(0 1px 2px #2222)",
                  display: "inline-block",
                  textAlign: "center",
                  width: open ? 25 : 40,
                }}
              >
                {item.icon}
              </span>
              {open && <span className="sidebar-label">{item.label}</span>}
            </NavLink>
          </motion.li>
        ))}
        <motion.li
          className="sidebar-menu-item logout"
          whileHover={{
            scale: 1.03,
            background: "rgba(255,255,255,0.13)",
            boxShadow: "0 2px 8px rgba(233,30,99,0.08)",
          }}
          transition={{ type: "spring", stiffness: 280 }}
        >
          <a
            href="/logout"
            className="sidebar-link"
            onClick={showConfirmDialog}
          >
            <span
              className="sidebar-icon"
              style={{
                color: "#e53935",
                marginRight: open ? "14px" : 0,
                fontSize: "1.15em",
                filter: "drop-shadow(0 1px 2px #2222)",
                display: "inline-block",
                textAlign: "center",
                width: open ? 25 : 40,
              }}
            >
              <FaSignOutAlt />
            </span>
            {open && (
              <span
                className="sidebar-label"
                style={{ fontWeight: 700, letterSpacing: 2 }}
              >
                ĐĂNG XUẤT
              </span>
            )}
          </a>
        </motion.li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
