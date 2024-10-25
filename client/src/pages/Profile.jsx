import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  logOutStart,
  logOutSuccess,
  logOutFailure,
  deleteUserAccountStart,
  deleteUserAccountSuccess,
  deleteUserAccountFailure,
} from "../redux/user/userSlice";
import MyBookings from "./user/MyBookings";
import UpdateProfile from "./user/UpdateProfile";
import MyHistory from "./user/MyHistory";
import {
  Box,
  Button,
  IconButton,
  Container,
  Typography,
  Paper,
  Tab,
  Tabs,
  Avatar,
  LinearProgress,
  Snackbar,
  Tooltip,
} from "@mui/material";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [profilePhoto, setProfilePhoto] = useState(undefined);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activePanelId, setActivePanelId] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
  });
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (currentUser !== null) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        address: currentUser.address,
        phone: currentUser.phone,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const handleProfilePhoto = async (photo) => {
    try {
      dispatch(updateUserStart());
      setUploading(true);
      setProgress(30); // Simulating initial progress

      const formData = new FormData();
      formData.append("file", photo);
      formData.append("upload_preset", "kwdcfqd4");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dkxmweeur/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        const avatarUrl = data.secure_url;

        const updateRes = await fetch(
          `${API_URL}/api/user/update-profile-photo/${currentUser._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ avatar: avatarUrl }),
          }
        );

        const updateData = await updateRes.json();

        if (updateData?.success) {
          setProgress(100); // Final progress
          setTimeout(() => {
            setUploading(false);
            setShowSuccess(true); // Show success message
            setFormData({ ...formData, avatar: avatarUrl });
            dispatch(updateUserSuccess(updateData?.user));
          }, 1000);
          return;
        } else {
          dispatch(updateUserFailure(updateData?.message));
        }
      }
    } catch (error) {
      console.log(error);
      dispatch(
        updateUserFailure("An error occurred while uploading the photo.")
      );
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(logOutStart());
      const res = await fetch(`${API_URL}/api/auth/logout`);
      const data = await res.json();
      if (data?.success !== true) {
        dispatch(logOutFailure(data?.message));
        return;
      }
      dispatch(logOutSuccess());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const CONFIRM = confirm(
      "Are you sure? The account will be permanently deleted!"
    );
    if (CONFIRM) {
      try {
        dispatch(deleteUserAccountStart());
        const res = await fetch(`${API_URL}/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data?.success === false) {
          dispatch(deleteUserAccountFailure(data?.message));
          alert("Something went wrong!");
          return;
        }
        dispatch(deleteUserAccountSuccess());
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setShowSuccess(false);
  };

  return (
    <Container maxWidth="lg" sx={{ padding: 3 }}>
      {currentUser ? (
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Paper elevation={3} sx={{ padding: 3, width: "100%" }}>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Profile Photo with Tooltip */}
                <Tooltip title="Update Profile Picture" arrow>
                  <Avatar
                    src={
                      (profilePhoto && URL.createObjectURL(profilePhoto)) ||
                      formData.avatar
                    }
                    alt="Profile photo"
                    sx={{
                      width: 150,
                      height: 150,
                      cursor: "pointer",
                      transition: "opacity 0.3s ease-in-out",
                      "&:hover": {
                        opacity: 0.7,
                      },
                    }}
                    onClick={() => fileRef.current.click()}
                  />
                </Tooltip>

                {/* Input for file upload */}
                <input
                  type="file"
                  ref={fileRef}
                  hidden
                  accept="image/*"
                  onChange={(e) => setProfilePhoto(e.target.files[0])}
                />

                {/* Conditionally render upload button */}
                {profilePhoto && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                      await handleProfilePhoto(profilePhoto);
                      setProfilePhoto(null); // Hide button after upload
                    }}
                    sx={{ mt: 2, color: "white" }}
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload Photo"}
                  </Button>
                )}
                {uploading && (
                  <Box sx={{ width: "100%", mt: 2 }}>
                    <LinearProgress variant="determinate" value={progress} />
                  </Box>
                )}
              </Box>

              <Box sx={{ width: "100%", mt: 2 }}>
                <Box
                  sx={{
                    width: "100%",
                    borderBottom: "1px solid black",
                    lineHeight: "0.1em",
                    margin: "10px 0", // Adjusted margin for spacing consistency
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      display: "inline-block",
                      backgroundColor: "#fff", // White background for text
                      padding: "0 8px", // Padding around text to create spacing with the border
                      fontWeight: "bold", // Make the text bold
                    }}
                  >
                    User Details
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                  Hi, {currentUser.username}!
                </Typography>

                <Typography variant="body1" sx={{ mt: 1 }}>
                  <strong>Email:</strong> {currentUser.email}
                </Typography>

                <Typography variant="body1" sx={{ mt: 1 }}>
                  <strong>Phone:</strong> {currentUser.phone}
                </Typography>

                <Typography variant="body1" sx={{ mt: 1 }}>
                  <strong>Address:</strong> {currentUser.address}
                </Typography>
              </Box>

              <Box mt={2} display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  fullWidth
                >
                  Log Out
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDeleteAccount}
                  fullWidth
                >
                  Delete Account
                </Button>
              </Box>
            </Paper>
          </Box>
          <Box flex={2}>
            <Paper elevation={3}>
              <Tabs
                value={activePanelId}
                onChange={(event, newValue) => setActivePanelId(newValue)}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Bookings" />
                <Tab label="History" />
                <Tab label="Update Profile" />
              </Tabs>
              <Box padding={2}>
                {activePanelId === 0 && <MyBookings />}
                {activePanelId === 1 && <MyHistory />}
                {activePanelId === 2 && <UpdateProfile />}
              </Box>
            </Paper>
          </Box>
        </Box>
      ) : (
        <Typography variant="h6" color="error">
          Login First
        </Typography>
      )}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Profile picture updated successfully!"
      />
    </Container>
  );
};

export default Profile;
