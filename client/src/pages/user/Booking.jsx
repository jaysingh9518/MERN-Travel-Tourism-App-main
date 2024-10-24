import React, { useEffect, useState } from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const Booking = () => {
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "",
    packageMeals: "",
    packageActivities: "",
    packagePrice: 500,
    packageDiscountPrice: 0,
    packageOffer: false,
    packageRating: 0,
    packageTotalRatings: 0,
    packageImages: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [bookingData, setBookingData] = useState({
    totalPrice: 0,
    packageDetails: null,
    buyer: null,
    persons: 1,
    date: null,
  });
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const getPackageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/package/get-package-data/${params?.packageId}`
      );
      const data = await res.json();
      if (data?.success) {
        setPackageData(data?.packageData);
      } else {
        setError(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getToken = async () => {
    try {
      const { data } = await axios.get(`/api/package/braintree/token`);
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [currentUser]);

  const handleBookPackage = async () => {
    if (
      !bookingData.packageDetails ||
      !bookingData.buyer ||
      bookingData.totalPrice <= 0 ||
      bookingData.persons <= 0 ||
      !bookingData.date
    ) {
      alert("All fields are required!");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/booking/book-package/${params?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (data?.success) {
        alert(data?.message);
        navigate(`/profile/${currentUser?.user_role === 1 ? "admin" : "user"}`);
      } else {
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.packageId) {
      getPackageData();
    }
    const date = new Date().toISOString().substring(0, 10);
    const nextDate = date.substring(0, 8) + (parseInt(date.substring(8)) + 1);
    setCurrentDate(nextDate);
  }, [params?.packageId]);

  useEffect(() => {
    if (packageData && params?.packageId) {
      setBookingData((prev) => ({
        ...prev,
        packageDetails: params?.packageId,
        buyer: currentUser?._id,
        totalPrice: packageData?.packageDiscountPrice
          ? packageData?.packageDiscountPrice * prev.persons
          : packageData?.packagePrice * prev.persons,
      }));
    }
  }, [packageData, params, currentUser]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Book Package
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={3}
        >
          {/* User Info */}
          <Box flexBasis="45%" sx={{ borderRight: "1px solid #ccc", pr: 2 }}>
            <Typography variant="h6" gutterBottom>
              User Info
            </Typography>
            <Box>
              {[
                { label: "Username", value: currentUser.username },
                { label: "Email", value: currentUser.email },
                {
                  label: "Address",
                  value: currentUser.address,
                  multiline: true,
                },
                { label: "Phone", value: currentUser.phone },
              ].map((field) => (
                <Box key={field.label} mb={2}>
                  <Typography variant="body1" fontWeight="bold">
                    {field.label}:
                  </Typography>
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={field.value}
                    disabled
                    multiline={field.multiline}
                    maxRows={field.multiline ? 4 : 1}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Package Info */}
          <Box flexBasis="52%">
            <Typography variant="h6" gutterBottom>
              Package Info
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
              <img
                src={packageData.packageImages[0]}
                alt="Package"
                style={{
                  borderRadius: "8px",
                  boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
                  width: "100%",
                  maxWidth: "250px",
                  objectFit: "cover",
                }}
              />
              <Box flexGrow={1}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {packageData.packageName}
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <FaMapMarkerAlt style={{ marginRight: "8px" }} />
                  <Typography variant="body1" color="green" fontWeight="bold">
                    {packageData.packageDestination}
                  </Typography>
                </Box>

                {(+packageData.packageDays > 0 ||
                  +packageData.packageNights > 0) && (
                  <Box display="flex" alignItems="center">
                    <FaClock style={{ marginRight: "8px" }} />
                    <Typography variant="body1">
                      {+packageData.packageDays > 0 &&
                        `${packageData.packageDays} Day${
                          packageData.packageDays > 1 ? "s" : ""
                        }`}
                      {+packageData.packageDays > 0 &&
                        +packageData.packageNights > 0 &&
                        " - "}
                      {+packageData.packageNights > 0 &&
                        `${packageData.packageNights} Night${
                          packageData.packageNights > 1 ? "s" : ""
                        }`}
                    </Typography>
                  </Box>
                )}
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <TextField
                    type="date"
                    id="date"
                    label="Select Date" // Use the label prop instead
                    onChange={(e) =>
                      setBookingData({ ...bookingData, date: e.target.value })
                    }
                    value={bookingData.date}
                    InputLabelProps={{ shrink: true }} // You can keep this if you want to control the label behavior
                    sx={{ mb: 2 }}
                  />
                </FormControl>

                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="h6" gutterBottom sx={{ marginRight: 2 }}>
                    Price:
                  </Typography>
                  <Typography
                    variant="body1"
                    color={packageData.packageOffer ? "error" : "green"}
                    fontWeight="bold"
                  >
                    {packageData.packageOffer ? (
                      <>
                        <span
                          style={{
                            textDecoration: "line-through",
                            marginRight: "8px",
                          }}
                        >
                          ${packageData.packagePrice}
                        </span>
                        <span>${packageData.packageDiscountPrice}</span>
                        <span style={{ marginLeft: "8px", color: "green" }}>
                          {Math.floor(
                            ((+packageData.packagePrice -
                              +packageData.packageDiscountPrice) /
                              +packageData.packagePrice) *
                              100
                          )}
                          % Off
                        </span>
                      </>
                    ) : (
                      `$${packageData.packagePrice}`
                    )}
                  </Typography>
                </Box>

                {/* Persons Input */}
                <Box display="flex" alignItems="center" my={2}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (bookingData.persons > 1) {
                        setBookingData((prev) => ({
                          ...prev,
                          persons: prev.persons - 1,
                          totalPrice: packageData.packageDiscountPrice
                            ? packageData.packageDiscountPrice *
                              (prev.persons - 1)
                            : packageData.packagePrice * (prev.persons - 1),
                        }));
                      }
                    }}
                    sx={{
                      minWidth: "40px",
                      borderRadius: "4px",
                      padding: "8px",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    -
                  </Button>
                  <TextField
                    type="text"
                    value={bookingData.persons}
                    disabled
                    sx={{
                      mx: 2,
                      width: 50,
                      textAlign: "center",
                      "& .MuiInputBase-input": {
                        textAlign: "center",
                      },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "4px",
                      },
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (bookingData.persons < 10) {
                        setBookingData((prev) => ({
                          ...prev,
                          persons: prev.persons + 1,
                          totalPrice: packageData.packageDiscountPrice
                            ? packageData.packageDiscountPrice *
                              (prev.persons + 1)
                            : packageData.packagePrice * (prev.persons + 1),
                        }));
                      }
                    }}
                    sx={{
                      minWidth: "40px",
                      borderRadius: "4px",
                      padding: "8px",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    +
                  </Button>
                </Box>
                <Box display="flex" alignItems="center" my={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Total Price:{" "}
                    <span style={{ color: "green" }}>
                      ${bookingData.totalPrice}
                    </span>
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box my={2}>
              <Typography variant="body1" fontWeight="bold">
                Payment:
                {!instance
                  ? " Loading..."
                  : " Don't use your original card details! (This is not the production build)"}
              </Typography>
              {clientToken && (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBookPackage}
                    disabled={loading || !instance || !currentUser?.address}
                    sx={{ mt: 2, color: "white" }}
                  >
                    {loading ? "Processing..." : "Book Now"}
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Booking;
