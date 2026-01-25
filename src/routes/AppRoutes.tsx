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
import TempTablePage from "../pages/TempTablePage";
import ApiTablePage from "../pages/ApiTablePage";
import WallpaperListPage from "../pages/WallpaperListPage";
import AddWallpaperPage from "../pages/AddWallpaperPage";
import UserList from "../pages/users/UserList";
import AddUser from "../pages/users/AddUser";
import AppUserList from "../pages/app-users/AppUserList";
import AppUserDetail from "../pages/app-users/AppUserDetail";
import AddAppUser from "../pages/app-users/AddAppUser";
import RoleList from "../pages/roles/RoleList";
import AddRole from "../pages/roles/AddRole";
import ProfilePage from "../pages/ProfilePage";
import FeedbackList from "../pages/feedback/FeedbackList";
import NotFoundPage from "../pages/error/NotFoundPage";
import ForbiddenPage from "../pages/error/ForbiddenPage";
import AuditLogList from "../pages/audit-logs/AuditLogList";
import IntegrationSettings from "../pages/settings/IntegrationSettings";

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppRoutes: React.FC = () => {
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
        <Route
          path="wallpapers"
          element={<Navigate to="wallpapers/list" replace />}
        />
        <Route path="wallpapers/list" element={<WallpaperListPage />} />
        <Route path="wallpapers/add" element={<AddWallpaperPage />} />

        {/* Legal & Support */}
        <Route path="legal" element={<LegalDocuments />} />
        <Route path="about" element={<About />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="help" element={<HelpSupport />} />
        <Route path="temp-table" element={<TempTablePage />} />
        <Route path="api-table" element={<ApiTablePage />} />
        <Route path="system/audit-logs" element={<AuditLogList />} />

        {/* User Management */}
        <Route path="users/list" element={<UserList />} />
        <Route path="users/add" element={<AddUser />} />
        <Route path="users/edit/:id" element={<AddUser />} />

        {/* App Users */}
        <Route path="app-users/list" element={<AppUserList />} />
        <Route path="app-users/add" element={<AddAppUser />} />
        <Route path="app-users/edit/:id" element={<AddAppUser />} />
        <Route path="app-users/:id" element={<AppUserDetail />} />

        {/* Roles & Permissions */}
        <Route path="roles/list" element={<RoleList />} />
        <Route path="roles/add" element={<AddRole />} />
        <Route path="roles/edit/:id" element={<AddRole />} />

        {/* Settings */}
        <Route path="settings/integrations" element={<IntegrationSettings />} />

        {/* Profile */}
        <Route path="profile" element={<ProfilePage />} />

        {/* Feedback */}
        <Route path="feedback/list" element={<FeedbackList />} />

        {/* Add more dashboard routes here */}
      </Route>

      {/* Fallback */}
      {/* Error Pages */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
