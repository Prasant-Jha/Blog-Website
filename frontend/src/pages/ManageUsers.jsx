import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ManageUsers = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    console.log(user);

    useEffect(() => {
        fetchUsers();
    }, []);

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token"); // or sessionStorage
            const res = await axios.get("http://localhost:4000/api/auth/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error.response?.data || error.message);
        }
    };


    // Delete a user
    const deleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const token = localStorage.getItem("token"); // Get the stored token
                await axios.delete(`http://localhost:4000/api/auth/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token for admin auth
                    },
                });

                setUsers(users.filter((user) => user._id !== id));
                navigate("/manageUsers");
            } catch (error) {
                console.error("Error deleting user:", error.response?.data || error.message);
            }
        }
    };


    return (
        <div className="p-6 min-h-[75vh]">
            <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Role</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className="text-center">
                            <td className="border p-2">{user.name}</td>
                            <td className="border p-2">{user.email}</td>
                            <td className="border p-2">{user.role}</td>
                            <td className="border p-2">
                                <button
                                    onClick={() => deleteUser(user._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUsers;
