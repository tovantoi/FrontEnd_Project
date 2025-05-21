import React from "react";
import { motion } from "framer-motion";
import "../CSS/BlogDetail.css"; 

const BlogDetail = ({ blog, onBack }) => {
    return (
      <div className="blog-detail-container container py-5">
        <motion.button
                onClick={onBack}
                className="btn btn-primary mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "#0056b3",
                  boxShadow: "0px 0px 10px rgba(0, 0, 255, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                ← Quay lại
              </motion.button>
  
        <div className="row g-5">
          {/* Phần ảnh & video */}
          <div className="col-md-6">
            {blog.coverImage && (
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="img-fluid rounded shadow-sm mb-3 blog-image"
              />
            )}
  
            {blog.videoUrl && (
              <video
                controls
                src={blog.videoUrl}
                className="w-100 rounded shadow-sm blog-video"
              />
            )}
          </div>
  
          {/* Phần nội dung */}
          <div className="col-md-6">
            <motion.h2
              className="fw-bold mb-3 blog-title"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {blog.title}
            </motion.h2>
  
            <p className="text-muted mb-4 blog-description">{blog.description}</p>
  
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default BlogDetail;