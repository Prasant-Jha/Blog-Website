import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm">&copy; {new Date().getFullYear()} MyBlog. All rights reserved.</p>

        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="/" className="hover:text-white transition">Home</a>
          <a href="/about" className="hover:text-white transition">About</a>
          <a href="/contact" className="hover:text-white transition">Contact</a>
          <a href="/privacy" className="hover:text-white transition">Privacy</a>
          <a href="https://github.com/Prasant-Jha" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
