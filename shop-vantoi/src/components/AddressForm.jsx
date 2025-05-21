import React from "react";
const AddressForm = ({ formData = {}, setFormData, onSubmit }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <form>
      {/* <div className="mb-3">
        <label>Email *</label>
        <input
          type="email"
          name="email"
          className="form-control"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div> */}
      <div className="mb-3">
        <label>Họ và Tên *</label>
        <input
          type="text"
          name="fullName"
          className="form-control"
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label>Số điện thoại *</label>
        <input
          type="tel"
          name="phone"
          className="form-control"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label>Tỉnh/Thành phố *</label>
        <select
          name="city"
          className="form-control"
          value={formData.city}
          onChange={handleInputChange}
          required
        >
          <option value="">Chọn Tỉnh/Thành phố</option>
          <option value="Hà Nội">Hà Nội</option>
          <option value="Hồ Chí Minh">Hồ Chí Minh</option>
          <option value="Đà Nẵng">Đà Nẵng</option>
        </select>
      </div>
      <div className="mb-3">
        <label>Quận/Huyện *</label>
        <input
          type="text"
          name="district"
          className="form-control"
          value={formData.district}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label>Phường/Xã *</label>
        <input
          type="text"
          name="ward"
          className="form-control"
          value={formData.ward}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label>Địa chỉ chi tiết *</label>
        <input
          type="text"
          name="address"
          className="form-control"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-3">
        <label>Ghi chú</label>
        <textarea
          name="note"
          className="form-control"
          rows="3"
          placeholder="Ghi chú cho đơn hàng (nếu có)"
          value={formData.note || ""}
          onChange={handleInputChange}
        ></textarea>
      </div>
      <button type="button" className="btn btn-primary" onClick={onSubmit}>
        Lưu địa chỉ
      </button>
    </form>
  );
};

export default AddressForm;
