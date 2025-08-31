import React from "react";

const Categories = ({ categories, selectedCategory, onSelect }) => {
  return (
    <section className="flex flex-wrap justify-center gap-3 my-6 px-4">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full border ${
            selectedCategory === cat
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border-blue-600"
          }`}
        >
          {cat}
        </button>
      ))}
    </section>
  );
};

export default Categories;