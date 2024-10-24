import Blog from "../models/blog.model.js";

// Create a new blog post (Admin only)
export const createBlogPost = async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    const savedBlog = await newBlog.save();
    res.status(201).json({
      success: true,
      message: "Blog post created successfully",
      blog: savedBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating blog post",
      error: error.message,
    });
  }
};

// Get all blog posts with pagination
export const getAllBlogs = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const limit = parseInt(req.query.limit) || 9; // Default limit is set to 9
    const page = parseInt(req.query.page) || 1;   // Current page number
    const startIndex = (page - 1) * limit;         // Calculate starting index for pagination

    const sort = req.query.sort || "createdAt";    // Default sorting by creation date
    const order = req.query.order === "asc" ? 1 : -1; // Ascending or descending order

    const blogs = await Blog.find({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } }, // Adjust based on your blog schema
        { content: { $regex: searchTerm, $options: "i" } }, // Adjust based on your blog schema
      ],
    })
      .sort({ [sort]: order }) // Sort blogs based on the provided sort order
      .limit(limit)            // Limit the number of blogs returned
      .skip(startIndex);       // Skip the first 'startIndex' blogs

    // Count total blogs to calculate total pages for pagination
    const totalBlogs = await Blog.countDocuments({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { content: { $regex: searchTerm, $options: "i" } },
      ],
    });

    const totalPages = Math.ceil(totalBlogs / limit); // Calculate total pages

    return res.status(200).json({
      success: true,
      blogs,
      totalPages,          // Send total pages for pagination
      currentPage: page,   // Send current page information
      totalBlogs,          // Send total blogs count
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching blog posts",
      error: error.message,
    });
  }
};

// Get featured blog posts
export const getFeaturedBlogs = async (req, res) => {
  try {
    // Assuming you have a field 'isFeatured' in your Blog model
    const featuredBlogs = await Blog.find({ featured: true }).sort({ createdAt: -1 }).limit(3); // Fetch the latest 3 featured blogs
    res.status(200).json({
      success: true,
      blogs: featuredBlogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching featured blogs",
      error: error.message,
    });
  }
};

// Get a single blog post by ID and increment views
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Increment the views count
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching blog post",
      error: error.message,
    });
  }
};

// Like a blog post
export const likeBlogPost = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    blog.likes += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      likes: blog.likes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error liking blog post",
      error: error.message,
    });
  }
};

// Dislike a blog post
export const dislikeBlogPost = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    blog.dislikes += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      dislikes: blog.dislikes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error disliking blog post",
      error: error.message,
    });
  }
};

// Add a comment to a blog post
export const addComment = async (req, res) => {
  try {
    const { username, comment, userProfileImg } = req.body; // Extract username and userProfileImg from request body
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    const newComment = {
      username,
      comment,
      userProfileImg, // Add user profile image to the comment
      createdAt: new Date(),
    };

    blog.comments.push(newComment);
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comments: blog.comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding comment",
      error: error.message,
    });
  }
};

// Update a blog post (Admin only)
export const updateBlogPost = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Blog post updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating blog post",
      error: error.message,
    });
  }
};

// Delete a blog post (Admin only)
export const deleteBlogPost = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting blog post",
      error: error.message,
    });
  }
};
