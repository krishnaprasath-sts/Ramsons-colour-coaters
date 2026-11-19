import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { getToken } from './lib/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HomeImages from './pages/HomeImages';
import Enquiries from './pages/Enquiries';
import BlogList from './pages/BlogList';
import BlogForm from './pages/BlogForm';
import Services from './pages/Services';

// Pages inside this route are only shown to a signed-in admin.
function RequireAuth() {
  return getToken() ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/home-images" element={<HomeImages />} />
        <Route path="/home-banners" element={<HomeImages />} />
        <Route path="/services" element={<Services />} />
        <Route path="/enquiries" element={<Enquiries />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/new" element={<BlogForm />} />
        <Route path="/blogs/edit/:id" element={<BlogForm />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
