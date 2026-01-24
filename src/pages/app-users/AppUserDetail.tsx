import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaAndroid,
  FaApple,
  FaMobileAlt,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaCrown,
  FaHeart,
  FaDownload,
  FaClock,
  FaCalendar,
  FaBan,
  FaTrash,
} from "react-icons/fa";
import Modal from "../../components/common/Modal";

// Mock user data (in real app, this would come from API)
const mockUser = {
  id: 1,
  name: "Alex Johnson",
  email: "alex.j@gmail.com",
  phone: "+1 555-0101",
  platform: "iOS" as const,
  subscriptionStatus: "Premium" as const,
  joinedDate: "2023-01-15",
  lastActive: "2024-01-24",
  totalDownloads: 245,
  totalFavorites: 89,
  deviceInfo: "iPhone 15 Pro",
  country: "USA",
  subscriptionStartDate: "2023-06-15",
  subscriptionEndDate: "2024-06-15",
};

const AppUserDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user] = useState(mockUser); // In real app, fetch based on id
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Android":
        return (
          <FaAndroid className="text-green-500 dark:text-green-400" size={24} />
        );
      case "iOS":
        return (
          <FaApple className="text-gray-900 dark:text-gray-100" size={24} />
        );
      case "Both":
        return (
          <FaMobileAlt
            className="text-indigo-500 dark:text-indigo-400"
            size={24}
          />
        );
      default:
        return (
          <FaMobileAlt className="text-gray-500 dark:text-gray-400" size={24} />
        );
    }
  };

  const handleSuspend = () => {
    // TODO: API call to suspend user
    console.log("Suspending user:", id);
    setSuspendModalOpen(false);
  };

  const handleDelete = () => {
    // TODO: API call to delete user
    console.log("Deleting user:", id);
    setDeleteModalOpen(false);
    navigate("/app-users/list");
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/app-users/list")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
        >
          <FaArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            User Details
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View and manage app user information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Contact */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-3xl mb-4">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                User ID: #{id}
              </p>

              {/* Subscription Badge */}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  user.subscriptionStatus === "Premium"
                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                    : user.subscriptionStatus === "Free"
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                      : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                }`}
              >
                {user.subscriptionStatus === "Premium" && (
                  <FaCrown className="mr-1" size={10} />
                )}
                {user.subscriptionStatus}
              </span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                  <FaEnvelope className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <FaPhone className="text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <FaGlobe className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Country
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Activity Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <FaDownload
                  className="mx-auto mb-2 text-purple-600 dark:text-purple-400"
                  size={24}
                />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {user.totalDownloads}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Downloads
                </p>
              </div>

              <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                <FaHeart
                  className="mx-auto mb-2 text-pink-600 dark:text-pink-400"
                  size={24}
                />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {user.totalFavorites}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Favorites
                </p>
              </div>

              <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                <FaCalendar
                  className="mx-auto mb-2 text-indigo-600 dark:text-indigo-400"
                  size={24}
                />
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {user.joinedDate}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Joined
                </p>
              </div>

              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <FaClock
                  className="mx-auto mb-2 text-green-600 dark:text-green-400"
                  size={24}
                />
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {user.lastActive}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Last Active
                </p>
              </div>
            </div>
          </div>

          {/* Device & Platform */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Device Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                {getPlatformIcon(user.platform)}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Platform
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.platform}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <FaMobileAlt
                  className="text-gray-600 dark:text-gray-400"
                  size={24}
                />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Device
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.deviceInfo}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          {user.subscriptionStatus === "Premium" && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <FaCrown className="text-yellow-500 dark:text-yellow-400" />
                Premium Subscription
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Start Date
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.subscriptionStartDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    End Date
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.subscriptionEndDate}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Account Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Account Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSuspendModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaBan />
                Suspend Account
              </button>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaTrash />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Suspend Modal */}
      <Modal
        isOpen={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
        title="Suspend User Account?"
        footer={
          <>
            <button
              onClick={() => setSuspendModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSuspend}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 rounded-lg shadow-lg shadow-orange-200 dark:shadow-orange-900/30 transition-colors"
            >
              Suspend
            </button>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Are you sure you want to suspend this user's account? They will not be
          able to access the app until reactivated.
        </p>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete User Account?"
        footer={
          <>
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-lg shadow-lg shadow-red-200 dark:shadow-red-900/30 transition-colors"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Are you sure you want to permanently delete this user's account? This
          action cannot be undone and will remove all user data.
        </p>
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800">
          <p className="text-xs text-red-900 dark:text-red-300 font-medium">
            ⚠️ This will delete: Profile, Downloads history, Favorites, and
            Subscription data
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default AppUserDetail;
