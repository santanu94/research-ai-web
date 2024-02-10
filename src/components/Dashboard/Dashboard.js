import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
// import { useNavigate } from "react-router-dom";
import UserControlPanel from "../UserControlPanel/UserControlPanel";
import SearchBar from "./SearchBar/SearchBar";
import SearchResults from "./SearchResults/SearchResults";

const Dashboard = () => {
  const { user, isLoading } = useKindeAuth();
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setShowSearchResults(true);
    }
  }, [searchResults]);

  const getGreetingBasedOnTime = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };
  const greeting = getGreetingBasedOnTime();

  if (isLoading) {
    return (
      <div className="d-flex align-items-center flex-column vh-100 loading-screen">
        <div
          className="spinner spinner-grow spinner-dimension"
          role="status"
        ></div>
        <div className="loading-text-headline">
          Loading Profile, please wait...
        </div>
        <div>
          (If you do not get automatically redirected, please Refresh the page
          and try again)
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard d-flex flex-row">
      <UserControlPanel />
      <div className="dashboard-main-container d-flex flex-row flex-grow-1">
        {/* <div className="dashboard-main-container"> */}
        <div className="left-section d-flex flex-column flex-grow-1">
          <span className="greeter">
            {greeting}, {user.given_name}
          </span>
          <SearchBar
            setSearchResults={setSearchResults}
            additionalClassName={showSearchResults ? "raised" : ""}
          />
        </div>
        <div className="right-section d-flex flex-grow-1"></div>
        {showSearchResults && (
          <SearchResults
            results={searchResults}
            onClose={() => setShowSearchResults(false)}
            additionalClassName="active"
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
