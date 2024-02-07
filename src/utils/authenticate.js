import { jwtDecode } from "jwt-decode";

export async function auth_db(user) {
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

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("userToken", data.token);
      console.log("User check successful:", data);
      return true;
    } else {
      throw new Error(data.error || "Error checking user");
    }
  } catch (error) {
    console.error("Error:", error);
    localStorage.removeItem("userToken");
    return false;
  }
}

export function auth_token(token) {
  try {
    const decodedToken = jwtDecode(token);
    const currentTimestamp = Date.now() / 1000;
    if (decodedToken.exp < currentTimestamp) {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
}
