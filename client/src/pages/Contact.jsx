import React, { useState } from "react";
import { Container, Typography, Box, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Phone, Email, Place } from "@mui/icons-material";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(""); // State to hold success messages
  const [error, setError] = useState(""); // State to hold error messages
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    setSuccessMessage(""); // Reset success message

    try {
      // Ensure the API URL is correct and the backend is running
      const response = await axios.post(`${API_URL}/api/contact/create`, formData);
      if (response.status === 201) {
        setSuccessMessage("Your message has been sent successfully!"); // Set success message
        setFormData({ // Reset form data
          name: "",
          email: "",
          mobile: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("There was an error sending the message:", error);
      setError("There was an error sending your message. Please try again."); // Set error message
    }
  };

  const handleBackToHome = () => {
    navigate("/"); // Navigate back to the home page
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary">
          We'd love to hear from you!
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          gap: 4,
        }}
      >
        <Box
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 2,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Get in Touch
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Your Name"
              variant="outlined"
              margin="normal"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Your Email"
              variant="outlined"
              margin="normal"
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Your Mobile Number"
              variant="outlined"
              margin="normal"
              required
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Subject"
              variant="outlined"
              margin="normal"
              required
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Message"
              variant="outlined"
              margin="normal"
              required
              multiline
              rows={4}
              name="message"
              value={formData.message}
              onChange={handleChange}
            />

            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            {successMessage && (
              <Typography color="success.main" variant="body2" sx={{ mb: 2 }}>
                {successMessage}
              </Typography>
            )}
            <Button variant="contained" color="primary" type="submit" sx={{ color: "white" }}>
              Send Message
            </Button>
          </form>
        </Box>

        <Box
          sx={{
            flex: 1,
            p: 4,
            borderRadius: 2,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            boxShadow: 4,
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
            Our Contact Information
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Email sx={{ mr: 1, fontSize: 30, color: "primary.main" }} />
            <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
              info@heavenofholiday.com
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Phone sx={{ mr: 1, fontSize: 30, color: "primary.main" }} />
            <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
              +91-7452849199
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Place sx={{ mr: 1, fontSize: 30, color: "primary.main" }} />
            <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
              HIG-160, 100 Feet Rd, Nehru Enclave Yojna,<br />
              Near Sharwood Public School, Indrapuram Crossing, Agra, Uttar Pradesh 282001
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBackToHome}
            sx={{ mt: 2, px: 4, color: "white" }}
          >
            Back to Home
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom align="center">
          Find Us Here
        </Typography>
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3550.3024063972903!2d78.0422746749032!3d27.146773949993694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397471a8e17cd73b%3A0xfd7f466a2a0dbd98!2sHeaven%20of%20Holiday!5e0!3m2!1sen!2sin!4v1729612022239!5m2!1sen!2sin"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </Box>
    </Container>
  );
};

export default Contact;
