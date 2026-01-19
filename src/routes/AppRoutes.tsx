import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/storeHook";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import Home from "../pages/dashboard/Home";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

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
        {/* Add more dashboard routes here */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
