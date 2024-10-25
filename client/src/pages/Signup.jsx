import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../redux/user/userSlice.js";
import { TextField, Button, Container, Box, Typography, Alert } from "@mui/material";
import axios from "axios";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Perform the signup request
      const signupRes = await axios.post(`${API_URL}/api/auth/signup`, formData);

      if (signupRes?.data?.success) {
        alert(signupRes?.data?.message);

        // Automatically log the user in after successful signup
        dispatch(loginStart());
        const loginRes = await axios.post(`${API_URL}/api/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

        if (loginRes?.data?.success) {
          dispatch(loginSuccess(loginRes?.data?.user));
          navigate("/");  // Redirect to the homepage after successful login
        } else {
          dispatch(loginFailure(loginRes?.data?.message));
          alert(loginRes?.data?.message);
        }
      } else {
        alert(signupRes?.data?.message);
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
      console.error("Error during signup or login", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        height: "110vh",
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
          Signup
        </Typography>
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          value={formData.username}
          required
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          value={formData.email}
          required
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
          required
        />
        <TextField
          id="address"
          label="Address"
          multiline
          rows={2}
          maxRows={2}
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          value={formData.address}
        />
        <TextField
          id="phone"
          label="Phone"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleChange}
          value={formData.phone}
          required
        />
        <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
          <Link to={`/login`} style={{ textDecoration: "none", color: "#1976d2" }}>
            Have an account? Login
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
          {loading ? "Loading..." : "Signup"}
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

export default Signup;
