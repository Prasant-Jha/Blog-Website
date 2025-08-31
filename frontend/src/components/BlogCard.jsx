import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const previewContent =
    blog.content.length > 100
      ? blog.content.substring(0, 100) + "..."
      : blog.content;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition">
      {/* Cover Image */}
      {blog.coverImage && (
        <div className="relative w-full pt-[56.25%] rounded-t-lg overflow-hidden">
          <img
            src={`http://localhost:4000${blog.coverImage}`}
            alt={blog.title}
            className="absolute top-0 left-0 w-full h-full object-cover object-center"
          />
        </div>
      )}

      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{blog.title}</h3>
        <p className="text-gray-500 text-sm mb-2">
          By {blog.author?.name || "Unknown"} | {blog.category}
        </p>

        {/* Render HTML so inline images work */}
        <div
          className="text-gray-600 mb-4 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: previewContent }}
        ></div>

        <Link
          to={`/blog/${blog._id}`}
          className="text-blue-600 hover:underline"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
