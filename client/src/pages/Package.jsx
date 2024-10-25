import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
// import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaClock,
  FaMapMarkerAlt,
  FaShare,
} from "react-icons/fa";
import Rating from "@mui/material/Rating";
import {
  Container,
  CircularProgress,
  Link,
  Box,
  Button,
  IconButton,
  Typography,
  Divider,
  TextField,
} from "@mui/material";
import { useSelector } from "react-redux";
import RatingCard from "./RatingCard";

const Package = () => {
  SwiperCore.use([Navigation]);
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
  const [copied, setCopied] = useState(false);
  const [ratingsData, setRatingsData] = useState({
    rating: 0,
    review: "",
    packageId: params?.id,
    userRef: currentUser?._id,
    username: currentUser?.username,
    userProfileImg: currentUser?.avatar,
  });
  const [packageRatings, setPackageRatings] = useState([]);
  const [ratingGiven, setRatingGiven] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const getPackageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/package/get-package-data/${params?.id}`);
      const data = await res.json();
      if (data?.success) {
        setPackageData({
          packageName: data?.packageData?.packageName,
          packageDescription: data?.packageData?.packageDescription,
          packageDestination: data?.packageData?.packageDestination,
          packageDays: data?.packageData?.packageDays,
          packageNights: data?.packageData?.packageNights,
          packageAccommodation: data?.packageData?.packageAccommodation,
          packageTransportation: data?.packageData?.packageTransportation,
          packageMeals: data?.packageData?.packageMeals,
          packageActivities: data?.packageData?.packageActivities,
          packagePrice: data?.packageData?.packagePrice,
          packageDiscountPrice: data?.packageData?.packageDiscountPrice,
          packageOffer: data?.packageData?.packageOffer,
          packageRating: data?.packageData?.packageRating,
          packageTotalRatings: data?.packageData?.packageTotalRatings,
          packageImages: data?.packageData?.packageImages,
        });
        setLoading(false);
      } else {
        setError(data?.message || "Something went wrong!");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const giveRating = async () => {
    checkRatingGiven();
    if (ratingGiven) {
      alert("You already submitted your rating!");
      return;
    }
    if (ratingsData.rating === 0 && ratingsData.review === "") {
      alert("At least 1 field is required!");
      return;
    }
    if (
      ratingsData.rating === 0 &&
      ratingsData.review === "" &&
      !ratingsData.userRef
    ) {
      alert("All fields are required!");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/rating/give-rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingsData),
      });
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        alert(data?.message);
        getPackageData();
        getRatings();
        checkRatingGiven();
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRatings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rating/get-ratings/${params.id}/4`);
      const data = await res.json();
      if (data) {
        setPackageRatings(data);
      } else {
        setPackageRatings("No ratings yet!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkRatingGiven = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/rating/rating-given/${currentUser?._id}/${params?.id}`
      );
      const data = await res.json();
      setRatingGiven(data?.given);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.id) {
      getPackageData();
      getRatings();
    }
    if (currentUser) {
      checkRatingGiven();
    }
  }, [params.id, currentUser]);

  const currentPath = window.location.pathname;

  return (
    <Container maxWidth="lg">
      {/* Floating Buttons */}
      {/* // Back button */}
      <div className="fixed bottom-5 left-5 z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-white shadow-lg cursor-pointer hover:bg-gray-100 transition">
        <FaArrowLeft
          className="text-slate-500"
          onClick={() => navigate("/packages")}
        />
      </div>
      {/* // Copy button */}
      <div className="fixed bottom-5 right-5 z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-white shadow-lg cursor-pointer hover:bg-gray-100 transition">
        <FaShare
          className="text-slate-500"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        />
      </div>
      {/* // "Link copied" message */}
      {copied && (
        <p className="fixed bottom-16 right-5 z-10 rounded-md bg-slate-200 text-slate-600 p-2 shadow-lg">
          Link copied!
        </p>
      )}
      {/* Floating Buttons */}
      <div className="w-full flex flex-col sm:flex-row m-4 bg-gray-50">
        <Box className="flex-1 relative">
          {loading && (
            <Typography variant="h6" align="center" id="loading">
              Loading...
            </Typography>
          )}
          {error && (
            <Box className="flex flex-col w-full items-center gap-4 p-5">
              <Typography variant="body1" color="error" align="center">
                Something went wrong!
              </Typography>
              <Link
                component={RouterLink}
                to="/"
                variant="contained"
                color="primary"
                sx={{ padding: 1 }}
              >
                Back
              </Link>
            </Box>
          )}

          {packageData && !loading && !error && (
            <>
              <Box className="flex flex-col w-full items-center gap-4 p-5">
                {packageData?.packageImages.length > 1 && (
                  <>
                    <IconButton
                      className="swiper-button-prev"
                      sx={{
                        position: "absolute",
                        color: "white",
                        top: "25%",
                        textAlign: "center",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        backgroundColor: "primary.light", // Light primary background
                        boxShadow: 2,
                        padding: "30px", // Smaller button
                        "& svg": { fontSize: "0.5rem" }, // Smaller icon
                        "&:hover": {
                          backgroundColor: "primary.main", // Darker primary on hover
                        },
                      }}
                    >
                      <ArrowBackIosIcon />
                    </IconButton>

                    <IconButton
                      className="swiper-button-next"
                      sx={{
                        position: "absolute",
                        color: "white",
                        top: "25%",
                        textAlign: "center",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        backgroundColor: "primary.light", // Light primary background
                        boxShadow: 2,
                        padding: "30px", // Smaller button
                        "& svg": { fontSize: "0.5rem" }, // Smaller icon
                        "&:hover": {
                          backgroundColor: "primary.main", // Darker primary on hover
                        },
                      }}
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </>
                )}

                <Swiper
                  navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                  }}
                  className="max-w-[600px] mx-auto"
                >
                  {packageData?.packageImages.map((imageUrl, i) => (
                    <SwiperSlide key={i}>
                      <Box className="h-[400px] flex justify-center items-center">
                        <img
                          src={imageUrl}
                          alt={`Slide ${i}`}
                          style={{
                            height: "100%",
                            borderRadius: "15px",
                            objectFit: "cover",
                            maxHeight: "400px",
                          }}
                        />
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>

              <Box className="w-full flex flex-col p-5 gap-3">
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  {packageData?.packageName}
                </Typography>

                {/* Price */}
                <Typography variant="h5" className="flex gap-1 my-3">
                  {packageData?.packageOffer ? (
                    <>
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "gray",
                        }}
                      >
                        ${packageData?.packagePrice}
                      </span>{" "}
                      -<span>${packageData?.packageDiscountPrice}</span>
                      <span
                        className="text-lg ml-2"
                        style={{
                          backgroundColor: "green",
                          padding: "0.5rem",
                          borderRadius: "5px",
                          color: "white",
                        }}
                      >
                        {Math.floor(
                          ((+packageData?.packagePrice -
                            +packageData?.packageDiscountPrice) /
                            +packageData?.packagePrice) *
                            100
                        )}
                        % Off
                      </span>
                    </>
                  ) : (
                    <span>${packageData?.packagePrice}</span>
                  )}
                </Typography>

                {/* Destination */}
                <Typography
                  variant="body1"
                  color="green"
                  className="flex items-center gap-1"
                >
                  <FaMapMarkerAlt />
                  {packageData?.packageDestination}
                </Typography>

                {/* Days & Nights */}
                {(+packageData?.packageDays > 0 ||
                  +packageData?.packageNights > 0) && (
                  <Typography
                    variant="body1"
                    className="flex items-center gap-2"
                  >
                    <FaClock />
                    {+packageData?.packageDays > 0 &&
                      (+packageData?.packageDays > 1
                        ? `${packageData?.packageDays} Days`
                        : "1 Day")}
                    {+packageData?.packageNights > 0 &&
                      (+packageData?.packageNights > 1
                        ? `, ${packageData?.packageNights} Nights`
                        : ", 1 Night")}
                  </Typography>
                )}

                {/* Rating */}
                <Box className="flex items-center gap-2">
                  <Typography variant="body1" fontWeight="bold">
                    {packageData?.packageRating
                      ? packageData?.packageRating.toFixed(1)
                      : 0}{" "}
                    ({packageData?.packageTotalRatings} ratings)
                  </Typography>
                  <Rating
                    name="read-only"
                    value={+packageData?.packageRating}
                    precision={0.5}
                    readOnly
                  />
                </Box>

                {/* Description */}
                <Box className="w-full flex flex-col mt-2">
                  <Typography
                    variant="body1"
                    className="flex flex-col font-medium"
                    id="desc"
                  >
                    {packageData?.packageDescription.length > 280 ? (
                      <>
                        {packageData?.packageDescription.substring(0, 150)}...
                        <Button
                          id="moreBtn"
                          onClick={() => {
                            document.getElementById("desc").innerText =
                              packageData?.packageDescription;
                            document.getElementById("moreBtn").style.display =
                              "none";
                            document.getElementById("lessBtn").style.display =
                              "flex";
                          }}
                          variant="text"
                          color="primary"
                        >
                          More <FaArrowDown />
                        </Button>
                        <Button
                          id="lessBtn"
                          onClick={() => {
                            document.getElementById("desc").innerText =
                              packageData?.packageDescription.substring(
                                0,
                                150
                              ) + "...";
                            document.getElementById("lessBtn").style.display =
                              "none";
                            document.getElementById("moreBtn").style.display =
                              "flex";
                          }}
                          variant="text"
                          color="primary"
                          style={{ display: "none" }}
                        >
                          Less <FaArrowUp />
                        </Button>
                      </>
                    ) : (
                      packageData?.packageDescription
                    )}
                  </Typography>
                </Box>

                {/* Accommodation */}
                {packageData?.packageAccommodation && (
                  <Typography variant="body1" color="textSecondary">
                    <strong>Accommodation: </strong>
                    {packageData?.packageAccommodation}
                  </Typography>
                )}

                {/* Activities */}
                {packageData?.packageActivities && (
                  <Typography variant="body1" color="textSecondary">
                    <strong>Activities: </strong>
                    {packageData?.packageActivities}
                  </Typography>
                )}

                {/* Meals */}
                {packageData?.packageMeals && (
                  <Typography variant="body1" color="textSecondary">
                    <strong>Meals: </strong>
                    {packageData?.packageMeals}
                  </Typography>
                )}

                {/* Transportation */}
                {packageData?.packageTransportation && (
                  <Typography variant="body1" color="textSecondary">
                    <strong>Transportation: </strong>
                    {packageData?.packageTransportation}
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Box>

        {/* Right section for Booking Button, ratings and review option */}
        <div className="flex-1 flex flex-col gap-5 p-5 border-l">
          {/* Booking Button */}
          <Box display="flex" justifyContent="center" mb={2}>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                if (currentUser) {
                  navigate(`/booking/${params?.id}`);
                } else {
                  navigate(
                    `/login?redirect=${encodeURIComponent(currentPath)}`
                  ); // Redirect to login with current path
                }
              }}
              sx={{
                width: { xs: "100%", sm: "200px" },
                opacity: { "&:hover": 0.95 },
              }}
            >
              Book Now
            </Button>
          </Box>
          {/* Booking Button */}

          {/* Give Rating/Review */}
          {packageRatings && (
            <>
              <Typography variant="h6" align="center">
                Rating/Reviews:
              </Typography>
              <Box
                display={!currentUser || ratingGiven ? "none" : "flex"}
                flexDirection="column"
                alignItems="center"
                gap={2}
              >
                <Rating
                  name="simple-controlled"
                  value={ratingsData?.rating}
                  onChange={(e, newValue) => {
                    setRatingsData({
                      ...ratingsData,
                      rating: newValue,
                    });
                  }}
                />
                <TextField
                  id="standard-basic"
                  label="Review"
                  multiline
                  variant="outlined"
                  rows={3}
                  placeholder="Type your review here..."
                  value={ratingsData?.review}
                  onChange={(e) => {
                    setRatingsData({
                      ...ratingsData,
                      review: e.target.value,
                    });
                  }}
                  fullWidth
                  sx={{ bgcolor: "background.paper" }}
                />
                <Button
                  disabled={
                    (ratingsData.rating === 0 && ratingsData.review === "") ||
                    loading
                  }
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!currentUser) {
                      navigate(
                        `/login?redirect=${encodeURIComponent(currentPath)}`
                      ); // Redirect to login with current path
                    } else {
                      giveRating();
                    }
                  }}
                  sx={{
                    width: { xs: "100%", sm: "200px" },
                    opacity: { "&:hover": 0.95 },
                    color: "white",
                  }}
                >
                  {loading ? "Loading..." : "Submit"}
                </Button>
                <Divider sx={{ width: "100%", my: 3 }} />
              </Box>

              {/* Check if there are any ratings and display accordingly */}
              {packageRatings.length === 0 ? (
                <Typography align="center">No ratings given</Typography>
              ) : (
                <Box
                  mt={2}
                  display="grid"
                  gap={2}
                  gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                >
                  <RatingCard packageRatings={packageRatings} />
                  {packageData.packageTotalRatings > 4 && (
                    <Button
                      onClick={() => navigate(`/package/ratings/${params?.id}`)}
                      variant="outlined"
                      color="primary"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      View All <FaArrowRight />
                    </Button>
                  )}
                </Box>
              )}
            </>
          )}

          {!currentUser && (
            <Box display="flex" justifyContent="center" mb={2}>
              <Button
                onClick={() => {
                  navigate(
                    `/login?redirect=${encodeURIComponent(currentPath)}`
                  ); // Redirect to login with current path
                }}
                variant="contained"
                color="primary"
                sx={{
                  width: { xs: "100%", sm: "200px" },
                  opacity: { "&:hover": 0.95 },
                  color: "white",
                }}
              >
                Rate Package
              </Button>
            </Box>
          )}
        </div>
        {/* give rating/review */}
      </div>
    </Container>
  );
};

export default Package;
