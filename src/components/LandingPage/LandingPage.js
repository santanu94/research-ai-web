import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./LandingPage.css";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import posthog from "posthog-js";
import { FaXTwitter, FaLinkedinIn } from "react-icons/fa6";
import mixpanel from "mixpanel-browser";
import { getAuthToken, getUserName } from "../../utils/authenticate";
import Navbar from "../Navbar/Navbar";
import MobileWarningModal from "./MobileWarningModal/MobileWarningModal";
import heroImage from "../../assets/images/landing-page-preview.png";
import SearchPreviewImage from "../../assets/images/search-preview.png";
import ChatPreviewImage from "../../assets/images/chat-preview.png";

const LandingPage = () => {
  const [isSmallScreenDevice, setIsSmallScreenDevice] = useState(false);
  const [
    showDeviceIncompatibilityMessage,
    setShowDeviceIncompatibilityMessage,
  ] = useState(false);
  const { register } = useKindeAuth();
  const ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  mixpanel.track_pageview({ page: "Landing Page" });

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreenDevice(window.innerWidth < 768);
    };

    window.addEventListener("resize", checkScreenSize);
    checkScreenSize();

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (getAuthToken() && getUserName()) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  const handleExploreButtonClick = () => {
    mixpanel.track("Clicked Explore Button");
    // mixpanel.track_links("#explore-btn", "Clicked Explore Button");
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGetStarted = () => {
    posthog.capture("get_started_button_clicked", { page: "landing page" });
    mixpanel.track("Clicked Get Started Button");
    // mixpanel.track_links("#get-started-btn", "Clicked Get Started Button");

    if (isSmallScreenDevice) {
      setShowDeviceIncompatibilityMessage(true);
    } else {
      register();
    }
  };

  return (
    <>
      {showDeviceIncompatibilityMessage && (
        <MobileWarningModal
          setDisplayModal={setShowDeviceIncompatibilityMessage}
        />
      )}
      <Navbar />
      <div className="landing-page">
        <div className="d-flex hero-section">
          <div className="headline-section">
            <div className="headline">
              <div className="release">Alpha Release</div>
              <span className="headline-text">
                Making research papers
                <br />
                <span className="highlight">accessible</span> and
                <br />
                <span className="highlight">understandable</span>
              </span>
              <div className="call-to-action-buttons-div">
                <button
                  id="get-started-btn"
                  className="btn btn-primary"
                  onClick={handleGetStarted}
                >
                  Get Started
                </button>
                <button
                  id="explore-btn"
                  type="button"
                  onClick={handleExploreButtonClick}
                  className="btn btn-light btn-explore"
                >
                  Explore
                </button>
              </div>
            </div>
            {/* <p className="landing-subtitle">
              Dive into research with ease and turn complex papers into clear,
              easily graspable insights.
            </p> */}
          </div>
          <div className="image-preview-section">
            <img src={SearchPreviewImage} alt="The Research AI preview" />
          </div>
        </div>

        <div ref={ref} className="features-section">
          <div className="feature">
            <div className="feature-heading">
              Finding Research Papers made Easy
            </div>
            <span className="feature-description">
              Search papers quickly by name or keywords. Simply type in queries
              like 'prompt engineering papers,' 'Longformer paper,' or any topic
              you're curious about.
            </span>
            <div className="feature-preview-holder">
              <img
                src={SearchPreviewImage}
                alt="The Research AI paper search interface"
              />
            </div>
          </div>
          <div className="feature">
            <div className="feature-heading">Simplify with Questions</div>
            <span className="feature-description">
              Get information just by asking. Ask for the training methodology,
              results, or the datasets used in the paper. Or simply ask to
              summarize the paper.
              <br />
              Effortlessly explore new papers or pull key details from familiar
              studies, simply by asking questions.
            </span>
            <div className="feature-preview-holder">
              <img
                src={ChatPreviewImage}
                alt="The Research AI paper qna interface"
              />
            </div>
          </div>
        </div>

        <div className="footer">
          <div className="d-flex flex-row divider-icon-pair">
            <div className="d-flex flex-row align-self-center ml-auto divider" />
            <div className="align-self-center icons">
              <Link className="link-dark" to="https://x.com/the_research_ai">
                <FaXTwitter className="icon" />
              </Link>
              <FaLinkedinIn className="icon" />
            </div>
            <div className="align-self-center mr-auto divider" />
          </div>
          <div className="d-flex flex-row justify-content-center tnc-section">
            <Link
              className="mx-3 text-decoration-none text-dark footer-link"
              to="/terms-of-usage"
            >
              Terms of Usage
            </Link>{" "}
            |{" "}
            <Link
              className="mx-3 text-decoration-none text-dark footer-link"
              to="/privacy-policy"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
