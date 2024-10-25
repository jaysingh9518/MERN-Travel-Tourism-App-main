import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "", // Assuming you'll fill this in programmatically
    tags: [],
    coverImage: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch blog data to populate the form
  const getBlogData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/blog/${id}`);
      const data = await res.json();
      if (data.success) {
        setFormData({
          title: data.blog.title,
          content: data.blog.content,
          author: data.blog.author, // Assuming you want to edit the author as well
          tags: data.blog.tags || [],
          coverImage: data.blog.coverImage,
        });
      } else {
        alert(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to fetch blog data");
    }
  };

  useEffect(() => {
    if (id) getBlogData();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: id === "tags" ? value.split(",").map(tag => tag.trim()) : value,
    }));
  };

  // Handle image uploads
  const handleImageSubmit = () => {
    if (selectedImage) {
      setUploading(true);
      storeImage(selectedImage);
    } else {
      setImageUploadError("You must select an image to upload.");
    }
  };

  // Upload image to Cloudinary
  const storeImage = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/dkxmweeur/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "kwdcfqd4");

    try {
      const res = await fetch(url, {
        method: "POST",
        body: formData,
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total;
          const loaded = progressEvent.loaded;
          setUploadProgress(Math.round((loaded / total) * 100));
        },
      });
      const data = await res.json();
      if (data.secure_url) {
        setFormData((prevData) => ({
          ...prevData,
          coverImage: data.secure_url,
        }));
        setImageUploadError(null);
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      setImageUploadError("Image upload failed (2MB max per image)");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setSelectedImage(null); // Reset selected image
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.coverImage) {
      alert("You must upload a cover image");
      return;
    }
    if (!formData.title || !formData.content || !formData.author) {
      alert("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/api/blog/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message);
      } else {
        alert(data.message);
        navigate(`/blog/${id}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-wrap justify-center gap-2 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-[60%] shadow-md rounded-xl p-3 gap-2 flex flex-col items-center"
      >
        <h1 className="text-center text-2xl font-semibold">Update Blog</h1>
        <div className="flex flex-col w-full">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            className="border border-black rounded"
            id="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="content">Content:</label>
          <textarea
            className="border border-black rounded resize-none"
            id="content"
            value={formData.content}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            className="border border-black rounded"
            id="author"
            value={formData.author}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="tags">Tags (comma-separated):</label>
          <input
            type="text"
            className="border border-black rounded"
            id="tags"
            value={formData.tags.join(", ")}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col w-full">
          <label>Cover Image:</label>
          <div className="relative">
            <img
              src={formData.coverImage}
              alt="Cover Preview"
              className="w-48 h-48 object-cover rounded mb-2"
            />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedImage(file);
                  setImageUploadError(null);
                }
              }}
              id="fileInput"
            />
            <button
              type="button"
              onClick={() => document.getElementById("fileInput").click()}
              className="bg-blue-500 text-white rounded p-1"
            >
              Choose Cover Image
            </button>
            {selectedImage && (
              <p className="text-green-500 mt-2">
                Image selected! Click "Update Cover Image" to upload.
              </p>
            )}
            <button
              type="button"
              onClick={handleImageSubmit}
              className="bg-blue-500 text-white rounded mt-2 p-2"
              disabled={!selectedImage || uploading}
            >
              {uploading ? `Uploading... ${uploadProgress}%` : "Update Cover Image"}
            </button>
            {imageUploadError && <p className="text-red-500">{imageUploadError}</p>}
          </div>
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white rounded p-2"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default UpdateBlog;
