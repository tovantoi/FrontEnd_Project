import React, { useEffect } from "react";
import { Carousel } from "bootstrap";

const Banner = () => {
  useEffect(() => {
    // Khởi tạo Bootstrap carousel thủ công
    const carouselElement = document.getElementById("carouselExampleIndicators");
    if (carouselElement) {
      new Carousel(carouselElement, {
        interval: 3000, // Thời gian tự động chuyển slide (ms)
        ride: "carousel", // Bật tự động chạy
      });
    }
  }, []);

  return (
    <div
      id="carouselExampleIndicators"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="3000"
    >
      {/* Indicators */}
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="3"
          aria-label="Slide 4"
        ></button>
      </div>

      {/* Slides */}
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src="/assets/mm.jpg"
            className="d-block w-100"
            alt="Slide 1"
            style={{
              height: "700px",
              objectFit: "cover",
            }}
          />
          <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-3 rounded">
            <h5>Chào mừng đến với chúng tôi</h5>
            <p>Trải nghiệm dịch vụ tốt nhất từ hệ thống của chúng tôi.</p>
          </div>
        </div>
        <div className="carousel-item">
          <img
            src="/assets/m2.jpg"
            className="d-block w-100"
            alt="Slide 2"
            style={{
              height: "700px",
              objectFit: "cover",
            }}
          />
          <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-3 rounded">
            <h5>Ưu đãi lớn</h5>
            <p>Khám phá các ưu đãi không thể bỏ qua ngay hôm nay!</p>
          </div>
        </div>
        <div className="carousel-item">
          <img
            src="/assets/m3.jpg"
            className="d-block w-100"
            alt="Slide 3"
            style={{
              height: "700px",
              objectFit: "cover",
            }}
          />
          <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-3 rounded">
            <h5>Chất lượng tuyệt vời</h5>
            <p>Cùng bạn đồng hành trong mọi trải nghiệm.</p>
          </div>
        </div>
        <div className="carousel-item">
          <img
            src="/assets/m4.jpg"
            className="d-block w-100"
            alt="Slide 4"
            style={{
              height: "700px",
              objectFit: "cover",
            }}
          />
          <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-3 rounded">
            <h5>Liên hệ ngay</h5>
            <p>Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {/* <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev"
      >
        <span
          className="carousel-control-prev-icon bg-primary p-2 rounded"
          aria-hidden="true"
        ></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next"
      >
        <span
          className="carousel-control-next-icon bg-primary p-2 rounded"
          aria-hidden="true"
        ></span>
        <span className="visually-hidden">Next</span>
      </button> */}
    </div>
  );
};

export default Banner;
