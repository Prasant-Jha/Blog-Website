import { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider, AuthContext } from "./context/AuthContext"; // ✅ include AuthContext
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Navbar from "./components/Navbar";
import SlidingProfile from "./components/SlidingProfile";
import Footer from "./components/Footer";
import Write from "./pages/Write";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import BlogDetail from "./pages/BlogDetail";
import UpdateBlog from "./pages/updateBlog";
import AdminBlogList from "./pages/BlogList";
import ManageUsers from "./pages/ManageUsers";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBlogDetails from "./pages/AdminBlogDetails";

function AppContent() {
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useContext(AuthContext); // ✅ access auth state

  return (
    <Router>
      {/* Navbar always visible */}
      <Navbar onProfileToggle={() => setShowProfile(true)} />

      {/* Main content */}
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected route */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/write" element={<Write />} />
          <Route path="/updateBlog/:id" element={<UpdateBlog />} />
          <Route path="/manageBlogs" element={<AdminBlogList />} />
          <Route path="/manageComments/:id" element={<AdminBlogDetails />} />
          <Route path="/manageUsers" element={<ManageUsers />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <Footer />
      </main>

      {/* ✅ Only render SlidingProfile if user is logged in */}
      {user && (
        <SlidingProfile
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
        />
      )}
      
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
