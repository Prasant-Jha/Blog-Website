import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AdminBlogDetails = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:4000/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlog(res.data);
    } catch (err) {
      console.error("Error fetching blog:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:4000/api/blogs/${id}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBlog(); // refresh comments
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  if (!blog) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-600 mb-6">
        By {blog.author?.name} ({blog.author?.email})
      </p>

      {/* Likes Section */}
      <h2 className="text-lg font-semibold mb-2">Likes ({blog.likes?.length})</h2>
      <ul className="mb-6 border rounded p-3 bg-gray-50">
        {blog.likes?.length > 0 ? (
          blog.likes.map((user) => (
            <li key={user._id} className="border-b py-1">
              {user.name} ({user.email})
            </li>
          ))
        ) : (
          <p className="text-gray-500">No likes yet.</p>
        )}
      </ul>

      {/* Comments Section */}
      <h2 className="text-lg font-semibold mb-2">
        Comments ({blog.comments?.length})
      </h2>
      <ul className="border rounded p-3 bg-gray-50 space-y-3">
        {blog.comments?.length > 0 ? (
          blog.comments.map((c) => (
            <li
              key={c._id}
              className="flex justify-between items-start border-b pb-2"
            >
              <div>
                <p className="font-semibold">{c.user?.name || "Anonymous"}</p>
                <p className="text-sm">{c.text}</p>
                <small className="text-gray-500">
                  {new Date(c.createdAt).toLocaleString()}
                </small>
              </div>
              <button
                onClick={() => handleDeleteComment(c._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </ul>

      <div className="mt-6">
        <Link
          to="/manageBlogs"
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          ← Back
        </Link>
      </div>
    </div>
  );
};

export default AdminBlogDetails;
