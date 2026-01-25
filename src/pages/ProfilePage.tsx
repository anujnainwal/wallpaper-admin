import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaSave,
  FaUserCircle,
  FaShieldAlt,
  FaDesktop,
  FaMobileAlt,
  FaTabletAlt,
  FaMapMarkerAlt,
  FaClock,
  FaSignOutAlt,
  FaCheckCircle,
  FaCamera,
} from "react-icons/fa";
import Modal from "../components/common/Modal";
import { notifySuccess } from "../utils/toastUtils";

type ProfileFormData = {
  name: string;
  email: string;
  phone: string;
  role: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ActiveSession = {
  id: number;
  device: string;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
};

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "sessions"
  >("profile");

  // Mock current user data
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "John Doe",
    email: "john.doe@admin.com",
    phone: "+1 555-0123",
    role: "Super Admin",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Mock active sessions
  const [sessions] = useState<ActiveSession[]>([
    {
      id: 1,
      device: "MacBook Pro",
      deviceType: "desktop",
      browser: "Chrome 120.0",
      location: "San Francisco, CA",
      ipAddress: "192.168.1.1",
      lastActive: "Active now",
      isCurrent: true,
    },
    {
      id: 2,
      device: "iPhone 15 Pro",
      deviceType: "mobile",
      browser: "Safari 17.2",
      location: "San Francisco, CA",
      ipAddress: "192.168.1.45",
      lastActive: "2 hours ago",
      isCurrent: false,
    },
    {
      id: 3,
      device: "iPad Air",
      deviceType: "tablet",
      browser: "Safari 17.1",
      location: "Los Angeles, CA",
      ipAddress: "192.168.2.10",
      lastActive: "1 day ago",
      isCurrent: false,
    },
  ]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProfileFormData, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ProfileFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProfileFormData, string>> = {};

    if (activeTab === "profile") {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
      if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    }

    if (activeTab === "security") {
      if (!formData.currentPassword)
        newErrors.currentPassword = "Current password is required";
      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Profile updated:", formData);
      if (activeTab === "security") {
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }
    }
  };

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [sessionToLogout, setSessionToLogout] = useState<number | null>(null);

  const confirmLogoutSession = (sessionId: number) => {
    setSessionToLogout(sessionId);
    setLogoutModalOpen(true);
  };

  const handleLogoutSession = () => {
    if (sessionToLogout) {
      console.log("Logging out session:", sessionToLogout);
      notifySuccess("Session logged out successfully");
      setLogoutModalOpen(false);
      setSessionToLogout(null);
      // Here you would also update the sessions state to remove the session
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "desktop":
        return <FaDesktop size={20} />;
      case "mobile":
        return <FaMobileAlt size={20} />;
      case "tablet":
        return <FaTabletAlt size={20} />;
      default:
        return <FaDesktop size={20} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          My Profile
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your personal information, security, and active sessions
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
        {/* Full Width Cover Image */}
        <div className="relative h-64 sm:h-80 bg-black group">
          <img
            src="https://media.giphy.com/media/LpXYk1y8yF43Z280m2/giphy.gif"
            alt="Cover"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"></div>

          {/* Cover Image Upload Button */}
          <label
            htmlFor="cover-image-upload"
            className="absolute top-4 right-4 p-2.5 bg-black/50 hover:bg-black/70 rounded-lg cursor-pointer transition-all opacity-0 group-hover:opacity-100"
            title="Change cover image"
          >
            <FaCamera className="text-white" size={16} />
          </label>
          <input
            id="cover-image-upload"
            type="file"
            className="hidden"
            accept="image/*"
            // onChange={handleCoverImageUpload}
          />

          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* Profile Picture */}
            <div className="relative w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-white shadow-lg overflow-hidden shrink-0">
              <img
                src="https://api.dicebear.com/7.x/initials/svg?seed=JD&backgroundColor=6366f1,a855f7&backgroundType=gradientLinear"
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <label
                htmlFor="profile-picture-upload"
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                title="Upload new picture"
              >
                <FaUserCircle size={32} className="text-white" />
              </label>
              <input
                id="profile-picture-upload"
                type="file"
                className="hidden"
                accept="image/*"
                // onChange={handleProfilePictureUpload}
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-white mb-2">
              <h1 className="text-3xl font-bold">{formData.name}</h1>
              <p className="opacity-90 flex items-center gap-2 mt-1">
                {formData.email}
                <span className="w-1 h-1 rounded-full bg-white/60"></span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm border border-white/20">
                  {formData.role}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Inside the card, below header) */}
        <div className="px-6 sm:px-8 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex flex-wrap gap-6 -mb-px">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === "profile"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FaUser size={14} />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`py-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === "security"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FaLock size={14} />
              Security
            </button>
            <button
              onClick={() => setActiveTab("sessions")}
              className={`py-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === "sessions"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FaDesktop size={14} />
              Active Sessions
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                {sessions.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Tab Content */}
        <form onSubmit={handleSubmit}>
          {/* Profile Information Tab */}
          {activeTab === "profile" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-colors duration-300">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Personal Information
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Update your personal details here.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-medium text-white bg-black dark:bg-white dark:text-black hover:opacity-80 rounded-xl transition-all flex items-center gap-2"
                >
                  <FaSave />
                  Save Changes
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-gray-100 ${
                      errors.name
                        ? "border-red-300 dark:border-red-600"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope
                        className="text-gray-400 dark:text-gray-500"
                        size={14}
                      />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-gray-100 ${
                        errors.email
                          ? "border-red-300 dark:border-red-600"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaPhone
                        className="text-gray-400 dark:text-gray-500"
                        size={14}
                      />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-gray-100 ${
                        errors.phone
                          ? "border-red-300 dark:border-red-600"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                      placeholder="+1 555-0123"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-colors duration-300">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Change Password
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Ensure your account is using a long, random password to stay
                    secure.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-medium text-white bg-black dark:bg-white dark:text-black hover:opacity-80 rounded-xl transition-all flex items-center gap-2"
                >
                  <FaSave />
                  Update Password
                </button>
              </div>

              <div className="space-y-5 max-w-2xl">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-gray-100 ${
                      errors.currentPassword
                        ? "border-red-300 dark:border-red-600"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    placeholder="Enter current password"
                  />
                  {errors.currentPassword && (
                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-gray-100 ${
                      errors.newPassword
                        ? "border-red-300 dark:border-red-600"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    placeholder="Enter new password (min. 8 characters)"
                  />
                  {errors.newPassword && (
                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-gray-100 ${
                      errors.confirmPassword
                        ? "border-red-300 dark:border-red-600"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Active Sessions Tab */}
          {activeTab === "sessions" && (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {session.device}
                        </h3>
                        {session.isCurrent && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                            <FaCheckCircle className="mr-1" size={8} />
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {session.browser}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1 gap-x-6 text-xs">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <FaMapMarkerAlt size={12} />
                          {session.location}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <FaDesktop size={12} />
                          {session.ipAddress}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <FaClock size={12} />
                          {session.lastActive}
                        </div>
                      </div>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        confirmLogoutSession(session.id);
                      }}
                      className="self-start sm:self-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FaSignOutAlt size={12} />
                      Logout
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Logout Session"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <button
              onClick={() => setLogoutModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={handleLogoutSession}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        }
      >
        <p className="text-gray-600 dark:text-gray-300">
          Are you sure you want to logout this session? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
};

export default ProfilePage;
