import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FaSearch, FaUserCircle, FaShoppingCart } from "react-icons/fa";
import "../CSS/CategoryMenu.css";
import "../CSS/SearchSuggestions.css";
import "../CSS/HeaderMenu.css";
const Header = ({ cart }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeItem, setActiveItem] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const swalInstance = Swal.fire({
      title: "Đang tải trang...",
      width: 400,
      padding: "2em",
      color: "#333",
      background: "#fff",
      backdrop: `rgba(0,0,0,0.4)`,
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    const timeoutId = setTimeout(() => {
      swalInstance.close();
    }, 1000);

    const loadUser = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Lỗi khi parse user:", error);
        setUser(null);
      }
    };

    loadUser(); // Lần đầu mount

    window.addEventListener("storage", loadUser); // Lắng nghe thay đổi

    // ✅ Cleanup khi unmount
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim()) {
        try {
          const res = await fetch(
            `https://localhost:7022/minimal/api/get-name-product?productname=${encodeURIComponent(
              searchQuery
            )}`
          );
          if (res.ok) {
            const data = await res.json();
            setSuggestions(data);
          } else {
            setSuggestions([]);
          }
        } catch {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    }, 300); // Chờ 300ms sau mỗi lần gõ

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://localhost:7022/minimal/api/get-name-categories"
        );
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleMenuClick = (item) => setActiveItem(item);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Vui lòng nhập từ khóa!");
      Swal.fire({
        title: "Cảnh báo",
        text: "Vui lòng nhập từ khóa tìm kiếm!",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    try {
      Swal.fire({
        title: "Đang tìm kiếm...",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch(
        `https://localhost:7022/minimal/api/get-name-product?productname=${encodeURIComponent(
          searchQuery
        )}`
      );

      Swal.close();

      if (response.status === 404) {
        Swal.fire({
          title: "Không tìm thấy sản phẩm!",
          text: "Xin hãy thử với từ khóa khác.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setError("Không tìm thấy sản phẩm!");
        return;
      }

      if (!response.ok) {
        throw new Error("Đã xảy ra lỗi khi tìm kiếm!");
      }

      const data = await response.json();
      setError("");
      navigate("/search-results", {
        state: { results: data, query: searchQuery },
      });
    } catch (error) {
      Swal.close();
      Swal.fire({
        title: "Lỗi!",
        text: error.message || "Đã xảy ra lỗi!",
        icon: "error",
        confirmButtonText: "OK",
      });
      setError(error.message || "Đã xảy ra lỗi!");
    }
  };

  const handleLogout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(
        "https://localhost:7022/minimal/api/customer-logout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: user?.role }),
        }
      );

      if (response.ok) {
        Swal.fire("Đăng xuất thành công!", "", "success");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
      } else {
        Swal.fire("Đăng xuất thất bại!", "", "error");
      }
    } catch (err) {
      Swal.fire("Lỗi kết nối!", "", "error");
    }
  };

  const confirmLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Bạn có chắc muốn đăng xuất?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) handleLogout();
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <header className="bg-white shadow-sm sticky-top">
      <div className="container-fluid px-lg-5 d-flex justify-content-between align-items-center py-3">
        {/* Logo */}
        <div
          className="d-flex align-items-center gap-3 logo-wrap"
          style={{ minHeight: "60px" }}
        >
          <Link
            to="/"
            className="d-flex align-items-center text-decoration-none"
            style={{ lineHeight: 1 }}
          >
            <motion.img
              src="/assets/logoo.png"
              alt="Logo"
              className="shop-logo-img"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
            />
            <motion.span
              className="shop-logo-text ms-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              SHOP VANTOI
            </motion.span>
          </Link>
        </div>

        <nav className="d-none d-md-flex">
          <ul className="nav">
            <li className="nav-item" key="home">
              <Link
                to="/"
                className={`nav-link ${
                  activeItem === "/" ? "active fw-bold text-primary" : ""
                }`}
                onClick={() => handleMenuClick("home")}
              >
                Trang chủ
              </Link>
            </li>

            {/* Các mục dùng map */}
            {/* Menu xổ xuống cho Danh mục */}
            <li
              className="nav-item dropdown"
              onMouseEnter={() => setActiveItem("danhmuc")}
              onMouseLeave={() => setActiveItem("")}
            >
              <span
                className={`nav-link dropdown-toggle ${
                  activeItem === "danhmuc" ? "active fw-bold text-primary" : ""
                }`}
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Danh mục
              </span>

              <ul
                className="dropdown-menu custom-scroll-dropdown p-1"
                style={{
                  maxHeight: "220px",
                  overflowY: "auto",
                  overflowX: "hidden",
                  minWidth: "200px",
                  borderRadius: "10px",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
                }}
              >
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <span
                      className="dropdown-item"
                      style={{
                        padding: "10px 16px",
                        borderRadius: "6px",
                        transition: "background 0.2s",
                      }}
                      onClick={() => navigate(`/category/${cat.id}`)}
                    >
                      {cat.name}
                    </span>
                  </li>
                ))}
              </ul>
            </li>

            {[
              { label: "Sản phẩm", path: "/products", key: "products" },
              { label: "Phụ kiện", path: "/phukien", key: "phukien" },
              { label: "Blog", path: "/blogpage", key: "blogpage" },
              { label: "Liên hệ", path: "/contact", key: "contact" },
            ].map(({ label, path, key }) => (
              <li className="nav-item" key={key}>
                <Link
                  to={path}
                  className={`nav-link ${
                    activeItem === key ? "active fw-bold text-primary" : ""
                  }`}
                  onClick={() => handleMenuClick(key)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Search + Account + Cart */}
        <div className="d-flex align-items-center">
          <div className="position-relative me-3" style={{ width: "250px" }}>
            <div className="input-group">
              <input
                type="text"
                className={`form-control ${error ? "is-invalid" : ""}`}
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                onBlur={() => setTimeout(() => setSuggestions([]), 200)}
              />
              <button
                className="btn btn-outline-primary"
                onClick={handleSearch}
              >
                <FaSearch />
              </button>
            </div>

            {suggestions.length > 0 && (
              <div className="suggestions-container">
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    className="suggestion-item"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <img
                      src={item.imagePath || "https://via.placeholder.com/40"}
                      alt={item.productName}
                      className="suggestion-image"
                    />
                    <span className="suggestion-name">{item.productName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            className="position-relative me-3"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
            style={{ cursor: "pointer" }}
          >
            <button className="btn btn-light border-0 shadow-sm rounded-circle p-2">
              <FaUserCircle size={32} color="#333" />
            </button>

            {isDropdownOpen && (
              <motion.ul
                className="dropdown-menu show"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{
                  right: 0,
                  left: "auto",
                  minWidth: "180px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                }}
              >
                {user ? (
                  <>
                    <li>
                      <Link
                        to="/my-orders"
                        className="dropdown-item py-2 px-3"
                        style={{ fontSize: "16px" }}
                      >
                        🛒 Đơn hàng
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/my-account"
                        className="dropdown-item py-2 px-3"
                        style={{ fontSize: "16px" }}
                      >
                        👤 Tài khoản
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/request-otp"
                        className="dropdown-item py-2 px-3"
                        style={{ fontSize: "16px" }}
                      >
                        🔒 Đổi mật khẩu
                      </Link>
                    </li>
                    <li>
                      <a
                        href="/logout"
                        onClick={confirmLogout}
                        className="dropdown-item py-2 px-3 text-danger"
                        style={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        🚪 Đăng xuất
                      </a>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/login"
                        className="dropdown-item py-2 px-3"
                        style={{ fontSize: "16px" }}
                      >
                        🔑 Đăng nhập
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        className="dropdown-item py-2 px-3"
                        style={{ fontSize: "16px" }}
                      >
                        ✍️ Đăng ký
                      </Link>
                    </li>
                  </>
                )}
              </motion.ul>
            )}
          </div>

          <Link to="/cart" className="btn btn-warning position-relative">
            <FaShoppingCart />
            {cart.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
