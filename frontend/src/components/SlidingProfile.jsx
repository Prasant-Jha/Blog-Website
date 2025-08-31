import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfilePage from "../pages/ProfilePage";

const SlidingProfile = ({ isOpen, onClose }) => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[90%] sm:w-[400px] bg-sky-100 shadow-lg z-50 transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "translate-x-full"}`
      }
    >
      <div className="flex justify-between items-center p-4 border-b">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-sky-600 text-white px-8 ml-4 py-2 rounded hover:bg-sky-700"
        >
          Logout
        </button>
        <div className="flex items-center gap-3">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-gray-600 text-2xl hover:text-gray-900"
          >
            &times;
          </button>
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100%-64px)] p-4">
        <ProfilePage />
      </div>
    </div>
  );
};

export default SlidingProfile;
