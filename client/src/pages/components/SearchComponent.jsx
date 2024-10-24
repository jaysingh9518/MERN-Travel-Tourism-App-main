// SearchComponent.jsx
import React, { useState, useRef } from "react";
import { Box, TextField, Button, IconButton } from "@mui/material";
import { FaSearch, FaCalendar, FaStar } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { LuBadgePercent } from "react-icons/lu";
import { useNavigate } from "react-router";

const SearchComponent = ({ onClose }) => {
  const [search, setSearch] = useState("");
  const [flicker, setFlicker] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (search.trim() === "") {
      setFlicker(true);
      inputRef.current.focus();
      setTimeout(() => {
        setFlicker(false);
      }, 500);
    } else {
      navigate(`/search?searchTerm=${search}`); // Search for blogs or packages
      onClose(); // Call onClose to hide the component
    }
  };

  const handleButtonClick = (query) => {
    navigate(query);
    onClose(); // Call onClose to hide the component
  };

  React.useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      mt={4}
      width="100%"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={2}
        mt={4}
        width="100%"
      >
        <TextField
          inputRef={inputRef}
          variant="outlined"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          sx={{
            width: { xs: "230px", sm: "60%" },
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            borderRadius: "45px",
            animation: flicker ? "flicker-animation 0.5s" : "none",
            "& input": {
              color: "white",
              fontWeight: "bold",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#ff681a",
                borderRadius: "45px",
              },
            },
            "& .MuiOutlinedInput-root:hover fieldset": {
              borderColor: "#e85309",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e85309",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "black",
              fontWeight: "bold",
              fontFamily: "cursive",
            },
            "& input:-webkit-autofill": {
              borderRadius: "45px",
              WebkitBoxShadow: "0 0 0 1000px rgba(255, 255, 255, 0.4) inset",
              color: "white",
            },
          }}
        />
        <IconButton
          onClick={handleSearch}
          sx={{
            width: "52px",
            height: "52px",
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            border: "1px solid #ff681a",
            color: "#ff681a",
            borderRadius: "50%",
            fontSize: "1.8rem",
            fontWeight: "bold",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
            transition: "background-color 0.3s, transform 0.2s",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              transform: "scale(1.05)",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
            },
            "&:active": {
              backgroundColor: "#e0e0e0",
              transform: "scale(0.95)",
            },
          }}
          aria-label="Search"
        >
          <FaSearch />
        </IconButton>
      </Box>

      {/* Button Section */}
      <Box className="w-[90%] max-w-xl flex justify-center mt-10">
        <Button
          onClick={() => handleButtonClick("/search?offer=true")}
          variant="contained"
          startIcon={<LuBadgePercent />}
          sx={{
            backgroundColor: "rgba(100, 100, 100, 0.8)",
            color: "white",
            borderRadius: "20px",
            mx: 1,
            flex: 1,
            "&:hover": {
              backgroundColor: "rgba(100, 100, 100, 1)",
            },
          }}
        >
          Best Offers
        </Button>
        <Button
          onClick={() => handleButtonClick("/search?sort=packageRating")}
          variant="contained"
          startIcon={<FaStar />}
          sx={{
            backgroundColor: "rgba(100, 100, 100, 0.8)",
            color: "white",
            borderRadius: "20px",
            mx: 1,
            flex: 1,
            "&:hover": {
              backgroundColor: "rgba(100, 100, 100, 1)",
            },
          }}
        >
          Top Rated
        </Button>
        <Button
          onClick={() => handleButtonClick("/search?searchTerm=&sort=createdAt")}
          variant="contained"
          startIcon={<FaCalendar />}
          sx={{
            backgroundColor: "rgba(100, 100, 100, 0.8)",
            color: "white",
            borderRadius: "20px",
            mx: 1,
            flex: 1,
            "&:hover": {
              backgroundColor: "rgba(100, 100, 100, 1)",
            },
          }}
        >
          Latest
        </Button>
        <Button
          onClick={() => handleButtonClick("/search?sort=packageTotalRatings")}
          variant="contained"
          startIcon={<FaRankingStar />}
          sx={{
            backgroundColor: "rgba(100, 100, 100, 0.8)",
            color: "white",
            borderRadius: "20px",
            mx: 1,
            flex: 1,
            "&:hover": {
              backgroundColor: "rgba(100, 100, 100, 1)",
            },
          }}
        >
          Most Rated
        </Button>
      </Box>

      <style>
        {`
          @keyframes flicker-animation {
            0%, 100% {
              box-shadow: 0 0 0px rgba(255, 255, 255, 0.5);
            }
            50% {
              box-shadow: 0 0 10px rgba(255, 255, 255, 1);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default SearchComponent;
