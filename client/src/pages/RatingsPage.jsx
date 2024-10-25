import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import RatingCard from "./RatingCard";

const RatingsPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [packageRatings, setPackageRatings] = useState([]);
  const [showRatingStars, setShowRatingStars] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const getRatings = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/api/rating/get-ratings/${params.id}/999999999999`
      );
      const res2 = await fetch(`${API_URL}/api/rating/average-rating/${params.id}`);
      const data = await res.json();
      const data2 = await res2.json();

      if (data && data2) {
        setPackageRatings(data);
        setShowRatingStars(data2.rating);
        setTotalRatings(data2.totalRatings);
        setLoading(false);
      } else {
        setPackageRatings("No ratings yet!");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) getRatings();
  }, [params.id]);

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          <Typography variant="h4" align="center" gutterBottom>
            Ratings
          </Typography>
          {!packageRatings.length ? (
            <Typography variant="h6" align="center">
              No Ratings Found!
            </Typography>
          ) : (
            <Box>
              <Typography variant="h6" align="left" gutterBottom>
                <Box display="flex" alignItems="center">
                  <span>Rating:</span>
                  <Rating
                    size="large"
                    value={showRatingStars || 0}
                    readOnly
                    precision={0.1}
                    sx={{ ml: 1 }} // Add left margin for spacing
                  />
                  <span>({totalRatings})</span>
                </Box>
              </Typography>

              <Button
                variant="outlined"
                onClick={() => navigate(`/package/${params.id}`)}
                sx={{ mb: 2 }}
              >
                Back
              </Button>
              <hr />
              <Box
                mt={2}
                mb={4}
                display="grid"
                gap={2}
                gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
              >
                <RatingCard packageRatings={packageRatings} />
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default RatingsPage;
