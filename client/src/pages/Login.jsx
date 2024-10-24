import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginStart, loginSuccess, loginFailure } from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button, Container, Box, Typography, Alert } from "@mui/material";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Extract the redirect path from query parameters
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        dispatch(loginSuccess(data?.user));
        alert(data?.message);
        navigate(redirect);  // Redirect to the intended page or home
      } else {
        dispatch(loginFailure(data?.message || "Login failed"));
        alert(data?.message || "Login failed");
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        height: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          value={formData.email}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          value={formData.password}
        />
        <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
          <Link to={`/signup`} style={{ textDecoration: "none", color: "#1976d2" }}>
            Don’t have an account? Signup
          </Link>
        </Typography>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, mb: 2, color: "white" }}
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </Button>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default Login;
