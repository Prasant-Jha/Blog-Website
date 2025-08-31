import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import defaultAvatar from "../assets/default-avatar.png";
import { useNavigate, NavLink } from "react-router-dom";

const Navbar = ({ onProfileToggle }) => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const homePage = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:4000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setUser]);

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      {/* Logo / Home */}
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={homePage}
      >
        My Blog
      </h1>

      {/* Admin Navigation Links */}
      {user?.role === "admin" && (
        <div className="flex gap-6">
          <NavLink
            to="/adminDashboard"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold border-blue-600"
                : "hover:text-blue-600"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/manageBlogs"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold border-blue-600"
                : "hover:text-blue-600"
            }
          >
            Manage Blogs
          </NavLink>
          <NavLink
            to="/manageUsers"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold border-blue-600"
                : "hover:text-blue-600"
            }
          >
            Manage Users
          </NavLink>
          <NavLink
            to="/write"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold border-blue-600"
                : "hover:text-blue-600"
            }
          >
            Write
          </NavLink>
        </div>
      )}

      {/* Profile / Login */}
      <div className="flex items-center gap-4">
        {user ? (
          <img
            src={
              user.avatar
                ? `http://localhost:4000${user.avatar}`
                : defaultAvatar
            }
            alt="Profile"
            onClick={onProfileToggle}
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
          />
        ) : (
          <div className="flex gap-4">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "bg-blue-700 text-white px-4 py-2 rounded"
                  : "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                isActive
                  ? "bg-blue-700 text-white px-4 py-2 rounded"
                  : "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              }
            >
              Signup
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
