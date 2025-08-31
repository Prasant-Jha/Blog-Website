import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [totalViews, setTotalViews] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [blogStats, setBlogStats] = useState([]); // blogs grouped by month
  const [viewsStats, setViewsStats] = useState([]); // views grouped by month
  const [userStats, setUserStats] = useState([]); // signups grouped by month

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Fetch totals
      const usersRes = await axios.get("http://localhost:4000/api/stats/total-users", config);
      const blogsRes = await axios.get("http://localhost:4000/api/stats/total-blogs", config);
      const viewsRes = await axios.get("http://localhost:4000/api/stats/total-views", config);

      // Fetch full lists (to build charts)
      const blogsListRes = await axios.get("http://localhost:4000/api/blogs", config);
      const usersListRes = await axios.get("http://localhost:4000/api/auth/users", config);

      setTotalUsers(usersRes.data.totalUsers);
      setTotalBlogs(blogsRes.data.totalBlogs);
      setTotalViews(viewsRes.data.totalViews);

      // Group blogs by month
      const blogCounts = {};
      blogsListRes.data.forEach((blog) => {
        const month = new Date(blog.createdAt).toLocaleString("default", { month: "short" });
        blogCounts[month] = (blogCounts[month] || 0) + 1;
      });
      setBlogStats(Object.entries(blogCounts));

      // Group views by month (from blogs)
      const viewsCounts = {};
      blogsListRes.data.forEach((blog) => {
        const month = new Date(blog.createdAt).toLocaleString("default", { month: "short" });
        viewsCounts[month] = (viewsCounts[month] || 0) + (blog.views || 0);
      });
      setViewsStats(Object.entries(viewsCounts));

      // Group users by month
      const userCounts = {};
      usersListRes.data.forEach((user) => {
        const month = new Date(user.createdAt).toLocaleString("default", { month: "short" });
        userCounts[month] = (userCounts[month] || 0) + 1;
      });
      setUserStats(Object.entries(userCounts));
    } catch (error) {
      console.error("Error fetching dashboard data:", error.response?.data || error.message);
    }
  };

  // Blogs over time
  const barChartData = {
    labels: blogStats.map(([month]) => month),
    datasets: [
      {
        label: "Blogs Created",
        data: blogStats.map(([, count]) => count),
        backgroundColor: "#4f46e5",
      },
    ],
  };

  // Blogs vs Users
  const doughnutData = {
    labels: ["Blogs", "Users"],
    datasets: [
      {
        label: "Distribution",
        data: [totalBlogs, totalUsers],
        backgroundColor: ["#10b981", "#f59e0b"],
      },
    ],
  };

  // Views over time
  const lineChartData = {
    labels: viewsStats.map(([month]) => month),
    datasets: [
      {
        label: "Views Over Time",
        data: viewsStats.map(([, count]) => count),
        borderColor: "#f43f5e",
        backgroundColor: "rgba(244, 63, 94, 0.3)",
        fill: true,
      },
    ],
  };

  // User signups
  const userBarChartData = {
    labels: userStats.map(([month]) => month),
    datasets: [
      {
        label: "User Signups",
        data: userStats.map(([, count]) => count),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-gray-500">Total Views</h2>
          <p className="text-xl font-bold">{totalViews}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-gray-500">Total Users</h2>
          <p className="text-xl font-bold">{totalUsers}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-lg">
          <h2 className="text-gray-500">Total Blogs</h2>
          <p className="text-xl font-bold">{totalBlogs}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <div className="bg-white p-3 rounded-lg shadow h-[300px]">
          <h2 className="mb-2 font-bold text-sm">Blogs Over Time</h2>
          <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
        </div>

        <div className="bg-white p-3 rounded-lg shadow h-[300px]">
          <h2 className="mb-2 font-bold text-sm">Blogs vs Users</h2>
          <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
        </div>

        <div className="bg-white p-3 rounded-lg shadow h-[300px]">
          <h2 className="mb-2 font-bold text-sm">Views Over Time</h2>
          <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
        </div>

        <div className="bg-white p-3 rounded-lg shadow h-[300px]">
          <h2 className="mb-2 font-bold text-sm">User Signups</h2>
          <Bar data={userBarChartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
