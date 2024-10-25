import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user); // Retrieve the current user from Redux store
  const [ok, setOk] = useState(false); // State to check if the user is authenticated
  const API_URL = import.meta.env.VITE_API_URL; // Environment variable for API URL

  // Function to check if the current user is authenticated
  const authCheck = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/user-auth`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials if cookies are used for authentication
      });

      if (!res.ok) throw new Error("Failed to authenticate");

      const data = await res.json();
      setOk(data.check ? true : false); // Update the state based on the response
    } catch (error) {
      console.error("Error during authentication:", error);
      setOk(false);
    }
  };

  useEffect(() => {
    if (currentUser !== null) {
      authCheck(); // Trigger auth check only if the user exists
    }
  }, [currentUser]);

  // Redirect to login if no current user, otherwise display Spinner during auth check
  if (currentUser === null) {
    return <Navigate to="/login" />; // Redirect unauthenticated users to the login page
  }

  return ok ? <Outlet /> : <Spinner />; // Render the appropriate component based on auth status
}
