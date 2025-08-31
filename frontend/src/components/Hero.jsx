import React from "react";

const Hero = () => {
  return (
    <section className="text-center py-12 bg-gray-50">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to MyBlog</h2>
      <p className="text-gray-600 mb-6">Read the latest articles on tech, travel, food, and more!</p>
      <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Explore Blogs</button>
    </section>
  );
};

export default Hero;
