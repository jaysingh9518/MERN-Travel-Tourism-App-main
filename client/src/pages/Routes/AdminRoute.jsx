import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function AdminRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const [ok, setOk] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const authCheck = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/admin-auth`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      setOk(data.check ? true : false);
    } catch (error) {
      console.error("Error during admin auth check:", error);
      setOk(false);
    }
  };

  useEffect(() => {
    if (currentUser !== null) {
      authCheck();
    }
  }, [currentUser]);

  if (currentUser === null) {
    return <Navigate to="/login" />;
  }

  return ok ? <Outlet /> : <Spinner />;
}
