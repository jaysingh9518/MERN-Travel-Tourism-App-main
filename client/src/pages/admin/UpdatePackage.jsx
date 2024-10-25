import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const UpdatePackage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "",
    packageMeals: "",
    packageActivities: "",
    packagePrice: 500,
    packageDiscountPrice: 0,
    packageOffer: false,
    packageImages: [],
  });
  const [images, setImages] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploadPercent, setImageUploadPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const getPackageData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/package/get-package-data/${params?.id}`);
      const data = await res.json();
      if (data?.success) {
        setFormData({
          packageName: data?.packageData?.packageName,
          packageDescription: data?.packageData?.packageDescription,
          packageDestination: data?.packageData?.packageDestination,
          packageDays: data?.packageData?.packageDays,
          packageNights: data?.packageData?.packageNights,
          packageAccommodation: data?.packageData?.packageAccommodation,
          packageTransportation: data?.packageData?.packageTransportation,
          packageMeals: data?.packageData?.packageMeals,
          packageActivities: data?.packageData?.packageActivities,
          packagePrice: data?.packageData?.packagePrice,
          packageDiscountPrice: data?.packageData?.packageDiscountPrice,
          packageOffer: data?.packageData?.packageOffer,
          packageImages: data?.packageData?.packageImages,
        });
      } else {
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.id) getPackageData();
  }, [params.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (e.target.type === "checkbox") {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
  };

  const handleImageSubmit = () => {
    if (images.length > 0 && images.length + formData.packageImages.length < 6) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < images.length; i++) {
        promises.push(storeImage(images[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            packageImages: formData.packageImages.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 5 images per package");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/dkxmweeur/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "kwdcfqd4");

    try {
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      packageImages: formData.packageImages.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.packageImages.length === 0) {
      alert("You must upload at least 1 image");
      return;
    }
    if (
      formData.packageName === "" ||
      formData.packageDescription === "" ||
      formData.packageDestination === "" ||
      formData.packageAccommodation === "" ||
      formData.packageTransportation === "" ||
      formData.packageMeals === "" ||
      formData.packageActivities === "" ||
      formData.packagePrice === 0
    ) {
      alert("All fields are required!");
      return;
    }
    if (formData.packagePrice < 0) {
      alert("Price should be greater than 500!");
      return;
    }
    if (formData.packageDiscountPrice >= formData.packagePrice) {
      alert("Regular Price should be greater than Discount Price!");
      return;
    }
    if (formData.packageOffer === false) {
      setFormData({ ...formData, packageDiscountPrice: 0 });
    }

    try {
      setLoading(true);
      setError(false);

      const res = await fetch(`${API_URL}/api/package/update-package/${params?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data?.success === false) {
        setError(data?.message);
        setLoading(false);
      }
      setLoading(false);
      setError(false);
      alert(data?.message);
      navigate(`/package/${params?.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="w-full flex flex-wrap justify-center gap-2 p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full sm:w-[60%] shadow-md rounded-xl p-3 gap-2 flex flex-col items-center"
        >
          <h1 className="text-center text-2xl font-semibold">Update Package</h1>
          <div className="flex flex-col w-full">
            <label htmlFor="packageName">Name:</label>
            <input
              type="text"
              className="border border-black rounded"
              id="packageName"
              value={formData?.packageName}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageDescription">Description:</label>
            <textarea
              type="text"
              className="border border-black rounded resize-none"
              id="packageDescription"
              value={formData.packageDescription}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageDestination">Destination:</label>
            <input
              type="text"
              className="border border-black rounded"
              id="packageDestination"
              value={formData.packageDestination}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-wrap w-full gap-2">
            <div className="flex flex-col flex-1">
              <label htmlFor="packageDays">Days:</label>
              <input
                type="number"
                className="border border-black rounded"
                id="packageDays"
                value={formData.packageDays}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col flex-1">
              <label htmlFor="packageNights">Nights:</label>
              <input
                type="number"
                className="border border-black rounded"
                id="packageNights"
                value={formData.packageNights}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageAccommodation">Accommodation:</label>
            <textarea
              type="text"
              className="border border-black rounded resize-none"
              id="packageAccommodation"
              value={formData.packageAccommodation}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageTransportation">
              Transportation: (Selected: {formData?.packageTransportation})
            </label>
            <select
              className="border border-black rounded-lg"
              id="packageTransportation"
              value={formData.packageTransportation}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>Flight</option>
              <option>Train</option>
              <option>Boat</option>
              <option>Other</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageMeals">Meals:</label>
            <textarea
              type="text"
              className="border border-black rounded resize-none"
              id="packageMeals"
              value={formData.packageMeals}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageActivities">Activities:</label>
            <textarea
              type="text"
              className="border border-black rounded resize-none"
              id="packageActivities"
              value={formData.packageActivities}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-wrap w-full gap-2">
            <div className="flex flex-col flex-1">
              <label htmlFor="packagePrice">Price:</label>
              <input
                type="number"
                className="border border-black rounded"
                id="packagePrice"
                value={formData.packagePrice}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col flex-1">
              <label htmlFor="packageDiscountPrice">Discount Price:</label>
              <input
                type="number"
                className="border border-black rounded"
                id="packageDiscountPrice"
                value={formData.packageDiscountPrice}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <label htmlFor="packageOffer">Package Offer</label>
            <input
              type="checkbox"
              id="packageOffer"
              checked={formData.packageOffer}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="packageImages">Upload Images:</label>
            <input
              type="file"
              id="packageImages"
              accept="image/*"
              multiple
              onChange={(e) => setImages(e.target.files)}
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="bg-blue-500 text-white rounded mt-2 p-2"
            >
              Upload Images
            </button>
            {imageUploadError && <p className="text-red-500">{imageUploadError}</p>}
            {uploading && <p>Uploading images... {imageUploadPercent}%</p>}
          </div>
          <div className="flex flex-wrap w-full gap-2">
            {formData.packageImages.length > 0 &&
              formData.packageImages.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt={`Uploaded preview ${index}`} className="w-24 h-24" />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white"
                  >
                    X
                  </button>
                </div>
              ))}
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white rounded p-2"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Package"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </>
  );
};

export default UpdatePackage;
