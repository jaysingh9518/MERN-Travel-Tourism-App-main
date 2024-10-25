import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";

const MyBookings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const getAllBookings = async () => {
    setCurrentBookings([]);
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/api/booking/get-UserCurrentBookings/${currentUser?._id}?searchTerm=${searchTerm}`
      );
      const data = await res.json();
      if (data?.success) {
        setCurrentBookings(data?.bookings);
        setLoading(false);
        setError(false);
      } else {
        setLoading(false);
        setError(data?.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError("An error occurred while fetching bookings.");
    }
  };

  useEffect(() => {
    getAllBookings();
  }, [searchTerm]);

  const handleCancel = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/api/booking/cancel-booking/${id}/${currentUser._id}`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      setLoading(false);
      if (data?.success) {
        alert(data?.message);
        getAllBookings();
      } else {
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("An error occurred while canceling the booking.");
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 2,
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          variant="outlined"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          sx={{ mb: 2 }}
        />
        {!loading &&
          currentBookings &&
          currentBookings.map((booking) => (
            <Box
              key={booking._id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: 1,
                borderColor: "grey.300",
                padding: 2,
              }}
            >
              <Link to={`/package/${booking?.packageDetails?._id}`}>
                <img
                  src={booking?.packageDetails?.packageImages[0]}
                  alt="Package"
                  style={{ width: 48, height: 48, borderRadius: 4 }}
                />
              </Link>
              <Link to={`/package/${booking?.packageDetails?._id}`}>
                <Typography variant="body1" sx={{ textDecoration: "none", '&:hover': { textDecoration: 'underline' } }}>
                  {booking?.packageDetails?.packageName}
                </Typography>
              </Link>
              <Typography variant="body2">{booking?.buyer?.username}</Typography>
              <Typography variant="body2">{booking?.buyer?.email}</Typography>
              <Typography variant="body2">{booking?.date}</Typography>
              <Button
                onClick={() => handleCancel(booking._id)}
                variant="contained"
                color="error"
                size="small"
              >
                Cancel
              </Button>
            </Box>
          ))}
      </Box>
    </Container>
  );
};

export default MyBookings;
