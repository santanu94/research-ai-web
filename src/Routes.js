import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import Dashboard from "./components/Dashboard/Dashboard";
import PaperQnA from "./components/PaperQnA/PaperQnA";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { auth_db, auth_token } from "./utils/authenticate";

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useKindeAuth();
  const token = localStorage.getItem("userToken");
  const [userAuthenticated, setUserAuthenticated] = useState(null);

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
    return <div>Loading...</div>;
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
      </Routes>
    </Router>
  );
};

export default RoutesComponent;
