import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Box,
  Button,
} from "@mui/material";
import { FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

const PackageCard = ({ packageData }) => {
  return (
    <Box sx={{ mx: 1, my: 2 }}>
      {" "}
      {/* Add space on the left and right, and top and bottom */}
      <Link
        to={`/package/${packageData._id}`}
        style={{ textDecoration: "none" }}
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
            boxShadow: 3, // Apply shadow style
            overflow: "hidden",
            transition: "transform 0.3s",
            "&:hover": {
              transform: "scale(1.05)", // Slight scale on hover
            },
          }}
        >
          <CardMedia
            component="img"
            height="220"
            image={packageData.packageImages[0]}
            alt="Package Image"
            sx={{ objectFit: "cover", width: "100%" }} // Maintain aspect ratio and fill space
          />
          <CardContent sx={{ textAlign: "center", p: 2 }}>
            <Typography
              variant="h6"
              component="p"
              sx={{ fontWeight: "bold", mb: 1, textTransform: "capitalize" }}
            >
              {packageData.packageName}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "green.700", mb: 1, textTransform: "capitalize" }}
            >
              {packageData.packageDestination}
            </Typography>
            {(+packageData.packageDays > 0 ||
              +packageData.packageNights > 0) && (
              <Typography
                variant="body2"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <FaClock />
                {+packageData.packageDays > 0 &&
                  `${packageData.packageDays} Day${
                    packageData.packageDays > 1 ? "s" : ""
                  }`}
                {+packageData.packageDays > 0 &&
                  +packageData.packageNights > 0 &&
                  " - "}
                {+packageData.packageNights > 0 &&
                  `${packageData.packageNights} Night${
                    packageData.packageNights > 1 ? "s" : ""
                  }`}
              </Typography>
            )}
            {/* Price & Rating */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 1,
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {packageData.packageTotalRatings > 0 && (
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Rating
                    value={packageData.packageRating}
                    size="small"
                    readOnly
                    precision={0.1}
                  />
                  ({packageData.packageTotalRatings})
                </Typography>
              )}
              {packageData.packageOffer && packageData.packageDiscountPrice ? (
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ textDecoration: "line-through", color: "gray" }}
                  >
                    ${packageData.packagePrice}
                  </span>
                  <span style={{ marginLeft: "4px", color: "green" }}>
                    ${packageData.packageDiscountPrice}
                  </span>
                </Typography>
              ) : (
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", color: "green" }}
                >
                  ${packageData.packagePrice}
                </Typography>
              )}
            </Box>

            <Button
              variant="contained"
              sx={{
                mt: 2,
                color: "white",
                backgroundColor: "green",
                "&:hover": {
                  backgroundColor: "green",
                },
              }}
              component={Link}
              to={`/package/${packageData._id}`} // Link to the package details page
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      </Link>
    </Box>
  );
};

export default PackageCard;
