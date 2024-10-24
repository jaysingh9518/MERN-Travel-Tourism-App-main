// Header.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Popover,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SearchIcon from "@mui/icons-material/Search";
import defaultProfileImg from "../../assets/images/profile.png";
import logo from "../../assets/images/logo.svg"; // Ensure this path is correct
import {
  logOutStart,
  logOutSuccess,
  logOutFailure,
} from "../../redux/user/userSlice";
import SearchComponent from "../components/SearchComponent";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearchComponent = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleCloseSearch = () => {
    setIsSearchVisible(false);
  };

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      dispatch(logOutStart());
      const res = await fetch("/api/auth/logout");
      const data = await res.json();
      if (data?.success) {
        dispatch(logOutSuccess());
      } else {
        dispatch(logOutFailure(data?.message));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      {/* Top section with contact info and social links */}
      <Box
        sx={{
          backgroundColor: "#ff681a",
          color: "white",
          py: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Container>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <IconButton
                color="inherit"
                component="a"
                href="mailto:info@heavenofholiday.com"
              >
                <EmailIcon />
              </IconButton>
              <Typography variant="body2" sx={{ ml: 1 }}>
                <a
                  href="mailto:info@heavenofholiday.com"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  info@heavenofholiday.com
                </a>
              </Typography>
              <IconButton
                color="inherit"
                component="a"
                href="tel:+917452849199"
                sx={{ ml: 2 }}
              >
                <PhoneIcon />
              </IconButton>
              <Typography variant="body2" sx={{ ml: 1 }}>
                <a
                  href="tel:+917452849199"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  074 5284 9199
                </a>
              </Typography>
            </Box>

            {/* Social Media Icons */}
            <Box display="flex" alignItems="center">
              {[
                { icon: <FacebookIcon />, link: "https://facebook.com/heavenofholiday" },
                { icon: <InstagramIcon />, link: "https://instagram.com/heavenofholiday" },
                { icon: <YouTubeIcon />, link: "https://www.youtube.com/channel/UC3tLT4dew3mDziRewJ0zuYg?sub_confirmation=1" },
                { icon: <TwitterIcon />, link: "https://twitter.com/heavenofholiday" },
                { icon: <WhatsAppIcon />, link: "http://wa.me/917452849199?text=Hi%2C+I+contacted+you+through+your+website." }
              ].map(({ icon, link }, index) => (
                <IconButton
                  key={index}
                  color="inherit"
                  component="a"
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {icon}
                </IconButton>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main navigation section */}
      <AppBar position="sticky" sx={{ backgroundColor: "white", zIndex: 999 }}>
        <Container>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* Logo */}
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <img
                src={logo}
                alt="Heaven of Holiday Logo"
                style={{ height: 60, marginRight: 8 }}
              />
              {/* Hide typography if logo image is available */}
              {logo ? null : (
                <Typography variant="h6" sx={{ color: "#ff681a", fontWeight: "bold" }}>
                  Heaven of Holiday
                </Typography>
              )}
            </Link>

            {/* Navigation Menu */}
            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
            >
              {["Home", "Packages", "Blog", "About", "Contact"].map((item) => (
                <Button
                  key={item}
                  component={Link}
                  to={`/${item.toLowerCase()}`}
                  sx={{
                    color: "gray",
                    "&:hover": { color: "#ff681a" },
                    margin: "0 15px",
                    transition: "color 0.3s",
                  }}
                >
                  {item}
                </Button>
              ))}
            </Box>

            {/* Profile or Login with Popup */}
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={toggleSearchComponent}
                sx={{ marginRight: "20px", color: "gray" }}
              >
                <SearchIcon />
              </IconButton>
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {currentUser ? (
                  <>
                    <Link
                      to={`/profile`}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <img
                        src={currentUser.avatar || defaultProfileImg}
                        alt={currentUser.username}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          border: "2px solid black",
                          objectFit: "cover",
                        }}
                      />
                    </Link>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleMouseLeave}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                    >
                      <Box sx={{ p: 2, width: 200 }}>
                        <Typography textAlign={"center"} variant="body1">
                          {currentUser.username}
                        </Typography>
                        <Button
                          component={Link}
                          to={`/profile/user`}
                          variant="outlined"
                          color="primary"
                          sx={{ mt: 1, width: '100%' }}
                        >
                          Profile
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={handleLogout}
                          sx={{ mt: 1, width: '100%' }}
                        >
                          Logout
                        </Button>
                      </Box>
                    </Popover>
                  </>
                ) : (
                  <Button
                    component={Link}
                    to={`/login`}
                    variant="contained"
                    sx={{
                      marginLeft: 2,
                      backgroundColor: "#ff681a",
                      color: "#ffffff",
                      "&:hover": {
                        backgroundColor: "#e65c0d",
                      },
                    }}
                  >
                    Login
                  </Button>
                )}
              </div>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Search Component */}
      {isSearchVisible && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(74, 73, 72, 0.9)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setIsSearchVisible(false)} // Close on background click
        >
          <Box onClick={(e) => e.stopPropagation()}>{/* Prevent propagation */}<SearchComponent onClose={handleCloseSearch} /></Box>
        </Box>
      )}
    </>
  );
};

export default Header;
