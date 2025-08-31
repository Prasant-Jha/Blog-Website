import React, { useState, useContext } from "react";
import TiptapEditor from "../components/Editor";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Write = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null); // NEW state
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 text-center text-xl font-semibold">
        Please log in to create a blog post.
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 text-center text-xl font-semibold text-red-600">
        Access Denied — Admins Only
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !category || !content.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData(); // Using FormData for file upload
      formData.append("title", title.trim());
      formData.append("category", category);
      formData.append("content", content.trim());
      if (coverImage) formData.append("coverImage", coverImage);

      const res = await fetch("http://localhost:4000/api/blogs/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Blog created successfully!");
        setTitle("");
        setCategory("");
        setContent("");
        setCoverImage(null);
        navigate("/");
      } else {
        alert(data.message || "❌ Error creating blog");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Write a New Blog Post</h1>
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
          {loading ? "Publishing..." : "Publish"}
        </button>
      </form>
    </div>
  );
};

export default Write;
