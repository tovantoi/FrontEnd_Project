import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import confetti from "canvas-confetti";
import "./CSS/CartPage.css";
import { motion } from "framer-motion";

const CartPage = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [setCart]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  const handleRemoveFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    setSelectedItems(selectedItems.filter((i) => i !== index));
  };

  const handleQuantityChange = (index, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const toggleSelectItem = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter((i) => i !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((_, index) => index));
    }
  };

  const totalPrice = selectedItems.reduce(
    (total, index) =>
      total +
      (cart[index]?.discountPrice || cart[index]?.regularPrice) *
        cart[index]?.quantity,
    0
  );

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      Swal.fire(
        "Bạn chưa chọn sản phẩm nào!",
        "Chọn ít nhất 1 món.",
        "warning"
      );
      return;
    }
    const selectedProducts = selectedItems.map((index) => cart[index]);
    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
    Swal.fire({
      title: "Đang xử lý đơn hàng...",
      html: `
        <div class="custom-loader"></div>
        <div style="margin-top:10px;">Xin vui lòng chờ một chút... 🚀</div>
      `,
      allowOutsideClick: false,
      showConfirmButton: false,
      backdrop: `rgba(0,0,0,0.4)`,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "Đặt hàng thành công!",
        text: "Đang chuyển sang trang thanh toán,... VANTOI 🛒",
        showConfirmButton: false,
        timer: 2000,
        willOpen: () => {
          fireConfetti();
          fireRocketConfetti();
          fireLightBurst();
        },
      });

      setTimeout(() => {
        navigate("/checkout"); // ✨ Sau khi lưu localStorage mới navigate
      }, 2500);
    }, 1500);
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const fireRocketConfetti = () => {
    const duration = 1.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  };

  const fireLightBurst = () => {
    const burst = document.createElement("div");
    burst.className = "light-burst";
    document.body.appendChild(burst);

    setTimeout(() => {
      burst.remove();
    }, 800);
  };

  if (!user) {
    return (
      <div className="container my-5 text-center">
        <h2>Giỏ hàng</h2>
        <p>Bạn cần đăng nhập để xem giỏ hàng.</p>
        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
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
          <p>GIỎ HÀNG CỦA BẠN</p>
        </center>
      </motion.h1>
      {cart.length === 0 ? (
        <p className="text-center">Giỏ hàng của bạn đang trống.</p>
      ) : (
        <>
          <div className="text-end mb-3">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={toggleSelectAll}
            >
              {selectedItems.length === cart.length
                ? "Bỏ chọn tất cả"
                : "Chọn tất cả"}
            </button>
          </div>

          <div className="row g-4">
            {cart.map((item, index) => (
              <div key={index} className="col-6 col-md-3">
                <div
                  className={`card h-100 shadow-sm ${
                    selectedItems.includes(index) ? "border-success" : ""
                  }`}
                >
                  <div className="position-relative">
                    <input
                      type="checkbox"
                      className="card-checkbox"
                      checked={selectedItems.includes(index)}
                      onChange={() => toggleSelectItem(index)}
                    />

                    <img
                      src={
                        item.imagePath && item.imagePath.trim() !== ""
                          ? item.imagePath
                          : "https://via.placeholder.com/400"
                      }
                      alt={item.productName}
                      className="card-img-top img-fluid rounded"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="card-body text-center">
                    <h5 className="card-title">{item.productName}</h5>

                    {/* Thêm màu sắc và kích cỡ */}
                    {/* <p className="text-muted small mb-1">
                      Màu:{" "}
                      <span className="fw-semibold">
                        {item.selectedColor || "Không có"}
                      </span>
                    </p> */}
                    <p className="text-muted small mb-2">
                      Kích cỡ:{" "}
                      <span className="fw-semibold">
                        {item.selectedSize || "Không có"}
                      </span>
                    </p>

                    <p className="text-danger fw-bold mb-2">
                      <i>
                        <u>đ</u>
                      </i>{" "}
                      {item.discountPrice?.toLocaleString()}
                    </p>

                    {/* Số lượng */}
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          index,
                          parseInt(e.target.value, 10)
                        )
                      }
                      className="form-control quantity-input mx-auto mb-2"
                      style={{ width: "70px" }}
                    />

                    {/* Nút xoá */}
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleRemoveFromCart(index)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <h4 className="fw-bold mb-3">
              Tổng tiền:{" "}
              <span className="text-success">
                {totalPrice.toLocaleString()} VND
              </span>
            </h4>
            <button
              className="btn btn-success btn-lg px-5 mt-3"
              onClick={handleCheckout}
            >
              Đặt hàng ngay 🚀
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
