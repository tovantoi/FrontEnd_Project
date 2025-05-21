import React from "react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          {/* Thông tin công ty */}
          <div className="col-md-4">
            <h5 className="fw-bold">SHOP VANTOI</h5>
            <p>
              CÔNG TY CỔ PHẦN THỜI TRANG KOWIL VIỆT NAM
              <br />
              Hotline: 1900 8079
              <br />
              8:30 - 19:00 tất cả các ngày trong tuần.
            </p>
            <p>
              <b>VP Phía Bắc:</b> Tầng 17 tòa nhà Viwaseen, 48 Phố Tố Hữu, Trung
              Văn, Nam Từ Liêm, Hà Nội.
            </p>
            <p>
              <b>VP Phía Nam:</b> 186A Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu,
              Quận 3, TP.HCM.
            </p>
          </div>

          {/* Giới thiệu */}
          <div className="col-md-2">
            <h5 className="fw-bold">GIỚI THIỆU VANTOI</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/about" className="text-white text-decoration-none">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="/blogpage" className="text-white text-decoration-none">
                  Blog
                </a>
              </li>
              <li>
                <a href="/stores" className="text-white text-decoration-none">
                  Hệ thống cửa hàng
                </a>
              </li>
              <li>
                <a href="/contact" className="text-white text-decoration-none">
                  Liên hệ với VANTOI
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="text-white text-decoration-none"
                >
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div className="col-md-3">
            <h5 className="fw-bold">HỖ TRỢ KHÁCH HÀNG</h5>
            <ul className="list-unstyled">
              <li>
                <a href="faq" className="text-white text-decoration-none">
                  Hỏi đáp
                </a>
              </li>
              <li>
                <a
                  href="shipping-policy"
                  className="text-white text-decoration-none"
                >
                  Chính sách vận chuyển
                </a>
              </li>
              <li>
                <a
                  href="/size-guide"
                  className="text-white text-decoration-none"
                >
                  Hướng dẫn chọn kích cỡ
                </a>
              </li>
              <li>
                <a
                  href="/payment-guide"
                  className="text-white text-decoration-none"
                >
                  Hướng dẫn thanh toán
                </a>
              </li>
              <li>
                <a
                  href="/exchange-policy"
                  className="text-white text-decoration-none"
                >
                  Quy định đổi hàng
                </a>
              </li>
              <li>
                <a
                  href="/purchase-guide"
                  className="text-white text-decoration-none"
                >
                  Hướng dẫn mua hàng
                </a>
              </li>
            </ul>
          </div>

          {/* Kết nối */}
          <div className="col-md-3">
            <h5 className="fw-bold">KẾT NỐI</h5>
            <div className="d-flex mb-3">
              <a
                href="https://www.facebook.com/tovantoi2003/"
                className="text-white me-3"
              >
                <img src="/assets/facebook.png" width="40" alt="Facebook" />
              </a>
              <a
                href="https://www.instagram.com/owen_fashion/"
                className="text-white me-3"
              >
                <img src="/assets/instagram.png" width="40" alt="Instagram" />
              </a>
              <a
                href="https://www.youtube.com/c/OwenFashionVN/featured"
                className="text-white"
              >
                <img src="/assets/social-media.png" width="40" alt="TikTok" />
              </a>
            </div>
            <h6 className="fw-bold">PHƯƠNG THỨC THANH TOÁN</h6>
            <div className="d-flex align-items-center">
              <img
                src="/assets/visa.png"
                alt="Visa"
                className="me-2"
                style={{ height: "30px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
