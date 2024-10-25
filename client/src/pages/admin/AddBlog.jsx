import React, { useState } from "react";

const AddBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    tags: "",
    coverImage: "", // Single cover image
  });

  const [image, setImage] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploadPercent, setImageUploadPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // Handling form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle image upload
  const handleImageSubmit = () => {
    if (image) {
      setUploading(true);
      setImageUploadError(false);
      storeImage(image)
        .then((url) => {
          setFormData({
            ...formData,
            coverImage: url,
          });
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError("Image upload failed (2mb max)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You must upload a cover image");
    }
  };

  // Cloudinary image upload function
  const storeImage = async (file) => {
    const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dkxmweeur/image/upload";
    const CLOUDINARY_UPLOAD_PRESET = "kwdcfqd4";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", CLOUDINARY_URL, true);
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url); // Secure URL of the uploaded image
        } else {
          reject(new Error("Upload failed"));
        }
      };

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setImageUploadPercent(progress);
        }
      };

      xhr.send(formData);
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.coverImage) {
      alert("You must upload a cover image");
      return;
    }

    if (formData.title === "" || formData.content === "" || formData.author === "") {
      alert("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const res = await fetch(`${API_URL}/api/blog/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(","),
        }),
      });

      const data = await res.json();

      if (!data?.success) {
        setError(data?.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setError(false);
      alert("Blog created successfully");
      setFormData({
        title: "",
        content: "",
        author: "",
        tags: "",
        coverImage: "",
      });
      setImage(null);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center p-3">
      <form
        onSubmit={handleSubmit}
        className="w-4/5 shadow-md rounded-xl p-3 gap-2 flex flex-col items-center"
      >
        <h1 className="text-center text-2xl font-semibold">Add Blog</h1>
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
            value={formData.tags}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="coverImage">
            Cover Image:
            <span className="text-red-700 text-sm">
              (Image size should be less than 2mb)
            </span>
          </label>
          <input
            type="file"
            className="border border-black rounded"
            id="coverImage"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        {imageUploadError && <span className="text-red-600 w-full">{imageUploadError}</span>}
        <button
          hidden={!image}
          disabled={uploading || loading}
          className="bg-green-700 p-3 rounded text-white hover:opacity-95 disabled:opacity-80 w-full"
          type="button"
          onClick={handleImageSubmit}
        >
          {uploading ? `Uploading...(${imageUploadPercent}%)` : "Upload Image"}
        </button>
        <button
          disabled={uploading || loading}
          className="bg-green-700 p-3 rounded text-white hover:opacity-95 disabled:opacity-80 w-full"
        >
          {loading ? "Loading..." : "Add Blog"}
        </button>
        {formData.coverImage && (
          <div className="p-3 w-full flex flex-col justify-center">
            <div className="shadow-xl rounded-lg p-1 flex flex-wrap my-2 justify-between">
              <img src={formData.coverImage} alt="Cover" className="h-20 w-20 rounded" />
              <button
                onClick={() => setFormData({ ...formData, coverImage: "" })}
                className="p-2 text-red-500 hover:cursor-pointer hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddBlog;
