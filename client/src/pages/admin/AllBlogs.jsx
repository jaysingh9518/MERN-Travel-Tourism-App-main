import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const getBlogs = async () => {
    setBlogs([]);
    try {
      setLoading(true);
      let url =
        filter === "featured" // featured
          ? `${API_URL}/api/blog?searchTerm=${search}&featured=true`
          : filter === "latest" // latest
          ? `${API_URL}/api/blog?searchTerm=${search}&sort=createdAt`
          : filter === "top" // top rated
          ? `${API_URL}/api/blog?searchTerm=${search}&sort=blogRating`
          : `${API_URL}/api/blog?searchTerm=${search}`; // all
      const res = await fetch(url);
      const data = await res.json();
      if (data?.success) {
        setBlogs(data?.blogs);
        setLoading(false);
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
      if (data?.blogs?.length > 8) {
        setShowMoreBtn(true);
      } else {
        setShowMoreBtn(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onShowMoreClick = async () => {
    const numberOfBlogs = blogs.length;
    const startIndex = numberOfBlogs;
    let url =
      filter === "featured"
        ? `${API_URL}/api/blog?searchTerm=${search}&featured=true&startIndex=${startIndex}`
        : filter === "latest"
        ? `${API_URL}/api/blog?searchTerm=${search}&sort=createdAt&startIndex=${startIndex}`
        : filter === "top"
        ? `${API_URL}/api/blog?searchTerm=${search}&sort=blogRating&startIndex=${startIndex}`
        : `${API_URL}/api/blog?searchTerm=${search}&startIndex=${startIndex}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data?.blogs?.length < 9) {
      setShowMoreBtn(false);
    }
    setBlogs([...blogs, ...data?.blogs]);
  };

  useEffect(() => {
    getBlogs();
  }, [filter, search]);

  const handleDelete = async (blogId) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/blog/delete/${blogId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data?.message);
      getBlogs();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="shadow-xl rounded-lg w-full flex flex-col p-5 justify-center gap-2">
      {loading && <h1 className="text-center text-lg">Loading...</h1>}
      {blogs && (
        <>
          <div>
            <input
              className="p-2 rounded border"
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="my-2 border-y-2 py-2">
            <ul className="w-full flex justify-around">
              <li
                className={`cursor-pointer hover:scale-95 border rounded-xl p-2 transition-all duration-300 ${
                  filter === "all" && "bg-blue-500 text-white"
                }`}
                id="all"
                onClick={(e) => setFilter(e.target.id)}
              >
                All
              </li>
              <li
                className={`cursor-pointer hover:scale-95 border rounded-xl p-2 transition-all duration-300 ${
                  filter === "featured" && "bg-blue-500 text-white"
                }`}
                id="featured"
                onClick={(e) => setFilter(e.target.id)}
              >
                Featured
              </li>
              <li
                className={`cursor-pointer hover:scale-95 border rounded-xl p-2 transition-all duration-300 ${
                  filter === "latest" && "bg-blue-500 text-white"
                }`}
                id="latest"
                onClick={(e) => setFilter(e.target.id)}
              >
                Latest
              </li>
              <li
                className={`cursor-pointer hover:scale-95 border rounded-xl p-2 transition-all duration-300 ${
                  filter === "top" && "bg-blue-500 text-white"
                }`}
                id="top"
                onClick={(e) => setFilter(e.target.id)}
              >
                Top Rated
              </li>
            </ul>
          </div>
        </>
      )}

      {/* Blogs */}
      {blogs ? (
        blogs.map((blog, i) => (
          <div
            className="border rounded-lg w-full flex p-3 justify-between items-center hover:scale-[1.02] transition-all duration-300"
            key={i}
          >
            <Link to={`/blog/${blog._id}`}>
              <img
                src={blog?.coverImage}
                alt="Blog"
                className="w-20 h-20 rounded"
              />
            </Link>
            <Link to={`/blog/${blog._id}`}>
              <p className="font-semibold hover:underline">{blog?.title}</p>
            </Link>
            <div className="flex flex-col">
              <Link to={`/profile/admin/update-blog/${blog._id}`}>
                <button
                  disabled={loading}
                  className="text-blue-600 hover:underline"
                >
                  {loading ? "Loading..." : "Edit"}
                </button>
              </Link>
              <button
                disabled={loading}
                onClick={() => handleDelete(blog?._id)}
                className="text-red-600 hover:underline"
              >
                {loading ? "Loading..." : "Delete"}
              </button>
            </div>
          </div>
        ))
      ) : (
        <h1 className="text-center text-2xl">No Blogs Yet!</h1>
      )}

      {showMoreBtn && (
        <button
          onClick={onShowMoreClick}
          className="text-sm bg-green-700 text-white hover:underline p-2 m-3 rounded text-center w-max"
        >
          Show More
        </button>
      )}
    </div>
  );
};

export default AllBlogs;
