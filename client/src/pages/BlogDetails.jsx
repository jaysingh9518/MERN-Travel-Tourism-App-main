import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Container,
  Button,
  TextField,
  Typography,
  Alert,
  colors,
} from "@mui/material";
import {
  FaArrowLeft,
  FaShare,
  FaUser,
  FaClock,
  FaThumbsUp,
  FaThumbsDown,
  FaEye,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [copied, setCopied] = useState(false);

  const fetchBlogDetails = async () => {
    try {
      const response = await fetch(`/api/blog/${id}`);
      const data = await response.json();
      if (data.success) {
        setBlogData(data.blog);
        setComments(data.blog.comments);
      } else {
        setError(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching the blog details.");
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    await fetch(`/api/blog/view/${id}`, { method: "PUT" });
  };

  const handleLike = async () => {
    const response = await fetch(`/api/blog/like/${id}`, { method: "PUT" });
    const data = await response.json();
    if (data.success) setBlogData((prev) => ({ ...prev, likes: data.likes }));
  };

  const handleDislike = async () => {
    const response = await fetch(`/api/blog/dislike/${id}`, { method: "PUT" });
    const data = await response.json();
    if (data.success)
      setBlogData((prev) => ({ ...prev, dislikes: data.dislikes }));
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in to comment.");
      navigate(`/login?redirect=/blog/${id}`);
      return;
    }

    try {
      const response = await fetch(`/api/blog/comment/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: newComment,
          username: currentUser.username, // Pass the username
          userProfileImg:
            currentUser.avatar ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png", // Pass the avatar
        }),
      });
      const data = await response.json();
      if (data.success) {
        setComments(data.comments);
        setNewComment("");
      } else {
        alert(data.message || "Failed to add comment.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while submitting your comment.");
    }
  };

  useEffect(() => {
    fetchBlogDetails();
    incrementViews();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!blogData) return <p>No blog data found.</p>;

  return (
    <Container maxWidth="lg">
      {/* Floating Buttons */}
      {/* Back button */}
      <div className="fixed bottom-5 left-5 z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-white shadow-lg cursor-pointer hover:bg-gray-100 transition">
        <FaArrowLeft className="text-slate-500" onClick={() => navigate("/blog")} />
      </div>
      {/* Copy button */}
      <div className="fixed bottom-5 right-5 z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-white shadow-lg cursor-pointer hover:bg-gray-100 transition">
        <FaShare
          className="text-slate-500"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        />
      </div>
      {/* "Link copied" message */}
      {copied && (
        <p className="fixed bottom-16 right-5 z-10 rounded-md bg-slate-200 text-slate-600 p-2 shadow-lg">
          Link copied!
        </p>
      )}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
        <img
          src={blogData.coverImage}
          alt={blogData.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <Typography variant="h4" className="font-bold mb-2">
            {blogData.title}
          </Typography>
          <p className="text-gray-600 text-sm mb-2 flex items-center">
            <FaUser className="inline mr-1" />
            <span>{blogData.author}</span>
            <FaClock className="inline ml-4 mr-1" />
            <span>{new Date(blogData.createdAt).toLocaleDateString()}</span>
            <FaEye className="ml-4 mr-1" />
            <span>{blogData.views} Views</span>
            <FaThumbsUp className="ml-4 mr-1" />
            <span>{blogData.likes}</span>
            <FaThumbsDown className="ml-2 mr-1" />
            <span>{blogData.dislikes}</span>
          </p>

          <p className="text-gray-800 mb-4">{blogData.content}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              {" "}
              {/* Added gap-4 here */}
              <Button onClick={handleLike} variant="contained" color="primary">
                <FaThumbsUp className="mr-1" /> {blogData.likes}
              </Button>
              <Button
                onClick={handleDislike}
                variant="contained"
                color="secondary"
              >
                <FaThumbsDown className="mr-1" /> {blogData.dislikes}
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-6">
            <Typography variant="h6" className="font-bold mb-3">
              Comments
            </Typography>
            <form onSubmit={submitComment} className="mb-4">
              <TextField
                id="comment"
                name="comment"
                placeholder="Type your comment here..."
                multiline
                fullWidth
                label="Add a comment"
                variant="outlined"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
              <div className="flex items-center justify-between mt-4">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="mt-4"
                  sx={{ color: "white" }}
                >
                  Submit Comment
                </Button>
              </div>
            </form>

            <ul>
              {comments.map((comment, index) => (
                <li key={index} className="border-b border-gray-300 py-2">
                  <div className="flex items-center">
                    <img
                      src={
                        comment.userProfileImg ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="font-semibold">
                      {comment.username || "Anonymous"}
                    </span>
                  </div>
                  <p>{comment.comment}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Button href="/blog" className="text-blue-500 underline mt-4 block">
            Back to Blogs
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default BlogDetails;
