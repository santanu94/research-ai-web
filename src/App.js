import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "simplebar-react/dist/simplebar.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { SearchProvider } from "./context/SearchContext";
import Routes from "./Routes";

function App() {
  return (
    <KindeProvider
      clientId={process.env.REACT_APP_KINDE_CLIENT_ID}
      domain={process.env.REACT_APP_KINDE_DOMAIN}
      redirectUri={process.env.REACT_APP_KINDE_REDIRECT_URL}
      logoutUri={process.env.REACT_APP_KINDE_LOGOUT_URL}
      // onRedirectCallback={onRedirectCallback}
    >
      <SearchProvider>
        <Routes />
      </SearchProvider>
    </KindeProvider>
  );
}

export default App;
