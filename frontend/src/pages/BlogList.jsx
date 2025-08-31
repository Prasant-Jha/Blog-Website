import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AdminBlogList = () => {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);

  // Fetch all blogs
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token"); // or sessionStorage
      const res = await axios.get("http://localhost:4000/api/blogs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogs(res.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  // Delete blog
  const deleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:4000/api/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlogs(blogs.filter((blog) => blog._id !== id));
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  return (
    <div className="p-6 min-h-[75vh]">
      <h1 className="text-2xl font-bold mb-4">Admin Blog Management</h1>

      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Cover</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Author</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Likes</th>
            <th className="border p-2">Comments</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id} className="text-center hover:bg-gray-50">
              <td className="border p-2">
                {blog.coverImage && (
                  <img
                    src={`http://localhost:4000${blog.coverImage}`}
                    alt={blog.title}
                    className="w-16 h-16 object-cover mx-auto rounded"
                  />
                )}
              </td>
              <td className="border p-2 font-medium">{blog.title}</td>
              <td className="border p-2">{blog.author?.name || "Unknown"}</td>
              <td className="border p-2">{blog.category}</td>

              {/* ✅ Likes count */}
              <td className="border p-2 text-blue-600 font-semibold">
                {blog.likes?.length || 0}
              </td>

              {/* ✅ Comments count */}
              <td className="border p-2 text-green-600 font-semibold">
                {blog.comments?.length || 0}
              </td>

              <td className="border p-2 space-x-2">
                <Link
                  to={`/updateBlog/${blog._id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteBlog(blog._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <Link
                  to={`/manageComments/${blog._id}`}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBlogList;
