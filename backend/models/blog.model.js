import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true },
    tags: {
      type: [String],
    },
    coverImage: {
      type: String,
      required: true,
    },
    comments: [
      {
        username: { type: String, required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        userProfileImg: {
          type: String,
          default:
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
          },
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      // Automatically update `updatedAt` when document is updated
      timestamps: true,
    } // Automatically update `updatedAt` when document is updated  
  },
  { timestamps: true } // Automatically create `createdAt` and `updatedAt` fields
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
