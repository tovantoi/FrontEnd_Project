import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../AdminCss/Dashboard.css";
import InventoryTable from "./InventoryTable";

// Trong component Dashboard của bạn
<InventoryTable />;
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Modern palette
const palette = [
  "#3b82f6", // blue
  "#f59e42", // orange
  "#22c55e", // green
  "#e11d48", // red
  "#8b5cf6", // purple
  "#06b6d4", // cyan
  "#fbbf24", // yellow
];

const Dashboard = () => {
  const getRandomColor = () =>
    palette[Math.floor(Math.random() * palette.length)];

  const [summary, setSummary] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [revenueTimeline, setRevenueTimeline] = useState([]);
  const [revenueNewCustomers, setRevenueNewCustomers] = useState([]);
  const [revenueMode, setRevenueMode] = useState("day");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const isCustomDateMode = fromDate !== "" && toDate !== "";

  useEffect(() => {
    fetch("https://localhost:7022/minimal/api/get-sales-summary")
      .then((res) => res.json())
      .then(setSummary);
    fetch("https://localhost:7022/minimal/api/get-top-product")
      .then((res) => res.json())
      .then(setTopProducts);
    fetch("https://localhost:7022/minimal/api/get-revenue-product-in-category")
      .then((res) => res.json())
      .then(setCategoryRevenue);
  }, []);

  useEffect(() => {
    if (!isCustomDateMode) {
      setFromDate("");
      setToDate("");
    }
  }, [revenueMode]);

  useEffect(() => {
    let url = isCustomDateMode
      ? `https://localhost:7022/minimal/api/get-revenue-time?from=${fromDate}&to=${toDate}`
      : `https://localhost:7022/minimal/api/get-revenue-day-week-month?mode=${revenueMode}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setRevenueTimeline(data);
        setRevenueNewCustomers(
          data.map((i) => ({
            label: i.label,
            value: i.totalRevenueFromNewCustomers || 0,
          }))
        );
      });
  }, [revenueMode, fromDate, toDate]);

  const revenueTimelineChart = {
    labels: revenueTimeline.map((i) => i.label),
    datasets: [
      {
        label: isCustomDateMode
          ? "Tổng doanh thu (Tuỳ chọn)"
          : `Tổng doanh thu (${revenueMode})`,
        data: revenueTimeline.map((i) => i.totalRevenue / 1000),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        tension: 0.4,
        pointRadius: 4,
        fill: true,
      },
    ],
  };

  const revenueNewCustomerChart = {
    labels: revenueNewCustomers.map((i) => i.label),
    datasets: [
      {
        label: isCustomDateMode
          ? "Doanh thu KH mới (Tuỳ chọn)"
          : `Doanh thu KH mới (${revenueMode})`,
        data: revenueNewCustomers.map((i) => i.value / 1000),
        borderColor: "#f59e42",
        backgroundColor: "rgba(245, 158, 66, 0.13)",
        tension: 0.4,
        pointRadius: 4,
        fill: true,
      },
    ],
  };

  const topProductChartData = {
    labels: topProducts.map((p) => p.productName),
    datasets: [
      {
        label: "Doanh thu (nghìn VNĐ)",
        data: topProducts.map((p) => p.totalRevenue / 1000),
        backgroundColor: topProducts.map(
          (_, idx) => palette[idx % palette.length]
        ),
        borderRadius: 5,
      },
    ],
  };

  const categoryRevenueChartData = {
    labels: categoryRevenue.map((c) => c.categoryName),
    datasets: [
      {
        label: "Doanh thu (nghìn VNĐ)",
        data: categoryRevenue.map((c) => c.totalRevenue / 1000),
        backgroundColor: categoryRevenue.map(
          (_, idx) => palette[idx % palette.length]
        ),
        borderRadius: 5,
      },
    ],
  };

  return (
    <div className="dashboard">
      <motion.h1
        className="dashboard-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        THỐNG KÊ DOANH THU
      </motion.h1>

      <div className="info-grid">
        <motion.div className="info-card" whileHover={{ scale: 1.03 }}>
          <div className="label">Sản phẩm đã bán</div>
          <div className="value blue">{summary.totalProductsSold || 0}</div>
        </motion.div>
        <motion.div className="info-card" whileHover={{ scale: 1.03 }}>
          <div className="label">Doanh thu KH mới</div>
          <div className="value orange">
            {summary.totalRevenueFromNewCustomers?.toLocaleString() || 0} VNĐ
          </div>
        </motion.div>
        <motion.div className="info-card" whileHover={{ scale: 1.03 }}>
          <div className="label">Chi phí</div>
          <div className="value green">
            {summary.estimatedCost?.toLocaleString() || 0} VNĐ
          </div>
        </motion.div>
        <motion.div className="info-card" whileHover={{ scale: 1.03 }}>
          <div className="label">Lợi nhuận</div>
          <div className="value purple">
            {summary.profit?.toLocaleString() || 0} VNĐ
          </div>
        </motion.div>
      </div>

      <div className="filter-row">
        {!isCustomDateMode && (
          <>
            <label>Chế độ thống kê:</label>
            <select
              value={revenueMode}
              onChange={(e) => setRevenueMode(e.target.value)}
            >
              <option value="day">Ngày</option>
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
              <option value="">Tất cả</option>
            </select>
          </>
        )}

        <label>Từ:</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <label>Đến:</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        {isCustomDateMode && (
          <span className="custom-date-notice">
            📆 Đang xem theo thời gian tự chọn
          </span>
        )}
      </div>

      <div className="chart-xl-wrapper">
        <motion.div className="chart-xl" whileHover={{ scale: 1.01 }}>
          <div className="chart-title">Doanh thu theo thời gian</div>
          <Line
            data={revenueTimelineChart}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" },
                tooltip: { enabled: true },
              },
              scales: {
                x: { title: { display: true, text: "Thời gian" } },
                y: {
                  beginAtZero: true,
                  min: 0,
                  suggestedMax:
                    Math.max(
                      ...revenueTimeline.map((i) => i.totalRevenue / 1000)
                    ) + 10 || 100,
                  title: { display: true, text: "Doanh thu (ngàn VNĐ)" },
                },
              },
              elements: {
                point: { radius: 6 },
                line: { borderWidth: 3 },
              },
            }}
          />
        </motion.div>
        <motion.div className="chart-xl" whileHover={{ scale: 1.01 }}>
          <div className="chart-title">Doanh thu từ KH mới</div>
          <Line
            data={revenueNewCustomerChart}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" },
                tooltip: { enabled: true },
              },
              scales: {
                x: { title: { display: true, text: "Thời gian" } },
                y: {
                  beginAtZero: true,
                  min: 0,
                  suggestedMax:
                    Math.max(
                      ...revenueNewCustomers.map((i) => i.value / 1000)
                    ) + 10,
                  title: { display: true, text: "Doanh thu (ngàn VNĐ)" },
                },
              },
              elements: { point: { radius: 6 } },
            }}
          />
        </motion.div>
      </div>

      <div className="grid-container">
        <motion.div className="chart" whileHover={{ scale: 1.01 }}>
          <div className="chart-title">Top sản phẩm bán chạy</div>
          <Bar
            data={topProductChartData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, grid: { color: "#f3f4f6" } },
              },
            }}
          />
        </motion.div>
        <motion.div className="chart" whileHover={{ scale: 1.01 }}>
          <div className="chart-title">Doanh thu theo danh mục</div>
          <Bar
            data={categoryRevenueChartData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, grid: { color: "#f3f4f6" } },
              },
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
