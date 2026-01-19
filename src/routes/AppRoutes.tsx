import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/storeHook";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import Home from "../pages/dashboard/Home";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import NotificationList from "../pages/notifications/NotificationList";
import AddNotification from "../pages/notifications/AddNotification";
import LegalDocuments from "../pages/legal/LegalDocuments";
import About from "../pages/support/About";
import CategoryList from "../pages/content/CategoryList";
import AddCategory from "../pages/content/AddCategory";
import FAQ from "../pages/support/FAQ";
import HelpSupport from "../pages/support/HelpSupport";

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace />;
    }
    return children;
  };

  const PublicRoute = ({ children }: { children: React.ReactElement }) => {
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route index element={<Navigate to="login" replace />} />
      </Route>

      {/* Dashboard Routes (Protected) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="notifications/list" element={<NotificationList />} />
        <Route path="notifications/add" element={<AddNotification />} />

        {/* Content */}
        <Route path="content/categories" element={<CategoryList />} />
        <Route path="content/categories/add" element={<AddCategory />} />

        {/* Legal & Support */}
        <Route path="legal" element={<LegalDocuments />} />
        <Route path="about" element={<About />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="help" element={<HelpSupport />} />
        {/* Add more dashboard routes here */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
