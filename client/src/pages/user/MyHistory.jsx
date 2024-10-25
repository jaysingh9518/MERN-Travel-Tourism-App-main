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

const MyHistory = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const getAllBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/api/booking/get-allUserBookings/${currentUser?._id}?searchTerm=${search}`
      );
      const data = await res.json();
      if (data?.success) {
        setAllBookings(data?.bookings);
      } else {
        setError(data?.message);
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred while fetching bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, [search]);

  const handleHistoryDelete = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/api/booking/delete-booking-history/${id}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data?.success) {
        alert(data?.message);
        getAllBookings();
      } else {
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred while deleting the booking.");
    } finally {
      setLoading(false);
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
        <Typography variant="h4" align="center">
          History
        </Typography>
        {loading && <CircularProgress />}
        {error && <Typography color="error" align="center">{error}</Typography>}
        
        <TextField
          variant="outlined"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        {!loading &&
          allBookings &&
          allBookings.map((booking) => (
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
              {(new Date(booking?.date).getTime() < new Date().getTime() ||
                booking?.status === "Cancelled") && (
                <Button
                  onClick={() => handleHistoryDelete(booking._id)}
                  variant="contained"
                  color="error"
                  size="small"
                >
                  Delete
                </Button>
              )}
            </Box>
          ))}
      </Box>
    </Container>
  );
};

export default MyHistory;
