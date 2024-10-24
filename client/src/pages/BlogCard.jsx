import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import {
  FaUser,
  FaClock,
  FaThumbsUp,
  FaThumbsDown,
  FaEye,
} from "react-icons/fa";

const BlogCard = ({ blog }) => {
  return (
    <Card sx={{ maxWidth: 345, mb: 4, boxShadow: 3 }}>
      <Link
        to={`/blog/${blog._id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <CardMedia
          component="img"
          height="140"
          image={blog.coverImage}
          alt={blog.title}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {blog.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1, display: "flex", alignItems: "center" }} // Use flexbox for alignment
          >
            <FaUser style={{ marginRight: 8 }} />
            {blog.author}
            <FaClock style={{ margin: "0 8px" }} />
            {new Date(blog.createdAt).toLocaleDateString()}
            <FaEye style={{ margin: "0 8px" }} />
            {blog.views} Views
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {blog.content.substring(0, 100)}...
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Box display="flex" alignItems="center">
              <Button
                size="small"
                startIcon={<FaThumbsUp />}
                sx={{ color: "green" }}
              >
                {blog.likes}
              </Button>
              <Button
                size="small"
                startIcon={<FaThumbsDown />}
                sx={{ color: "red" }}
              >
                {blog.dislikes}
              </Button>
            </Box>
            <Box>
              {blog.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={`#${tag}`}
                  size="small"
                  sx={{
                    marginRight: 1,
                    backgroundColor: "#f0f0f0",
                    color: "#333",
                  }}
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Link>
    </Card>
  );
};

export default BlogCard;
