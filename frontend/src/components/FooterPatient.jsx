import "../assets/css/FooterPatient.css";

const FooterPatient = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-left">
          <div className="footer-logo">
            <h2>HealthEase</h2>
            <p>
              HealthEase is an online healthcare platform that provides
              convenient and efficient healthcare services. Our mission is to
              make healthcare accessible to everyone.
            </p>{" "}
          </div>

          <div className="newsletter">
            <h3>Subscribe Our Newsletter</h3>
            <div className="newsletter-input">
              <input
                type="email"
                placeholder="Enter Your Email Address"
                aria-label="Email address"
              />
              <button>Subscribe</button>
            </div>
          </div>
        </div>

        <div className="footer-right">
          <div className="footer-links">
            <div>
              <h3>Patient Care</h3>
              <ul>
                <li>
                  <a href="/find-doctor">Find a doctor</a>
                </li>
                <li>
                  <a href="/medical-services">Medical Services</a>
                </li>
                <li>
                  <a href="/testimonials">Patient Testimonials</a>
                </li>
              </ul>
            </div>

            <div>
              <h3>Services</h3>
              <ul>
                <li>
                  <a href="/consult-online">Consult Doctor Online</a>
                </li>
                <li>
                  <a href="/book-appointment">Book Physical Appointment</a>
                </li>
              </ul>
            </div>

            <div>
              <h3>Company</h3>
              <ul>
                <li>
                  <a href="/careers">Careers</a>
                </li>
                <li>
                  <a href="/contact">Contact Us</a>
                </li>
                <li>
                  <a href="/about">About Us</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-social">
            <h4>Follow Us:</h4>
            <div className="footer-social-links">
              <a href="/facebook" aria-label="Facebook">
                <i className="fa-brands fa-square-facebook"></i>
              </a>
              <a href="/twitter" aria-label="Twitter">
                <i className="fa-brands fa-square-x-twitter"></i>
              </a>
              <a href="/instagram" aria-label="Instagram">
                <i className="fa-brands fa-square-instagram"></i>
              </a>
              <a href="/youtube" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; Copyright 2024. HealthEase, Inc. All Rights Reserved.</p>
        <div className="footer-bottom-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/disclaimer">Disclaimer</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default FooterPatient;
