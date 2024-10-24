import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, IconButton, Container } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import AddressIcon from "@mui/icons-material/LocationOn";
import logo from "../../assets/images/logo.svg"; // Adjust the path accordingly

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#333", color: "white", py: 6 }}>
      <Container>
        {/* Top Footer Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: 4,
            mb: 6,
          }}
        >
          {/* Logo and Description */}
          <Box sx={{ flexGrow: 2 }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
              <img
                src={logo}
                alt="Heaven of Holiday Logo"
                style={{ height: 60, marginRight: 12 }}
              />
              {!logo && (
                <Typography variant="h5" sx={{ color: "#ff681a", fontWeight: 'bold' }}>
                  Heaven of Holiday
                </Typography>
              )}
            </Link>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              Explore the best holiday destinations with Heaven of Holiday. We
              offer a wide range of tours, destinations, and customized travel
              packages to make your holidays unforgettable.
            </Typography>
          </Box>

          {/* Contact Information */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#ff681a" }}>
              Contact Us
            </Typography>
            <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
              <IconButton color="inherit" component="a" href="https://www.google.com/maps/dir//heavenofholiday/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x397471a8e17cd73b:0xfd7f466a2a0dbd98?sa=X&ved=1t:3061&ictx=111">
                <AddressIcon />
              </IconButton>
              <Typography variant="body2">
                <a
                  href="https://www.google.com/maps/dir//heavenofholiday"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Agra, Uttar Pradesh
                </a>
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
              <IconButton color="inherit" component="a" href="mailto:info@heavenofholiday.com">
                <EmailIcon />
              </IconButton>
              <Typography variant="body2">
                <a
                  href="mailto:info@heavenofholiday.com"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  info@heavenofholiday.com
                </a>
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton color="inherit" component="a" href="tel:+917452849199">
                <PhoneIcon />
              </IconButton>
              <Typography variant="body2">
                <a
                  href="tel:+917452849199"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  074 5284 9199
                </a>
              </Typography>
            </Box>
          </Box>

          {/* Social Media Links */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#ff681a" }}>
              Follow Us
            </Typography>
            <Box display="flex">
              <IconButton
                color="inherit"
                component="a"
                href="https://facebook.com/heavenofholiday"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                color="inherit"
                component="a"
                href="https://instagram.com/heavenofholiday"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                color="inherit"
                component="a"
                href="https://www.youtube.com/channel/UC3tLT4dew3mDziRewJ0zuYg?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <YouTubeIcon />
              </IconButton>
              <IconButton
                color="inherit"
                component="a"
                href="https://twitter.com/heavenofholiday"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                color="inherit"
                component="a"
                href="http://wa.me/917452849199?text=Hi%2C+I+contacted+you+through+your+website."
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Bottom Footer Section */}
        <Box
          sx={{
            borderTop: "1px solid #666",
            pt: 3,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "#bbb" }}>
            © {new Date().getFullYear()} Heaven of Holiday. All rights reserved.
          </Typography>
          <Box display="flex" gap={2}>
            <Link
              to="/terms"
              style={{ color: "#bbb", textDecoration: "none" }}
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              style={{ color: "#bbb", textDecoration: "none" }}
            >
              Privacy Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
