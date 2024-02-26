import React from "react";
import "./Navbar.css";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import posthog from "posthog-js";

const Navbar = () => {
  const { login, register } = useKindeAuth();

  const handleGetStarted = () => {
    posthog.capture("get_started_button_clicked", { page: "navbar" });
    register();
  };

  const handleSignIn = () => {
    posthog.capture("sign_in_button_clicked", { page: "navbar" });
    login();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="/">
          The Research AI
        </a>
        <div
          className="collapse navbar-collapse flex-grow-0"
          id="navbarNavAltMarkup"
        >
          <div className="navbar-nav ml-auto">
            <button className="nav-link" onClick={handleSignIn}>
              Sign In
            </button>
            <button
              className="nav-link btn-get-started"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
