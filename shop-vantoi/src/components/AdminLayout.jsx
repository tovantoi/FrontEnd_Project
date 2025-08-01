import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const SIDEBAR_WIDTH = 250; // px, nhớ đồng bộ với CSS

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="admin-layout">
      {/* Nút toggle */}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label="Ẩn/hiện menu"
      >
        <span className="material-icons">
          {sidebarOpen ? "chevron_left" : "menu"}
        </span>
      </button>
      <AdminSidebar open={sidebarOpen} />
      <div
        className={`admin-content${sidebarOpen ? "" : " expanded"}`}
        style={{
          marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 64, // Nếu collapsed chỉ còn icon
          transition: "margin-left 0.25s",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
