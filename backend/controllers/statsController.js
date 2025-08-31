import User from "../models/User.js";
import Blog from "../models/Blog.js";

// Get total users
export const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get total blogs
export const getTotalBlogs = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    res.json({ totalBlogs });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get total views
export const getTotalViews = async (req, res) => {
  try {
    const result = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: { $ifNull: ["$views", 0] } },
        },
      },
    ]);

    const totalViews = result.length > 0 ? result[0].totalViews : 0;

    res.status(200).json({ success: true, totalViews });
  } catch (error) {
    console.error("Error fetching total views:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch total views",
      error: error.message,
    });
  }
};

