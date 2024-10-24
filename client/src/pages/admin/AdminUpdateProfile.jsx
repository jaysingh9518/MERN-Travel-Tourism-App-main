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
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
} from "@mui/material";

const AdminUpdateProfile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [updateProfileDetailsPanel, setUpdateProfileDetailsPanel] =
    useState(true);
  const [formData, setFormData] = useState({
    username: "",
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
        // navigate("/login"); // Uncomment this if you have navigate implemented
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
        // navigate("/login"); // Uncomment this if you have navigate implemented
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
      <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
        {updateProfileDetailsPanel ? (
          <form onSubmit={updateUserDetails}>
            <Typography variant="h4" align="center" gutterBottom>
              Update Profile
            </Typography>
            <TextField
              fullWidth
              id="username"
              label="Username"
              variant="outlined"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              id="address"
              label="Address"
              variant="outlined"
              value={formData.address}
              onChange={handleChange}
              margin="normal"
              multiline
              maxRows={4}
            />
            <TextField
              fullWidth
              id="phone"
              label="Phone"
              variant="outlined"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              sx={{ marginTop: 2, color: "white" }}
            >
              {loading ? "Loading..." : "Update"}
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              type="button"
              onClick={() => setUpdateProfileDetailsPanel(false)}
              disabled={loading}
              sx={{ marginTop: 1, color: "black" }}
            >
              Change Password
            </Button>
          </form>
        ) : (
          <form onSubmit={updateUserPassword}>
            <Typography variant="h4" align="center" gutterBottom>
              Change Password
            </Typography>
            <TextField
              fullWidth
              id="oldpassword"
              label="Enter Old Password"
              variant="outlined"
              type="password"
              value={updatePassword.oldpassword}
              onChange={handlePass}
              margin="normal"
            />
            <TextField
              fullWidth
              id="newpassword"
              label="Enter New Password"
              variant="outlined"
              type="password"
              value={updatePassword.newpassword}
              onChange={handlePass}
              margin="normal"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              sx={{ marginTop: 2, color: "white" }}
            >
              {loading ? "Loading..." : "Update Password"}
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              type="button"
              onClick={() => {
                setUpdateProfileDetailsPanel(true);
                setUpdatePassword({
                  oldpassword: "",
                  newpassword: "",
                });
              }}
              disabled={loading}
              sx={{ marginTop: 1,  color: "black" }}
            >
              Back
            </Button>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default AdminUpdateProfile;
