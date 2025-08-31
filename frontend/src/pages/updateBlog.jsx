import React, { useState, useEffect, useContext } from "react";
import TiptapEditor from "../components/Editor";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const UpdateBlog = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null); // New file upload
  const [existingCover, setExistingCover] = useState(null); // URL of current cover image
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // loading blog data

  // Fetch existing blog data on mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:4000/api/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (res.ok) {
          setTitle(data.title);
          setCategory(data.category);
          setContent(data.content);
          setExistingCover(data.coverImage ? `http://localhost:4000${data.coverImage}` : null);
        } else {
          alert(data.message || "Failed to fetch blog data");
          navigate("/");
        }
      } catch (error) {
        console.error(error);
        alert("Error fetching blog data");
        navigate("/");
      } finally {
        setFetching(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !category || !content.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("category", category);
      formData.append("content", content.trim());
      if (coverImage) formData.append("coverImage", coverImage);

      const res = await fetch(`http://localhost:4000/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Blog updated successfully!");
        navigate(`/manageBlogs`);
      } else {
        alert(data.message || "❌ Error updating blog");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while fetching blog data
  if (fetching) {
    return <div className="text-center mt-10 text-xl font-semibold">Loading blog data...</div>;
  }

  return (
    <>
      {!user ? (
        <div className="max-w-4xl mx-auto mt-10 p-6 text-center text-xl font-semibold">
          Please log in to update a blog post.
        </div>
      ) : user.role !== "admin" ? (
        <div className="max-w-4xl mx-auto mt-10 p-6 text-center text-xl font-semibold text-red-600">
          Access Denied — Admins Only
        </div>
      ) : (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Update Blog Post</h1>
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <input
              type="text"
              placeholder="Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              required
            />

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              required
            >
              <option value="">Select Category</option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
              <option value="Education">Education</option>
            </select>

            {/* Cover Image Preview */}
            {existingCover && (
              <div className="mb-4">
                <p className="mb-2 font-semibold">Current Cover Image:</p>
                <img
                  src={existingCover}
                  alt="Current Cover"
                  className="w-full max-h-64 object-cover rounded"
                />
              </div>
            )}

            {/* Cover Image Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="w-full p-2 mb-4 border rounded"
            />

            {/* Content Editor */}
            <div className="mb-4">
              <TiptapEditor content={content} onChange={setContent} />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default UpdateBlog;
