import React from "react";
import "./UserControlPanel.css";
import { MdDashboard } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { FaUserCircle, FaCog } from "react-icons/fa";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import mixpanel from "mixpanel-browser";

const UserControlPanel = () => {
  const { logout } = useKindeAuth();

  const handleLogout = () => {
    mixpanel.track("Clicked Logout Button");
    logout();
    mixpanel.reset();
  };

  return (
    <div className="user-control-panel d-flex flex-column align-items-center">
      <NavLink
        to="/dashboard"
        className="icon-container"
        activeClassName="active"
      >
        <MdDashboard className="icon" />
      </NavLink>
      {/* <FaCog className="icon" /> */}
      <div className="user-icon-container">
        <div className="dropup w-100 h-100">
          <div
            type="button"
            className="d-flex align-items-center justify-content-center h-100"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <FaUser className="user-icon" />
          </div>
          <ul className="dropdown-menu">
            <li>
              <button className="dropdown-item logout" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserControlPanel;
