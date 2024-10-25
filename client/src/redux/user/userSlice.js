import { createSlice } from "@reduxjs/toolkit";

// Initial state for the user slice
const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

// User slice definition
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true; // Set loading to true when starting login
    },
    loginSuccess: (state, action) => {
      state.currentUser = action.payload; // Update current user on successful login
      state.loading = false; // Set loading to false
      state.error = null; // Clear any previous error
    },
    loginFailure: (state, action) => {
      state.error = action.payload; // Set error message on failure
      state.loading = false; // Set loading to false
    },
    updateUserStart: (state) => {
      state.loading = true; // Set loading when starting user update
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload; // Update current user info
      state.loading = false; // Set loading to false
      state.error = null; // Clear any previous error
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload; // Set error message on failure
      state.loading = false; // Set loading to false
    },
    updatePassStart: (state) => {
      state.loading = true; // Set loading when starting password update
    },
    updatePassSuccess: (state) => {
      state.loading = false; // Set loading to false on success
      state.error = null; // Clear any previous error
    },
    updatePassFailure: (state, action) => {
      state.loading = false; // Set loading to false
      state.error = action.payload; // Set error message on failure
    },
    logOutStart: (state) => {
      state.loading = true; // Set loading when starting logout
    },
    logOutSuccess: (state) => {
      state.currentUser = null; // Clear current user on logout
      state.loading = false; // Set loading to false
      state.error = null; // Clear any previous error
    },
    logOutFailure: (state, action) => {
      state.loading = false; // Set loading to false
      state.error = action.payload; // Set error message on failure
    },
    deleteUserAccountStart: (state) => {
      state.loading = true; // Set loading when starting account deletion
    },
    deleteUserAccountSuccess: (state) => {
      state.currentUser = null; // Clear current user on successful account deletion
      state.loading = false; // Set loading to false
      state.error = null; // Clear any previous error
    },
    deleteUserAccountFailure: (state, action) => {
      state.loading = false; // Set loading to false
      state.error = action.payload; // Set error message on failure
    },
  },
});

// Exporting actions for use in components
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  updatePassStart,
  updatePassSuccess,
  updatePassFailure,
  logOutStart,
  logOutSuccess,
  logOutFailure,
  deleteUserAccountStart,
  deleteUserAccountSuccess,
  deleteUserAccountFailure,
} = userSlice.actions;

// Exporting the reducer for the user slice
export default userSlice.reducer;
