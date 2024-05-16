import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import Dashboard from "./components/Dashboard/Dashboard";
import PaperQnA from "./components/PaperQnA/PaperQnA";
import TermsOfUsage from "./components/TermsOfUsage/TermsOfUsage";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { auth_db, auth_token } from "./utils/authenticate";
// import { is_token_generated, is_token_valid } from "./utils/authenticate";
import posthog from "posthog-js";

const styles = {
  loadingScreen: {
    paddingTop: "10%",
  },

  spinnerDimension: {
    height: "1.5rem",
    width: "1.5rem",
  },

  loadingTextHeadline: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginTop: "25px",
    marginBottom: "10px",
  },
};

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useKindeAuth();
  const token = localStorage.getItem("userToken");
  // let token = localStorage.getItem("userToken");
  // const cachedUserData = JSON.parse(localStorage.getItem("userData"));
  const [userAuthenticated, setUserAuthenticated] = useState(null);
  let location = useLocation();

  // const cache_user = async () => {
  //   token = await is_token_generated(user);
  //   if (token) {
  //     localStorage.setItem("userToken", token);
  //     localStorage.setItem("userData", user);
  //     setUserAuthenticated(true);
  //   } else {
  //     localStorage.removeItem("userToken");
  //     localStorage.removeItem("userData");
  //     setUserAuthenticated(false);
  //   }
  // };

  // const clear_cache = async () => {
  //   localStorage.removeItem("userToken");
  //   localStorage.removeItem("userData");
  //   setUserAuthenticated(false);
  // };

  // useEffect(() => {
  //   const verifyUser = async () => {
  //     if (!isLoading) {
  //       console.log(isLoading);
  //       console.log(cachedUserData);
  //       if (user) {
  //         console.log(user, "-----------");
  //         console.log("1");
  //         await cache_user();
  //       } else if (token && cachedUserData && is_token_valid(token)) {
  //         console.log("2");
  //         setUserAuthenticated(true);
  //       } else {
  //         console.log("3");
  //         await clear_cache();
  //       }
  //     }
  //   };
  //   verifyUser();
  // }, [isLoading]);

  useEffect(() => {
    const verifyUser = async () => {
      if (!isLoading) {
        if (!user) {
          console.log("1");
          setUserAuthenticated(false);
          return;
        }
        if (!token) {
          console.log("2");
          const authSuccess = await auth_db(user);
          if (authSuccess) {
            console.log("3");
            // Reload the token from localStorage after it's potentially updated by auth_db
            const updatedToken = localStorage.getItem("userToken");
            if (updatedToken && auth_token(updatedToken)) {
              console.log("4");
              setUserAuthenticated(true);
              return;
            }
          }
          console.log("5");
          setUserAuthenticated(false);
          return;
        }

        if (auth_token(token)) {
          console.log("6");
          setUserAuthenticated(true);
        } else {
          console.log("7");
          localStorage.removeItem("userToken");
          setUserAuthenticated(false);
        }
      }
    };
    verifyUser();
  }, [token, user, isLoading]);

  if (userAuthenticated === null || isLoading) {
    return (
      <div
        className="d-flex align-items-center flex-column vh-100"
        style={styles.loadingScreen}
      >
        <div
          className="spinner spinner-grow"
          style={styles.spinnerDimension}
          role="status"
        ></div>
        <div style={styles.loadingTextHeadline}>
          Loading Profile, please wait...
        </div>
        <div>
          (If you do not get automatically redirected, please Refresh the page
          and try again)
        </div>
      </div>
    );
  }

  return userAuthenticated ? children : <Navigate to="/" />;
};

const RoutesComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/paper/:id"
          element={
            <PrivateRoute>
              <PaperQnA />
            </PrivateRoute>
          }
        />
        <Route path="/terms-of-usage" element={<TermsOfUsage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
};

export default RoutesComponent;
