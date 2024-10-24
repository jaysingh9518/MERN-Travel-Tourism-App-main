import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  updatePassStart,
  updatePassSuccess,
  updatePassFailure,
} from "../../redux/user/userSlice";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

const UpdateProfile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [updateProfileDetailsPanel, setUpdateProfileDetailsPanel] =
    useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
  });
  const [updatePassword, setUpdatePassword] = useState({
    oldpassword: "",
    newpassword: "",
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handlePass = (e) => {
    setUpdatePassword({
      ...updatePassword,
      [e.target.id]: e.target.value,
    });
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();
    if (
      currentUser.username === formData.username &&
      currentUser.email === formData.email &&
      currentUser.address === formData.address &&
      currentUser.phone === formData.phone
    ) {
      alert("Change at least 1 field to update details");
      return;
    }
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false && res.status !== 201 && res.status !== 200) {
        dispatch(updateUserSuccess());
        dispatch(updateUserFailure(data?.message));
        alert("Session Ended! Please login again");
        navigate("/login");
        return;
      }
      if (data.success && res.status === 201) {
        alert(data?.message);
        dispatch(updateUserSuccess(data?.user));
        return;
      }
      alert(data?.message);
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserPassword = async (e) => {
    e.preventDefault();
    if (
      updatePassword.oldpassword === "" ||
      updatePassword.newpassword === ""
    ) {
      alert("Enter a valid password");
      return;
    }
    if (updatePassword.oldpassword === updatePassword.newpassword) {
      alert("New password can't be the same!");
      return;
    }
    try {
      dispatch(updatePassStart());
      const res = await fetch(`/api/user/update-password/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePassword),
      });
      const data = await res.json();
      if (data.success === false && res.status !== 201 && res.status !== 200) {
        dispatch(updateUserSuccess());
        dispatch(updatePassFailure(data?.message));
        alert("Session Ended! Please login again");
        navigate("/login");
        return;
      }
      dispatch(updatePassSuccess());
      alert(data?.message);
      setUpdatePassword({
        oldpassword: "",
        newpassword: "",
      });
      return;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          padding: 3,
          border: "1px solid #000",
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {updateProfileDetailsPanel ? (
          <>
            <Typography variant="h5" align="center">
              Update Profile
            </Typography>
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              value={formData.username}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              id="email"
              label="Email"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              id="address"
              label="Address"
              variant="outlined"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              multiline
              maxRows={4}
            />
            <TextField
              id="phone"
              label="Phone"
              variant="outlined"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />
            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              onClick={updateUserDetails}
              sx={{ color: "white" }}
            >
              {loading ? <CircularProgress size={24} /> : "Update"}
            </Button>
            <Button
              disabled={loading}
              variant="contained"
              color="secondary"
              sx={{ color: "black" }}
              onClick={() => setUpdateProfileDetailsPanel(false)}
            >
              Change Password
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h5" align="center">
              Change Password
            </Typography>
            <TextField
              id="oldpassword"
              label="Enter Old Password"
              type="password"
              variant="outlined"
              value={updatePassword.oldpassword}
              onChange={handlePass}
              fullWidth
            />
            <TextField
              id="newpassword"
              label="Enter New Password"
              type="password"
              variant="outlined"
              value={updatePassword.newpassword}
              onChange={handlePass}
              fullWidth
            />
            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              sx={{ color: "white" }}
              onClick={updateUserPassword}
            >
              {loading ? <CircularProgress size={24} /> : "Update Password"}
            </Button>
            <Button
              disabled={loading}
              variant="contained"
              color="secondary"
              sx={{ color: "black" }}
              onClick={() => {
                setUpdateProfileDetailsPanel(true);
                setUpdatePassword({
                  oldpassword: "",
                  newpassword: "",
                });
              }}
            >
              Back
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default UpdateProfile;
