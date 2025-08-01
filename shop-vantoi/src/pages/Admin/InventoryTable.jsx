import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaAngleDown, FaAngleUp, FaSearch } from "react-icons/fa";
import "../AdminCss/InventoryTable.css";

const STOCK_WARNING = 5; // Số lượng tồn kho thấp sẽ cảnh báo

const InventoryTable = () => {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({}); // state cho collapse size

  useEffect(() => {
    fetch("https://localhost:7022/minimal/api/get-inventory")
      .then((res) => res.json())
      .then(setInventory);
  }, []);

  const filtered = inventory.filter((item) =>
    item.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="inventory-dashboard-card">
      <div className="inventory-header">
        <h2>TỒN KHO SẢN PHẨM</h2>
        <div className="inventory-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="inventory-table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th style={{ width: 70 }}>ID</th>
              <th style={{ minWidth: 180 }}>Tên sản phẩm</th>
              <th style={{ width: 110 }}>Tồn kho</th>
              <th style={{ width: 80 }}>Chi tiết size</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  Không tìm thấy sản phẩm.
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => (
                <React.Fragment key={item.productId}>
                  <tr>
                    <td>{item.productId}</td>
                    <td>{item.productName}</td>
                    <td>
                      <span
                        className={
                          item.totalStock === 0
                            ? "stock-badge out"
                            : item.totalStock <= STOCK_WARNING
                            ? "stock-badge low"
                            : "stock-badge normal"
                        }
                      >
                        {item.totalStock}
                      </span>
                    </td>
                    <td>
                      {item.sizes && item.sizes.length > 0 ? (
                        <button
                          className="btn-size-detail"
                          onClick={() =>
                            setExpanded((old) => ({
                              ...old,
                              [item.productId]: !old[item.productId],
                            }))
                          }
                          title="Xem chi tiết size"
                        >
                          {expanded[item.productId] ? (
                            <FaAngleUp />
                          ) : (
                            <FaAngleDown />
                          )}
                          &nbsp;Size
                        </button>
                      ) : (
                        <span className="no-size">-</span>
                      )}
                    </td>
                  </tr>
                  {/* Hiện size chi tiết nếu có */}
                  <AnimatePresence>
                    {expanded[item.productId] && (
                      <motion.tr
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="size-row"
                      >
                        <td></td>
                        <td colSpan={3}>
                          <div className="size-list">
                            {item.sizes.map((size, i) => (
                              <span
                                key={i}
                                className={
                                  size.stockQuantity === 0
                                    ? "size-badge out"
                                    : size.stockQuantity <= STOCK_WARNING
                                    ? "size-badge low"
                                    : "size-badge normal"
                                }
                              >
                                {size.sizeLabel}: <b>{size.stockQuantity}</b>
                              </span>
                            ))}
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="inventory-footer">
        Tổng sản phẩm: <b>{filtered.length}</b>
      </div>
    </div>
  );
};

export default InventoryTable;
