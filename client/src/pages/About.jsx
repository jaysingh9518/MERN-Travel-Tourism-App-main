import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const handleGetInTouch = () => {
    navigate("/contact"); // Navigate to /contact page
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About Us
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome to Heaven of Holiday
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // Column on small screens, row on medium and up
          justifyContent: 'space-between',
          gap: 4,
        }}
      >
        <Box
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 2,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            boxShadow: 3,
            textAlign: 'left',
          }}
        >
          <Typography variant="body1" sx={{ mb: 2 }}>
            When it comes to travel, come travel with Heaven of Holiday. We will make it memorable for you so that you can enjoy the tour and take wonderful memories with you. We know what you want and need to know; it’s not just all the cultural and historical places, but getting insider knowledge on great monuments and history all over the world.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Any ordinary vacation, holiday, or retreat becomes perfect when sufficient convenience, information, comfort, and safety are in place. Ever since Heaven of Holiday has been introduced, it has dealt with inbound as well as outbound tourism, whether it is readymade or tailor-made tours.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Our team members have traveled extensively to numerous destinations, gaining unique insights and knowledge of the destinations, and hence now recommending them to our clients. Being passionate travelers themselves, they combine an intuitive understanding with the customers to serve them with the best-suited tour package.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Whether it is 24 hours a day, 7 days a week, or 365 days throughout the year, our staff is totally dedicated to their clients, thus making a magical connection with them.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography align="center" variant="h6" gutterBottom>
          Our Services:
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around', // Space out items evenly
            gap: 2, // Add spacing between items
          }}
        >
          {["Flight Tickets", "Best Hotel Accommodations", "150+ Premium City Tours", "College Group Tours", "Sightseeing by Sedan or SUV", "24/7 Service"].map((service, index) => (
            <Box
              key={index}
              sx={{
                flex: '1 1 30%', // Allow each service box to grow and take up to 30% width
                p: 2,
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                boxShadow: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="body1">{service}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography align="center" variant="h5" component="h2" gutterBottom>
          Process
        </Typography>
        <Typography align="center" variant="h6" gutterBottom>
          3 Easy Steps:
        </Typography>
        <Box
          sx={{
            display: { xs: 'block', md: 'flex' }, // Stack items on small screens, row on medium and up
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
          }}
        >
          {[
            {
              title: "Consultation and Quote",
              details: [
                "Connect with a Travel Advisor:", 
                "Call +91-7452849199.",
                "Discuss Your Dream Vacation.",
                "Receive a Personalized Quote.",
              ],
            },
            {
              title: "Customized Itinerary Creation",
              details: [
                "Craft Your Perfect Trip based on your preferences.",
                "Receive a detailed itinerary for review.",
              ],
            },
            {
              title: "Secure Booking and Confirmation",
              details: [
                "Finalize your vacation with secure booking options.",
                "Experience a stress-free planning process.",
              ],
            },
          ].map((step, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                boxShadow: 2,
                textAlign: 'left',
              }}
            >
              <Typography variant="h6">{step.title}</Typography>
              <ul>
                {step.details.map((detail, i) => (
                  <li key={i}>
                    <Typography variant="body2">{detail}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Contact Us
        </Typography>
        <Button variant="contained" color="primary" sx={{ color: "white" }} onClick={handleGetInTouch}>
          Get in Touch
        </Button>
      </Box>
    </Container>
  );
};

export default About;
