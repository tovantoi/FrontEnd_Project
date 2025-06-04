import React from "react";
import { motion } from "framer-motion";
import "../CSS/BlogList.css";

const BlogList = ({ blogs, onSelect }) => {
  return (
    <div className="container py-5 blog-list-container">
      <motion.h1
        className="product-name-title mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        whileHover={{
          scale: 1.05,
          textShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        PHONG CÁCH THỜI TRANG
      </motion.h1>

      <div className="row g-4">
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            className="col-12 col-md-6 col-lg-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className="card h-100 shadow-sm"
              onClick={() => onSelect(blog.id)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{blog.title}</h5>
                <p className="card-text text-muted">{blog.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
