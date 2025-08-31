import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";  // Import Link

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "", email: "", password: ""
  });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/auth/register", formData);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form 
        onSubmit={handleSubmit} 
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg"
        aria-label="Signup Form"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Signup</h2>

        <label className="block mb-2 text-sm font-semibold text-gray-700" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          onChange={handleChange}
          placeholder="Enter your name"
          required
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <label className="block mb-2 text-sm font-semibold text-gray-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={handleChange}
          placeholder="Enter your email"
          required
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <label className="block mb-2 text-sm font-semibold text-gray-700" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Enter your password"
          required
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition duration-300"
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-green-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
