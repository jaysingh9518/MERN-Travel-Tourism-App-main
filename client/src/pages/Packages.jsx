import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Box, Pagination, CircularProgress } from "@mui/material"; // Import CircularProgress for loading indication
import PackageCard from "./PackageCard"; // Importing the PackageCard component

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // Adjust items per page as needed
  const [totalPages, setTotalPages] = useState(0); // State for total pages

  const fetchPackages = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        `/api/package/get-packages?page=${currentPage}&limit=${itemsPerPage}`
      ); // Updated API endpoint
      const data = await response.json();
      if (response.ok) {
        setPackages(data.packages); // Set fetched packages
        setTotalPages(data.totalPages); // Set total pages for pagination
      } else {
        throw new Error(data.message || "Failed to fetch packages");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [currentPage]); // Fetch packages whenever the current page changes

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress /> {/* Display loading spinner */}
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <div>
          <p>Error: {error}</p>
          <Link to="/">Go back to Home</Link>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <div className="main p-6 flex flex-col gap-5">
        <h1 className="text-2xl font-semibold text-center">Packages</h1>
        {packages.length === 0 ? (
          <h1 className="text-center text-2xl">No Packages Available!</h1>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} packageData={pkg} />
            ))}
          </div>
        )}
        <Box display="flex" justifyContent="center" sx={{ mt: 4, mb: 2 }}>
          <Pagination
            count={totalPages} // Use total pages from state
            page={currentPage} // Current page from state
            onChange={(event, value) => setCurrentPage(value)} // Update current page on change
            variant="outlined"
            shape="rounded"
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
      </div>
    </Container>
  );
};

export default Packages;
