import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <div className="container py-5">
      <Helmet>
        <title>Về Chúng Tôi - VANTOI Fashion</title>
      </Helmet>

      {/* Header */}
      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="fw-bold mb-3" style={{ color: "#ff6f61" }}>
          Câu chuyện VANTOI
        </h1>
        <p className="lead text-muted">
          Hành trình thời trang và phong cách cá nhân.
        </p>
      </motion.div>

      {/* Ảnh chính */}
      <motion.img
        src="/assets/store-story.jpg"
        alt="Về VANTOI"
        className="img-fluid rounded shadow mb-5"
        initial={{ scale: 0.9 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Phần 1 */}
      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">1. Khởi nguồn đam mê</h3>
        <p>
          VANTOI ra đời từ một niềm đam mê bất tận với thời trang. Với mong muốn
          biến mỗi bộ đồ thành một tuyên ngôn phong cách, chúng tôi đặt tâm
          huyết vào từng đường kim mũi chỉ.
        </p>
      </section>

      {/* Ảnh phụ */}
      <motion.img
        src="/assets/about-passion.jpg"
        alt="Khởi nguồn"
        className="img-fluid rounded shadow mb-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Phần 2 */}
      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">2. Sứ mệnh của chúng tôi</h3>
        <p>
          Chúng tôi mong muốn mỗi khách hàng khi khoác lên mình sản phẩm của
          VANTOI sẽ cảm thấy tự tin, cá tính và nổi bật nhất. Thời trang không
          chỉ là mặc, mà còn là sống cùng nó mỗi ngày.
        </p>
      </section>

      {/* Quote đẹp */}
      <blockquote className="blockquote text-center my-5">
        <p className="mb-0 fst-italic">
          "Thời trang là ngôn ngữ không lời mạnh mẽ nhất."
        </p>
      </blockquote>

      {/* Phần 3 */}
      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">3. Giá trị cốt lõi</h3>
        <ul>
          <li>Chất lượng là trên hết.</li>
          <li>Thiết kế hiện đại, dẫn đầu xu hướng.</li>
          <li>Phong cách dịch vụ tận tâm, chuyên nghiệp.</li>
        </ul>
      </section>

      {/* Phần 4 */}
      <section className="mb-5">
        <h3 className="fw-bold mb-3 text-primary">4. Vì sao chọn VANTOI?</h3>
        <p>
          Từ các chất liệu cao cấp, kỹ thuật may tỉ mỉ, đến dịch vụ chăm sóc
          khách hàng tuyệt vời, tất cả được tạo nên để bạn cảm thấy đặc biệt mỗi
          ngày.
        </p>
      </section>

      {/* Ảnh phụ */}
      <motion.img
        src="/assets/about-values.jpg"
        alt="Giá trị VANTOI"
        className="img-fluid rounded shadow mb-5"
        initial={{ scale: 0.8 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Nút quay lại */}
      <div className="text-center mt-5">
        <motion.button
          className="btn btn-lg btn-outline-primary"
          whileHover={{ scale: 1.1 }}
          onClick={() => window.history.back()}
        >
          ⬅️ Quay lại
        </motion.button>
      </div>
    </div>
  );
};

export default AboutUs;
