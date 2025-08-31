import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import BlogCard from "../components/BlogCard";
import Pagination from "../components/Pagination";

const categories = ["All", "Technology", "Health", "Travel", "Food", "Education"];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const postsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        let url = "http://localhost:4000/api/blogs"; // your backend URL
        if (selectedCategory !== "All") {
          url += `?category=${selectedCategory}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [selectedCategory]);

  const filteredBlogs = blogs; // backend already filters by category
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);

  if (loading) {
    return <p className="text-center py-10">Loading blogs...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Hero />
      <Categories
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={(cat) => {
          setSelectedCategory(cat);
          setCurrentPage(1);
        }}
      />
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-4">
        {paginatedBlogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </section>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Home;
