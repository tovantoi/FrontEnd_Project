import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // Đảm bảo có CSS cơ bản

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <Outlet /> {/* Render nội dung từng trang con */}
      </div>
    </div>
  );
};

export default AdminLayout;
