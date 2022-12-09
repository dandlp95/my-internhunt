import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import PostsPage from "./pages/posts";
import AccountPortal from "./pages/accountPortal";
import AboutPage from "./pages/aboutPage";
import Guidelines from "./pages/guidelines";
import PostPage from "./pages/postPage";
import CreatePost from "./pages/createPost";
import MajorsPage from "./pages/majorsPage";
import ResetPasswordPage from "./pages/resetPasswordPage";
import ForgotPassword from "./pages/forgotPassword";
import PersonalSettings from "./pages/personalSettings";

const router = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/account-portal/:id" element={<AccountPortal />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/guidelines" element={<Guidelines />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/majors" element={<MajorsPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/account-settings" element={<PersonalSettings />} />
      </Routes>
    </Router>
  );
};

export default router;
