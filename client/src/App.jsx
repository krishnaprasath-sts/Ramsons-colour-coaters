import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Infrastructure from './pages/Infrastructure';
import Contact from './pages/Contact';
import Blogs from './pages/Blogs';
import ViewBlog from './pages/ViewBlog';

// Admin Pages
import AdminLogin from './admin/AdminLogin';
import DashboardHome from './admin/DashboardHome';
import BlogManage from './admin/BlogManage';
import BlogEdit from './admin/BlogEdit';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Public Website Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/Home" element={<Home />} />

      <Route path="/about" element={<About />} />
      <Route path="/About" element={<About />} />

      <Route path="/services" element={<Services />} />
      <Route path="/Services" element={<Services />} />

      <Route path="/infrastructure" element={<Infrastructure />} />
      <Route path="/Infrastructure" element={<Infrastructure />} />

      <Route path="/contact" element={<Contact />} />
      <Route path="/Contact" element={<Contact />} />

      <Route path="/blogs" element={<Blogs />} />
      <Route path="/Blogs" element={<Blogs />} />

      <Route path="/viewblog" element={<ViewBlog />} />
      <Route path="/viewblog/:id" element={<ViewBlog />} />
      <Route path="/viewblog.php" element={<ViewBlog />} />

      {/* Admin Dashboard Routes */}
      <Route path="/dashboard" element={<AdminLogin />} />
      <Route path="/dashboard/login" element={<AdminLogin />} />
      <Route path="/dashboard/index.php" element={<AdminLogin />} />

      <Route path="/dashboard/home" element={<DashboardHome />} />
      <Route path="/dashboard/dashboard" element={<DashboardHome />} />
      <Route path="/dashboard/dashboard.php" element={<DashboardHome />} />

      <Route path="/dashboard/category" element={<BlogManage />} />
      <Route path="/dashboard/category.php" element={<BlogManage />} />

      <Route path="/dashboard/categoryEdit/:id" element={<BlogEdit />} />
      <Route path="/dashboard/categoryEdit.php" element={<BlogEdit />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}
