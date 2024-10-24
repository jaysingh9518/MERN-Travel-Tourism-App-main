import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PackageCard from "./PackageCard";
import BlogCard from "./BlogCard";
import Pagination from "@mui/material/Pagination"; // Import Material-UI Pagination
import {
  Container,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box,
} from "@mui/material";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sideBarSearchData, setSideBarSearchData] = useState({
    searchTerm: "",
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [allPackages, setAllPackages] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [packagePage, setPackagePage] = useState(1);
  const [blogPage, setBlogPage] = useState(1);
  const [totalPackageCount, setTotalPackageCount] = useState(0);
  const [totalBlogCount, setTotalBlogCount] = useState(0);
  const itemsPerPage = 3; // Define items per page

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (searchTermFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
      setSideBarSearchData({
        searchTerm: searchTermFromUrl || "",
        offer: offerFromUrl === "true",
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const searchQuery = urlParams.toString();

        // Fetch packages with pagination
        const packageResponse = await fetch(
          `/api/package/get-packages?${searchQuery}&limit=${itemsPerPage}&page=${packagePage}`
        );
        const packageData = await packageResponse.json();
        setAllPackages(packageData?.packages || []);
        setTotalPackageCount(packageData?.totalPackages || 0); // Assuming API provides total package count

        // Fetch blogs with pagination
        const blogResponse = await fetch(
          `/api/blog?${searchQuery}&limit=${itemsPerPage}&page=${blogPage}`
        );
        const blogData = await blogResponse.json();
        setAllBlogs(blogData?.blogs || []);
        setTotalBlogCount(blogData?.totalBlogs || 0); // Assuming API provides total blog count
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [location.search, packagePage, blogPage]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;
    if (id === "searchTerm") {
      setSideBarSearchData((prevData) => ({
        ...prevData,
        searchTerm: value,
      }));
    } else if (id === "offer") {
      setSideBarSearchData((prevData) => ({
        ...prevData,
        offer: checked,
      }));
    } else if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setSideBarSearchData((prevData) => ({
        ...prevData,
        sort: sort || "createdAt",
        order: order || "desc",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(sideBarSearchData);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const fetchFeaturedBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/blog/featured`);
      const data = await response.json();
      setAllBlogs(data.blogs);
      setTotalBlogCount(data.blogs.length);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePackagePageChange = (event, value) => {
    setPackagePage(value);
  };

  const handleBlogPageChange = (event, value) => {
    setBlogPage(value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center", // Align items vertically centered
          position: "sticky", // Make the box sticky
          top: 60, // Position below the header
          backgroundColor: "white", // Ensure background color covers content behind
          zIndex: 998, // Keep it above other content
          borderBottom: "1px solid #ccc", // Optional border for separation
          p: 2, // Padding for inner spacing
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ mr: 2 }}>
          Search
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexGrow: 1, gap: 2 }}
        >
          <TextField
            id="searchTerm"
            label="Search"
            variant="outlined"
            fullWidth
            value={sideBarSearchData.searchTerm}
            onChange={handleChange}
            sx={{ flex: "1" }} // Allow TextField to grow
          />
          <FormControlLabel
            control={
              <Checkbox
                id="offer"
                checked={sideBarSearchData.offer}
                onChange={handleChange}
              />
            }
            label="Offer"
            sx={{ marginRight: 2 }} // Space between checkbox and Select
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="sort_order" sx={{ padding: "5px", fontWeight: "600", color: "primary", background: "white" }}>Sort</InputLabel>
            <Select
              labelId="sort_order"
              id="sort_order"
              defaultValue={"createdAt_desc"}
              onChange={handleChange}
              sx={{ margin: "5px" }}
            >
              <MenuItem value="packagePrice_desc">Price high to low</MenuItem>
              <MenuItem value="packagePrice_asc">Price low to high</MenuItem>
              <MenuItem value="packageRating_desc">Top Rated</MenuItem>
              <MenuItem value="packageTotalRatings_desc">Most Rated</MenuItem>
              <MenuItem value="createdAt_desc">Latest</MenuItem>
              <MenuItem value="createdAt_asc">Oldest</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ margin: "5px", color: "white" }} // Remove fullWidth to keep button size minimal
          >
            Search
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={fetchFeaturedBlogs}
            sx={{ margin: "5px" }}
          >
            Featured Blogs
          </Button>
        </form>
      </Box>

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
      >
        <Box flexGrow={1} sx={{ p: 2 }}>
          {/* Package Results Section */}
          <Typography variant="h5" gutterBottom>
            Package Results:
          </Typography>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            }}
            gap={2}
          >
            {!loading && allPackages.length === 0 && (
              <Typography variant="body1" color="textSecondary">
                No Packages Found!
              </Typography>
            )}
            {loading && (
              <Typography
                variant="body1"
                color="textSecondary"
                textAlign="center"
              >
                Loading...
              </Typography>
            )}
            {!loading &&
              allPackages.map((packageData, i) => (
                <PackageCard key={i} packageData={packageData} />
              ))}
          </Box>

          {/* Pagination for Packages */}
          <Box display="flex" justifyContent="center" sx={{ mt: 4, mb: 2 }}>
            <Pagination
              count={Math.ceil(totalPackageCount / itemsPerPage)}
              page={packagePage}
              onChange={handlePackagePageChange}
              sx={{
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "primary.main", // Change the background color of the selected item
                  color: "white", // Change the text color of the selected item
                },
                "& .MuiPaginationItem-root": {
                  color: "primary.main", // Change the text color of unselected items
                },
              }}
            />
          </Box>

          {/* Blog Results Section */}
          <Typography variant="h5" gutterBottom>
            Blog Results:
          </Typography>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            }}
            gap={2}
          >
            {!loading && allBlogs.length === 0 && (
              <Typography variant="body1" color="textSecondary">
                No Blogs Found!
              </Typography>
            )}
            {loading && (
              <Typography
                variant="body1"
                color="textSecondary"
                textAlign="center"
              >
                Loading...
              </Typography>
            )}
            {!loading &&
              allBlogs.map((blog, i) => <BlogCard key={i} blog={blog} />)}
          </Box>

          {/* Pagination for Blogs */}
          <Box display="flex" justifyContent="center" sx={{ mt: 4, mb: 2 }}>
            <Pagination
              count={Math.ceil(totalBlogCount / itemsPerPage)}
              page={blogPage}
              onChange={handleBlogPageChange}
              sx={{
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "primary.main", // Change the background color of the selected item
                  color: "white", // Change the text color of the selected item
                },
                "& .MuiPaginationItem-root": {
                  color: "primary.main", // Change the text color of unselected items
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Search;
