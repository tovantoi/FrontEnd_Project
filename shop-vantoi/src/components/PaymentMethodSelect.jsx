import React from "react";
import { FaMoneyBillWave, FaPaypal, FaQrcode } from "react-icons/fa";
import "../CSS/PaymentMethodSelect.css";

const paymentMethods = [
  {
    value: "CASH",
    icon: <FaMoneyBillWave color="#27ae60" style={{ marginRight: 8 }} />,
    label: "Thanh toán khi nhận hàng (COD)",
    desc: "Bạn sẽ thanh toán cho nhân viên khi nhận hàng.",
  },
  {
    value: "Online",
    icon: <FaPaypal color="#0070BA" style={{ marginRight: 8 }} />,
    label: "Thanh toán qua PayPal",
    desc: "Bảo mật qua PayPal, hỗ trợ tất cả thẻ quốc tế.",
  },
  {
    value: "PAYOS",
    icon: <FaQrcode color="#e67e22" style={{ marginRight: 8 }} />,
    label: "Thanh toán qua PayOS",
    desc: "Quét QR hoặc chuyển khoản ngân hàng qua PayOS.",
  },
];

const PaymentMethodDropdown = ({ value, onChange }) => (
  <div className="payment-method-dropdown">
    <label
      className="dropdown-label fw-bold mb-2"
      htmlFor="payment-method-select"
    >
      Phương thức thanh toán
    </label>
    <div className="custom-dropdown-wrapper">
      <select
        id="payment-method-select"
        className="custom-dropdown form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          -- Chọn phương thức thanh toán --
        </option>
        {paymentMethods.map((pm) => (
          <option key={pm.value} value={pm.value}>
            {pm.label}
          </option>
        ))}
      </select>
      {value && (
        <div className="dropdown-desc mt-2">
          <span className="dropdown-icon">
            {paymentMethods.find((pm) => pm.value === value)?.icon}
          </span>
          <span>
            <b>{paymentMethods.find((pm) => pm.value === value)?.label}</b>
            <br />
            <span className="text-muted">
              {paymentMethods.find((pm) => pm.value === value)?.desc}
            </span>
          </span>
        </div>
      )}
    </div>
  </div>
);

export default PaymentMethodDropdown;
