import React from "react";
import "./Navbar.css";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

const Navbar = () => {
  const { login, register } = useKindeAuth();

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
            <button className="nav-link" onClick={login}>
              Sign In
            </button>
            <button className="nav-link btn-get-started" onClick={register}>
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
