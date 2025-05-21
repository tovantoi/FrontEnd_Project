import React from "react";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <motion.h1
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          repeat: Infinity, // Lặp lại vô hạn
          repeatType: "reverse", // Lặp lại theo chiều ngược lại
          repeatDelay: 2, // Thời gian chờ trước khi lặp lại
        }}
        style={{
          fontSize: 50,
          color: "red",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        THE PAGE NOT_FOUND...?
      </motion.h1>

      <div style={{ textAlign: "center", marginTop: "70px" }}>
        {/* Animation for the main message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
        >
          <motion.img
            src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGZhMHZ1ODhscWhubndhd3g0OWRtaG1kYXVoeHl1ZHAzOGZqcTAzeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BvNIKrJKQOEnATn76J/giphy.gif"
            alt="Not Found Animation"
            style={{
              width: "300px",
              marginBottom: "10px",
            }}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1,
              delay: 0.5,
            }}
          />
          <h1 style={{ fontSize: "2.5rem", color: "#333" }}>
            Oops! We couldn't find the page you're looking for.
          </h1>
          <p style={{ fontSize: "1rem", color: "#666", marginTop: "10px" }}>
            The page may have been moved, deleted, or does not exist.
          </p>
        </motion.div>

        {/* Decorative Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.5,
            delay: 1,
          }}
          style={{
            marginTop: "40px",
          }}
        >
          <motion.img
            src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2tmYTZqbGs5dTJldXF2MGtwZHNlZm8zeTZ5eGdzMzY1bDBvdDhsMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/u2wg2uXJbHzkXkPphr/giphy.gif"
            alt="Decorative Not Found"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }}
            style={{
              width: "150px",
              height: "150px",
            }}
          />
        </motion.div>

        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 2,
            delay: 1.5,
          }}
          style={{
            marginTop: "20px",
          }}
        >
          <button
            onClick={() => (window.location.href = "/")}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              color: "#fff",
              backgroundColor: "#007BFF",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
