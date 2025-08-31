import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate(); // ✅ Hook for navigation
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:4000/api/auth/reset-password/${token}`, { password });
      alert("Password reset successfully");

      // ✅ Redirect to login page after success
      navigate("/login");
    } catch (error) {
      alert("Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="Enter new password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition duration-200"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
