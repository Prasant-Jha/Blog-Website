import React, { useState } from "react";
import ProfileView from "../components/ProfileView";
import EditProfileForm from "../components/EditProfileForm";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          {isEditing ? "View Profile" : "Edit Profile"}
        </button>
      </div>

      {isEditing ? <EditProfileForm /> : <ProfileView />}
    </div>
  );
};

export default ProfilePage;
