import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const EditProfileForm = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("bio", formData.bio);
      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile);
      }

      const res = await axios.put(
        "http://localhost:4000/api/auth/profile",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(res.data);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md p-6 rounded-lg space-y-4"
    >
      <h2 className="text-lg font-bold">Edit Profile</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
        required
      />


      <textarea
        name="bio"
        placeholder="Short Bio"
        value={formData.bio}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded resize-none"
        rows={4}
      />

      <input
        type="file"
        name="avatar"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full border px-4 py-2 rounded resize-none"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </form>
  );
};

export default EditProfileForm;
