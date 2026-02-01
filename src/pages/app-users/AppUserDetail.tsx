import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaClock,
  FaCalendar,
  FaBan,
  FaTrash,
} from "react-icons/fa";
import Modal from "../../components/common/Modal";
import { userService, type User as AppUser } from "../../services/userService";
import { notifySuccess, notifyError } from "../../utils/toastUtils";

const AppUserDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await userService.getById(id);
        if (res.success) {
          setUser(res.data);
        }
      } catch (error: any) {
        notifyError(error || "Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleSuspend = async () => {
    if (!user || !id) return;
    try {
      const newStatus =
        user.accountStatus === "Suspended" ? "Active" : "Suspended";
      const res = await userService.update(id, { accountStatus: newStatus });
      if (res.success) {
        notifySuccess(
          `User ${newStatus === "Suspended" ? "suspended" : "activated"} successfully`,
        );
        setUser({ ...user, accountStatus: newStatus });
      }
    } catch (error: any) {
      notifyError(error || "Failed to update user status");
    } finally {
      setSuspendModalOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      const res = await userService.delete(id);
      if (res.success) {
        notifySuccess("User deleted successfully");
        navigate("/app-users/list");
      }
    } catch (error: any) {
      notifyError(error || "Failed to delete user");
    } finally {
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          User not found
        </h2>
        <button
          onClick={() => navigate("/app-users/list")}
          className="mt-4 text-indigo-600 hover:text-indigo-500 font-medium"
        >
          Back to list
        </button>
      </div>
    );
  }

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
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                User ID: #{id}
              </p>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  user.accountStatus === "Active"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                }`}
              >
                {user.accountStatus}
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
                    {user.phoneNumber || "N/A"}
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
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                <FaCalendar
                  className="mx-auto mb-2 text-indigo-600 dark:text-indigo-400"
                  size={24}
                />
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
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
                  {user.isActive ? "Active Now" : "Inactive"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Status
                </p>
              </div>
            </div>
          </div>

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
