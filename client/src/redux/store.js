import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js"; // Importing the user slice
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Using local storage for persistence

// Combining reducers
const rootReducer = combineReducers({
  user: userReducer, // Managing user state
});

// Configuration for redux-persist
const persistConfig = {
  key: "root", // Key for the persisted store
  storage, // Storage engine (local storage)
  version: 1, // Versioning for migrations if needed
};

// Creating a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuring the Redux store
export const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable checks for non-serializable data
    }),
});

// Creating a persistor for the store
export const persistor = persistStore(store);
