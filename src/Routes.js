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
import {
  auth_db,
  auth_token,
  getAuthToken,
  setUserName,
  clearCache,
} from "./utils/authenticate";
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
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verifyAuthentication = async () => {
      if (isLoading) return;

      const token = getAuthToken();
      if (user) {
        const authSuccess = await auth_db(user);
        if (authSuccess) {
          setUserName(user.given_name);
          setUserIsAuthenticated(true);
          return;
        }
      } else if (token && auth_token(token)) {
        setUserIsAuthenticated(true);
        return;
      }

      clearCache();
      setUserIsAuthenticated(false);
    };

    verifyAuthentication();
  }, [user, isLoading]);

  if (userIsAuthenticated === null || isLoading) {
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

  return userIsAuthenticated ? (
    children
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

const AppRoutes = () => {
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
