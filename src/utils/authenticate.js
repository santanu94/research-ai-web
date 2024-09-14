import { jwtDecode } from "jwt-decode";

export const auth_db = async (user) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_USER_API}/api/v1/user/authenticate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.id, email: user.email }),
      }
    );

    if (response.ok) {
      const { token, userName } = await response.json();
      setAuthToken(token);
      setUserName(userName);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error in auth_db:", error);
    return false;
  }
};

export const auth_token = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

export const setAuthToken = (token) => {
  localStorage.setItem("userToken", token);
};

export const setUserName = (name) => {
  localStorage.setItem("userName", name);
};

export const getAuthToken = () => {
  return localStorage.getItem("userToken");
};

export const getUserName = () => {
  return localStorage.getItem("userName");
};

export const clearCache = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userName");
  // Clear any other relevant cache items
};
