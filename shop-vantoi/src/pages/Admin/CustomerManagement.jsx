import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://localhost:7022/minimal/api/get-customers"
      );
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setError("Không thể lấy danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, customerName) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có chắc muốn xóa khách hàng?",
        text: `Khách hàng: ${customerName}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `https://localhost:7022/minimal/api/delete-customer?id=${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) throw new Error("Không thể xóa khách hàng.");

        setCustomers(customers.filter((customer) => customer.id !== id));

        await Swal.fire({
          title: "Thành công!",
          text: "Khách hàng đã được xóa.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      await Swal.fire({
        title: "Lỗi!",
        text: err.message || "Đã xảy ra lỗi khi xóa khách hàng.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <motion.div
      className="container my-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
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
          <p>QUẢN LÍ KHÁCH HÀNG</p>
        </center>
      </motion.h1>
      {error && (
        <motion.div
          className="alert alert-danger"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.div>
      )}
      <motion.table
        className="table table-striped"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <thead>
          <tr>
            <th>Họ</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Avatar</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <motion.tbody
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center">
                Đang tải...
              </td>
            </tr>
          ) : customers.length > 0 ? (
            customers.map((customer) => (
              <motion.tr
                key={customer.id}
                whileHover={{ scale: 1.02, backgroundColor: "#f8f9fa" }}
                transition={{ duration: 0.3 }}
              >
                <td>{customer.firstName}</td>
                <td>{customer.lastName}</td>
                <td>{customer.email}</td>
                <td>{customer.phoneNumber}</td>
                <td>
                  <motion.img
                    src={
                      customer.avatarImagePath &&
                      customer.avatarImagePath.trim() !== ""
                        ? customer.avatarImagePath
                        : "https://via.placeholder.com/400"
                    }
                    alt={customer.firstName}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  />
                </td>
                <td>
                  <motion.button
                    className="btn btn-danger"
                    onClick={() =>
                      handleDelete(
                        customer.id,
                        `${customer.firstName} ${customer.lastName}`
                      )
                    }
                    whileHover={{ scale: 1.1, backgroundColor: "#e53935" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Xoá
                  </motion.button>
                </td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Không có khách hàng
              </td>
            </tr>
          )}
        </motion.tbody>
      </motion.table>
    </motion.div>
  );
};

export default CustomerManagement;
