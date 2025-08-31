import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import defaultAvatar from "../assets/default-avatar.png";

const ProfileView = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

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
  }, [setUser]); // fetch only when component mounts

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No profile data found.</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center gap-4">
        <img
          src={
            user.avatar
              ? `http://localhost:4000${user.avatar}`
              : defaultAvatar
          }
          alt="User Avatar"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{user.name} <span className="text-[15px] text-gray-800"> - {user.role}</span></h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <p className="mt-4 text-gray-700">{user.bio || "No bio added."}</p>
    </div>
  );
};

export default ProfileView;
