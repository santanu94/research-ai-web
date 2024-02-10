import React from "react";
import "./LandingPage.css";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import Navbar from "../Navbar/Navbar";

const LandingPage = () => {
  const { register } = useKindeAuth();

  return (
    <>
      <Navbar />
      <div className="landing-page">
        <div className="release">Alpha Release</div>
        <h1 className="landing-title">
          Revolutionize
          <br />
          Your Research Experience
          <br />
          with AI
        </h1>
        <p className="landing-subtitle">
          Dive into research with ease and turn complex papers into clear,
          easily graspable insights.
        </p>
        <button className="btn btn-primary" onClick={register}>
          Get Started
        </button>
        <div className="credit">
          Photo by{" "}
          <a href="https://unsplash.com/@anniespratt?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
            Annie Spratt
          </a>{" "}
          on{" "}
          <a href="https://unsplash.com/photos/white-printer-paper-lot-5cFwQ-WMcJU?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
            Unsplash
          </a>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
