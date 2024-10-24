import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://mern-travel-tourism-app-main-9qh7.onrender.com",
        secure: false,
      },
    },
  },
  plugins: [react()],
});
