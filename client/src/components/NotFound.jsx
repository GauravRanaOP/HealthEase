import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../assets/css/NotFound.css";
import uploadedImage from "../assets/images/Rounded.svg";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="not-found-page">
      <Helmet>
        <title>404 - Page Not Found | HealthEase</title>
        <meta
          name="description"
          content="The page you are looking for does not exist. Navigate back to the HealthEase homepage to explore."
        />
        <meta
          name="keywords"
          content="404, not found, HealthEase, error page, healthcare"
        />
        <meta name="author" content="HealthEase Team" />
        <link rel="canonical" href="http://localhost:3002/404" />
      </Helmet>

      <div className="not-found-container">
        <div className="error-image-container">
          <img
            src={uploadedImage}
            alt="404 Not Found"
            className="error-image"
          />
        </div>
        <h1 className="not-found-title">Oops! We couldn’t find that page.</h1>
        <p className="not-found-message">
          It seems like the page you&apos;re looking for doesn&apos;t exist, or
          maybe it has been moved. Let us help you find your way back.
        </p>
        <button className="back-home-btn" onClick={handleGoBack}>
          <FontAwesomeIcon icon={faArrowLeft} className="arrow-icon" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;