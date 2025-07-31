import React, { useState, useEffect } from "react";
import AddressForm from "../components/AddressForm";
import Swal from "sweetalert2";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import "./CSS/CheckoutPage.css";
import { useNavigate } from "react-router-dom";

const CheckoutPage = ({ cart, setCart }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    address: "",
    note: "",
    paymentMethod: "",
    orderItems: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [customerAddressId, setCustomerAddressId] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const [showConfetti, setShowConfetti] = useState(false);
  const [rocketAnimation, setRocketAnimation] = useState(false);
  const [width, height] = useWindowSize();
  const navigate = useNavigate();
  useEffect(() => {
    const buyNowProduct = localStorage.getItem("buyNowProduct");
    const selectedProducts = localStorage.getItem("selectedProducts");

    if (buyNowProduct) {
      setCart([JSON.parse(buyNowProduct)]); // ✨ Ưu tiên sản phẩm Mua Ngay
    } else if (selectedProducts) {
      setCart(JSON.parse(selectedProducts)); // Còn không thì lấy từ selectedProducts như cũ
    }
  }, [setCart]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      fetch(
        `https://localhost:7022/minimal/api/get-address-by-customer-id?id=${user.id}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setSavedAddresses(data);
            setSelectedAddressId(data[0].id);
          } else {
            setUseNewAddress(true);
          }
        })
        .catch((err) => {
          console.error("Lỗi khi lấy địa chỉ:", err);
          setUseNewAddress(true);
        });
    }
  }, []);
  useEffect(() => {
    const selected = localStorage.getItem("selectedProducts");
    if (selected) {
      setCart(JSON.parse(selected)); // ✨ Lấy sản phẩm từ localStorage
    }
  }, [setCart]);

  const handleSaveAddress = async () => {
    setLoading(true);
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        Swal.fire({
          title: "Thêm sản phẩm thất bại",
          text: "Bạn cần đăng nhập để tạo địa chỉ.",
          icon: "error",
          confirmButtonText: "Thử lại",
        });
        return;
      }

      const customerId = user.id;
      const response = await fetch(
        "https://localhost:7022/minimal/api/create-customeraddress",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId,
            fullName: formData.fullName,
            phone: formData.phone,
            province: formData.city,
            district: formData.district,
            ward: formData.ward,
            address: formData.address,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.isSuccess) {
        throw new Error(data.message || "Không thể tạo địa chỉ giao hàng.");
      }

      const addressId = data.query?.id;
      if (!addressId) throw new Error("Không nhận được ID từ API.");

      setCustomerAddressId(addressId);
      setSelectedAddressId(addressId);
      setUseNewAddress(false);

      Swal.fire({
        title: "Địa chỉ đã được lưu thành công!",
        icon: "success",
        confirmButtonText: "OK",
      });

      const userReload = JSON.parse(localStorage.getItem("user"));
      const reloadRes = await fetch(
        `https://localhost:7022/minimal/api/get-address-by-customer-id?id=${userReload.id}`
      );
      const reloadData = await reloadRes.json();
      setSavedAddresses(reloadData || []);
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi lưu địa chỉ.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Hàm bắn Rocket confetti
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
  // CheckoutPage.jsx - phần xử lý gửi email đơn hàng hoàn chỉnh

  const shippingFee = 30000;
  const totalProductPrice = cart.reduce(
    (total, item) =>
      total + (item.discountPrice || item.regularPrice) * item.quantity,
    0
  );
  const totalPrice = Math.max(
    totalProductPrice + shippingFee - discountAmount,
    0
  );

  const sendOrderEmailToCustomer = async (
    user,
    cart,
    orderCode,
    couponCode = null,
    discountAmount = 0,
    shippingFee = 0,
    totalBeforeDiscount = 0,
    totalPrice = 0
  ) => {
    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/send-order-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            customerName: user.fullName || `${user.lastName} ${user.firstName}`,
            orderCode,
            totalPrice,
            totalBeforeDiscount,
            shippingFee,
            couponCode,
            discountAmount,
            orderItems: cart.map((item) => ({
              productName: item.productName,
              quantity: item.quantity,
              price:
                (item.discountPrice || item.regularPrice || 0) *
                (item.quantity || 0),
            })),
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        console.warn("Gửi email thất bại:", data.message || "Lỗi không rõ");
      }
    } catch (err) {
      console.error("Lỗi khi gửi email:", err);
    }
  };

  // Hàm Light Burst
  const fireLightBurst = () => {
    const burst = document.createElement("div");
    burst.className = "light-burst"; // Bạn có CSS light-burst rồi mà
    document.body.appendChild(burst);
    setTimeout(() => {
      burst.remove();
    }, 800);
  };
  const handlePlaceOrder = async () => {
    const addressIdToUse = useNewAddress
      ? customerAddressId
      : selectedAddressId;
    if (!addressIdToUse) {
      Swal.fire({
        title: "Thiếu địa chỉ",
        text: "Vui lòng chọn hoặc tạo địa chỉ giao hàng",
        icon: "warning",
      });
      return;
    }

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

    setLoading(true);
    setError("");
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) throw new Error("Bạn cần đăng nhập.");

      const orderItems = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const orderResponse = await fetch(
        "https://localhost:7022/minimal/api/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: user.id,
            customerAddressId: addressIdToUse,
            paymentMethod: formData.paymentMethod,
            orderItems,
            couponCode: couponCode.trim() || null,
          }),
        }
      );

      const orderData = await orderResponse.json();
      if (!orderResponse.ok || !orderData.isSuccess)
        throw new Error(orderData.message);

      const createdOrderId = orderData.query?.id;
      const shouldIncludeShipping =
        formData.paymentMethod === "CASH" || formData.paymentMethod === "";
      const shippingFee = shouldIncludeShipping ? 30000 : 0;

      const totalProductPrice = cart.reduce(
        (total, item) =>
          total +
          (item.discountPrice || item.regularPrice || 0) * item.quantity,
        0
      );

      const totalBeforeDiscount = totalProductPrice + shippingFee;
      const totalPrice = Math.max(totalBeforeDiscount - discountAmount, 0);
      if (formData.paymentMethod === "Online") {
        // PayPal
        const paymentResponse = await fetch(
          "https://localhost:7022/minimal/api/create-payment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: createdOrderId,
              amount: totalPrice,
              paymentMethod: "Online",
              returnUrl:
                "https://c188-115-79-36-134.ngrok-free.app/payment-success",
            }),
          }
        );

        const paymentData = await paymentResponse.json();
        if (!paymentResponse.ok || !paymentData.paymentUrl) {
          throw new Error(
            paymentData.message || "Không tạo được link thanh toán."
          );
        }
        window.location.href = paymentData.paymentUrl;
        return;
      } else if (formData.paymentMethod === "PAYOS") {
        const orderItems = cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          productName: item.productName,
          discountPrice: item.discountPrice,
          //imagePath: item.imagePath,
          product: null, // nếu không cần thiết ở BE thì có thể bỏ
        }));

        const payosResponse = await fetch(
          "https://localhost:7022/api/payos/create",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderCode: createdOrderId.toString(),
              orderId: createdOrderId,
              amount: totalPrice,
              description: "Thanh toán đơn hàng",
              returnUrl: "https://7f66e3c36516.ngrok-free.app/payment-success",
              cancelUrl: "https://7f66e3c36516.ngrok-free.app/payment-cancel",
              webhookUrl: "https://8966ac7322e7.ngrok-free.app/api/payos/ipn",
              buyerName:
                formData.fullName ||
                user.fullName ||
                `${user.lastName} ${user.firstName}`,
              buyerEmail: user.email,
              buyerPhone: formData.phone || "Phone number NotFound!",
              items: cart.map((item) => ({
                productId: item.id,
                productName: item.productName,
                price: parseInt(item.discountPrice || item.regularPrice || 0),
                quantity: item.quantity,
                discountPrice: item.discountPrice,
                product: null,
              })),
            }),
          }
        );

        if (!payosResponse.ok) {
          const errorText = await payosResponse.text();
          throw new Error(
            "Không tạo được link thanh toán PayOS. Chi tiết: " + errorText
          );
        }

        const payosData = await payosResponse.json();
        if (!payosData || !payosData.checkoutUrl) {
          throw new Error("Không nhận được link thanh toán PayOS.");
        }
        console.log("🧾 orderItems gửi lên BE", orderItems);
        localStorage.setItem("justPaidOrderId", createdOrderId);

        window.location.href = payosData.checkoutUrl;
        return;
      }

      setTimeout(() => {
        Swal.fire({
          icon: "success",
          title: "Đặt hàng thành công!",
          text: "Cảm ơn bạn đã đặt hàng tại VANTOI 🛒",
          showConfirmButton: false,
          timer: 2000,
          willOpen: () => {
            fireConfetti();
            fireRocketConfetti();
            fireLightBurst();
          },
        });

        setTimeout(() => {
          setCart([]);
          localStorage.removeItem("buyNowProduct");
          localStorage.removeItem("selectedProducts");
          sendOrderEmailToCustomer(
            user,
            cart,
            `OD${createdOrderId}`,
            couponCode,
            discountAmount,
            shippingFee,
            totalBeforeDiscount,
            totalPrice
          );

          navigate("/my-orders");
        }, 2500);
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const res = await fetch(
        `https://localhost:7022/minimal/api/get-code-coupon?couponcode=${couponCode}`
      );

      if (!res.ok) {
        Swal.fire("Mã không hợp lệ", "Không tìm thấy mã giảm giá.", "error");
        setDiscountAmount(0);
        return;
      }

      const data = await res.json();

      // Kiểm tra xem mã còn hiệu lực hay không
      const now = new Date();
      const endDate = new Date(data.couponEndDate);
      const isStillValid =
        data.isActive && data.timesUsed < data.maxUsage && endDate >= now;

      if (!isStillValid) {
        Swal.fire("Hết hạn", "Mã giảm giá không còn hiệu lực.", "warning");
        setDiscountAmount(0);
        return;
      }

      const discount = parseFloat(data.discount);
      if (isNaN(discount)) {
        Swal.fire("Lỗi", "Giá trị giảm giá không hợp lệ.", "error");
        return;
      }

      setDiscountAmount(discount);
      Swal.fire(
        "Thành công",
        `Áp dụng mã giảm ${discount.toLocaleString()} VND`,
        "success"
      );
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", "Không thể kiểm tra mã giảm giá.", "error");
    }
  };

  return (
    <div className="container my-4">
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
          <p>Đặt hàng</p>
        </center>
      </motion.h1>

      {error && <div className="alert alert-danger text-center">{error}</div>}
      {successMessage && (
        <div className="alert alert-success text-center">{successMessage}</div>
      )}
      <div className="row">
        <div className="col-md-7">
          <h4>1. Địa chỉ giao hàng</h4>
          {savedAddresses.length > 0 && !useNewAddress ? (
            <>
              <label>Chọn địa chỉ đã lưu:</label>
              <select
                className="form-select mb-2"
                value={selectedAddressId}
                onChange={(e) => setSelectedAddressId(e.target.value)}
              >
                {savedAddresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.fullName} - {addr.phone} - {addr.finalAddress}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-outline-primary"
                onClick={() => setUseNewAddress(true)}
              >
                + Nhập địa chỉ mới
              </button>
            </>
          ) : (
            <>
              <AddressForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSaveAddress}
              />
              {savedAddresses.length > 0 && (
                <button
                  className="btn btn-outline-secondary mt-2"
                  onClick={() => setUseNewAddress(false)}
                >
                  ← Quay lại địa chỉ đã lưu
                </button>
              )}
            </>
          )}
        </div>

        <div className="col-md-5">
          <h4>Thông tin đơn hàng</h4>
          <ul className="list-group">
            {cart.map((item, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between"
              >
                <div>
                  <img
                    src={
                      item.imagePath && item.imagePath.trim() !== ""
                        ? item.imagePath
                        : "https://via.placeholder.com/400"
                    }
                    alt={item.productName}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                    className="me-2"
                  />
                  {item.productName}
                </div>
                <div>
                  {item.quantity} x {item.discountPrice || item.regularPrice}{" "}
                  VND
                </div>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between">
              <strong>Tổng giá sản phẩm</strong>
              <span>{totalProductPrice.toLocaleString()} VND</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <strong>Phí vận chuyển</strong>
              <span>{shippingFee.toLocaleString()} VND</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <strong>Thành tiền (chưa giảm)</strong>
              <span>
                {(totalProductPrice + shippingFee).toLocaleString()} VND
              </span>
            </li>

            <li className="list-group-item">
              <label htmlFor="coupon">Mã giảm giá:</label>
              <div className="d-flex mt-1">
                <input
                  type="text"
                  id="coupon"
                  className="form-control me-2"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Nhập mã giảm giá"
                />
                <button
                  className="btn btn-outline-success"
                  onClick={handleApplyCoupon}
                >
                  Áp dụng
                </button>
              </div>
              {discountAmount > 0 && (
                <div className="mt-1 text-success">
                  ✅ Giảm {discountAmount.toLocaleString()} VND
                </div>
              )}
            </li>

            <li className="list-group-item d-flex justify-content-between">
              <strong>Tổng tiền</strong>
              <span>{totalPrice.toLocaleString()} VND</span>
            </li>
          </ul>
          <h4 className="mt-3">3. Phương thức thanh toán</h4>

          <div className="mb-3">
            <input
              type="radio"
              name="paymentMethod"
              value="CASH"
              checked={formData.paymentMethod === "CASH"}
              onChange={handleInputChange}
            />
            <label className="ms-2">Thanh toán khi nhận hàng (COD)</label>
          </div>

          <div className="mb-3">
            <input
              type="radio"
              name="paymentMethod"
              value="Online"
              checked={formData.paymentMethod === "Online"}
              onChange={handleInputChange}
            />
            <label className="ms-2">Thanh toán qua PayPal</label>
          </div>

          <div className="mb-3">
            <input
              type="radio"
              name="paymentMethod"
              value="PAYOS"
              checked={formData.paymentMethod === "PAYOS"}
              onChange={handleInputChange}
            />
            <label className="ms-2">Thanh toán qua PayOS</label>
          </div>

          {/* 🚀 Nút Đặt Hàng */}
          <motion.button
            className="btn btn-success mt-3 w-100"
            onClick={handlePlaceOrder}
            disabled={loading}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.05,
              backgroundColor: "#218838",
              boxShadow: "0px 0px 12px rgba(40, 167, 69, 0.8)",
              y: -5,
            }}
            whileTap={{
              scale: 0.95,
              rotate: 2,
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              repeat: rocketAnimation ? Infinity : 0,
              repeatType: "loop",
            }}
          >
            {loading ? "🚀 Đang xử lý..." : "Đặt hàng ngay 🚀"}
          </motion.button>

          {/* Bắn Confetti */}
          {showConfetti && <Confetti width={width} height={height} />}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
