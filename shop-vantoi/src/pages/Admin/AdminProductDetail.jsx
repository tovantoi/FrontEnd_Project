import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, Tab, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  faArrowLeft,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    fetch(`https://localhost:7022/minimal/api/get-product-by-id?id=${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product)
    return <div className="container mt-5">Đang tải chi tiết sản phẩm...</div>;

  return (
    <div className="container mt-5">
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
          <p>CHI TIẾT SẢN PHẨM</p>
        </center>
      </motion.h1>
      <motion.div
        className="card shadow-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="mb-3 text-center text-uppercase">
          {product.productName}
        </h2>

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="info" title="🧾 Thông tin chung">
            <div className="row">
              <div className="col-md-6 text-center">
                <img
                  src={product.imagePath}
                  alt={product.productName}
                  className="img-fluid rounded"
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300";
                  }}
                />
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Giá gốc:</strong>{" "}
                  {product.regularPrice.toLocaleString()} VND
                </p>
                <p>
                  <strong>Khuyến mãi:</strong>{" "}
                  {product.discountPrice.toLocaleString()} VND
                </p>
                <p>
                  <strong>Thương hiệu:</strong> {product.brand}
                </p>
                <p>
                  <strong>Kích thước:</strong> {product.size}
                </p>
                <p>
                  <strong>Màu sắc:</strong> {product.color}
                </p>
                <p>
                  <strong>Chất liệu:</strong> {product.material}
                </p>
                <p>
                  <strong>Giới tính:</strong> {product.gender}
                </p>
                <p>
                  <strong>Đóng gói:</strong> {product.packaging}
                </p>
                <p>
                  <strong>Xuất xứ:</strong> {product.origin}
                </p>
                <p>
                  <strong>Nhà SX:</strong> {product.manufacturer}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  {product.isActive ? (
                    <Badge bg="success">
                      <FontAwesomeIcon icon={faCheckCircle} /> Đang bán
                    </Badge>
                  ) : (
                    <Badge bg="secondary">
                      <FontAwesomeIcon icon={faTimesCircle} /> Ngừng bán
                    </Badge>
                  )}
                </p>
                <p>
                  <strong>Ngày tạo:</strong>{" "}
                  {new Date(product.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </Tab>

          <Tab eventKey="desc" title="📝 Mô tả chi tiết">
            <div className="p-3">
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <em>Không có mô tả chi tiết.</em>
              )}
            </div>
          </Tab>
        </Tabs>

        <motion.button
          className="btn btn-dark mt-3"
          onClick={() => navigate("/admin/products")}
          whileHover={{ scale: 1.1, backgroundColor: "#343a40" }}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Quay lại
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ProductDetail;
