import React, { useCallback, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";
import PackageCard from "./PackageCard";
import BlogCard from "./BlogCard"; // Assuming you have a BlogCard component for displaying blog posts
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const navigate = useNavigate();
  const [topPackages, setTopPackages] = useState([]);
  const [latestPackages, setLatestPackages] = useState([]);
  const [offerPackages, setOfferPackages] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]); // State for featured blogs
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchData = async (url, setState) => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const data = await response.json();
      if (data?.success) {
        setState(data?.packages || data?.blogs); // Adjust based on the API response structure
      } else {
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getTopPackages = useCallback(() => {
    fetchData(`${API_URL}/api/package/get-packages?sort=packageRating&limit=8`, setTopPackages);
  }, [API_URL]);

  const getLatestPackages = useCallback(() => {
    fetchData(`${API_URL}/api/package/get-packages?sort=createdAt&limit=8`, setLatestPackages);
  }, [API_URL]);

  const getOfferPackages = useCallback(() => {
    fetchData(`${API_URL}/api/package/get-packages?sort=createdAt&offer=true&limit=6`, setOfferPackages);
  }, [API_URL]);

  const getFeaturedBlogs = useCallback(() => {
    fetchData(`${API_URL}/api/blog/featured?limit=3`, setFeaturedBlogs); // Adjust the API endpoint as needed
  }, [API_URL]);

  useEffect(() => {
    getTopPackages();
    getLatestPackages();
    getOfferPackages();
    getFeaturedBlogs();
  }, [getTopPackages, getLatestPackages, getOfferPackages, getFeaturedBlogs]);

  const sliderSettings = {
    dots: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    centerMode: true,
    centerPadding: "5px",
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Box className="main" sx={{ width: '100%' }}>
      {/* Hero Section */}
      <Paper elevation={3} sx={{ padding: 2, backgroundColor: 'background.paper', textAlign: 'center' }}>
        <Typography variant="h1" gutterBottom>
          Heaven of Holiday
        </Typography>
        <Typography variant="h5">
          Make Your Travel Dream Come True With Our Amazing Packages
        </Typography>
      </Paper>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ p: 6, display: "flex", flexDirection: "column", gap: 5 }}>
          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          )}
          {!loading && topPackages.length === 0 && latestPackages.length === 0 && offerPackages.length === 0 && featuredBlogs.length === 0 && (
            <Typography align="center" variant="h5">
              No Packages Yet!
            </Typography>
          )}

          {/* Top Rated Packages Slider */}
          {!loading && topPackages.length > 0 && (
            <>
              <Typography textAlign={"center"} variant="h5" sx={{ mb: 2 }}>
                Top Packages
              </Typography>
              <Slider {...sliderSettings}>
                {topPackages.map((packageData, i) => (
                  <Box key={i} sx={{ px: 1 }}>
                    <PackageCard packageData={packageData} />
                  </Box>
                ))}
              </Slider>
            </>
          )}

          {/* Latest Packages Slider */}
          {!loading && latestPackages.length > 0 && (
            <>
              <Typography textAlign={"center"} variant="h5" sx={{ mb: 2 }}>
                Latest Packages
              </Typography>
              <Slider {...sliderSettings}>
                {latestPackages.map((packageData, i) => (
                  <Box key={i} sx={{ px: 1 }}>
                    <PackageCard packageData={packageData} />
                  </Box>
                ))}
              </Slider>
            </>
          )}

          {/* Offer Packages Slider */}
          {!loading && offerPackages.length > 0 && (
            <>
              <Typography textAlign={"center"} variant="h5" sx={{ mb: 2 }}>
                Best Offers
              </Typography>
              <Slider {...sliderSettings}>
                {offerPackages.map((packageData, i) => (
                  <Box key={i} sx={{ px: 1 }}>
                    <PackageCard packageData={packageData} />
                  </Box>
                ))}
              </Slider>
            </>
          )}

          {/* Featured Blog Posts Section */}
          {!loading && featuredBlogs.length > 0 && (
            <>
              <Typography textAlign={"center"} variant="h5" sx={{ mb: 2 }}>
                Featured Blog Posts
              </Typography>
              <Box display="flex" flexDirection="row" gap={4} justifyContent="center">
                {featuredBlogs.map((blog, i) => (
                  <Box key={i} sx={{ px: 1 }}>
                    <BlogCard blog={blog} />
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
