import React, { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
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

const Dashboard = () => {
  const getRandomColor = () => {
    const colors = ["#ff6ec7", "#ff9000", "#00ff90", "#0090ff", "#ff00d8"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const [color, setColor] = useState(getRandomColor());
  const [highlight, setHighlight] = useState(false);
  const [summary, setSummary] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [revenueTimeline, setRevenueTimeline] = useState([]);
  const [revenueNewCustomers, setRevenueNewCustomers] = useState([]);
  const [revenueMode, setRevenueMode] = useState("day");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    setInterval(() => setColor(getRandomColor()), 5000);
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
    let url = `https://localhost:7022/minimal/api/get-revenue-day-week-month?mode=${revenueMode}`;
    if (fromDate) url += `&from=${fromDate}`;
    if (toDate) url += `&to=${toDate}`;
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
        label: `Tổng doanh thu (${revenueMode})`,
        data: revenueTimeline.map((i) => i.totalRevenue / 1000),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54,162,235,0.3)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const revenueNewCustomerChart = {
    labels: revenueNewCustomers.map((i) => i.label),
    datasets: [
      {
        label: `Doanh thu KH mới (${revenueMode})`,
        data: revenueNewCustomers.map((i) => i.value / 1000),
        borderColor: "#FF8C00",
        backgroundColor: "rgba(255,140,0,0.3)",
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: "#FF8C00",
      },
    ],
  };

  const topProductChartData = {
    labels: topProducts.map((p) => p.productName),
    datasets: [
      {
        label: "Doanh thu (nghìn VNĐ)",
        data: topProducts.map((p) => p.totalRevenue / 1000),
        backgroundColor: topProducts.map(() => getRandomColor()),
      },
    ],
  };

  const categoryRevenueChartData = {
    labels: categoryRevenue.map((c) => c.categoryName),
    datasets: [
      {
        label: "Doanh thu (nghìn VNĐ)",
        data: categoryRevenue.map((c) => c.totalRevenue / 1000),
        backgroundColor: categoryRevenue.map(() => getRandomColor()),
      },
    ],
  };

  const doughnutChartData = {
    labels: ["Marketing", "Bán hàng"],
    datasets: [
      {
        label: "Chi phí (%)",
        data: [75, 25],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverOffset: 4,
      },
    ],
  };

  const barChartData = {
    labels: ["Email", "GDN", "Instagram", "Facebook", "Twitter", "Google Ads"],
    datasets: [
      {
        label: "Doanh thu theo kênh (ngàn đồng)",
        data: [10, 15, 12, 8, 7, 18],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#F7464A",
          "#949FB1",
        ],
      },
    ],
  };

  return (
    <div className="dashboard">
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
          <p>THỐNG KÊ DOANH THU</p>
        </center>
      </motion.h1>

      <div className="info-grid">
        <motion.div className="info-card">
          <div className="label">Sản phẩm đã bán</div>
          <div className="value">{summary.totalProductsSold}</div>
        </motion.div>
        <motion.div className="info-card">
          <div className="label">Doanh thu KH mới</div>
          <div className="value">
            {summary.totalRevenueFromNewCustomers?.toLocaleString()} VNĐ
          </div>
        </motion.div>
        <motion.div className="info-card">
          <div className="label">Chi phí</div>
          <div className="value">
            {summary.estimatedCost?.toLocaleString()} VNĐ
          </div>
        </motion.div>
        <motion.div className="info-card">
          <div className="label">Lợi nhuận</div>
          <div className="value">{summary.profit?.toLocaleString()} VNĐ</div>
        </motion.div>
      </div>

      <div className="filter-row">
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
      </div>
      <div className="chart-xl-wrapper">
        <motion.div className="chart-xl">
          <h3>Doanh thu theo thời gian</h3>
          <Line
            data={revenueTimelineChart}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </motion.div>
        <motion.div className="chart-xl">
          <h3>Doanh thu từ KH mới</h3>
          <Line
            data={revenueNewCustomerChart}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </motion.div>
      </div>

      <div className="grid-container">
        <motion.div className="chart">
          <h3>Top sản phẩm bán chạy</h3>
          <Bar data={topProductChartData} />
        </motion.div>
        <motion.div className="chart">
          <h3>Doanh thu theo danh mục</h3>
          <Bar data={categoryRevenueChartData} />
        </motion.div>
        <motion.div className="chart">
          <h3>Thành phần chi phí</h3>
          <Doughnut data={doughnutChartData} />
        </motion.div>
        <motion.div className="chart">
          <h3>Doanh thu theo kênh</h3>
          <Bar data={barChartData} />
        </motion.div>
        <motion.div className="sales-rep">
          <h3>Đại diện bán hàng</h3>
          <div className="sales-card">Văn Tới: 3.200-VNĐ</div>
          <div className="sales-card">Quốc Ninh: 2.600-VNĐ</div>
          <div className="sales-card">Bá Hiếu: 2.100-VNĐ</div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
