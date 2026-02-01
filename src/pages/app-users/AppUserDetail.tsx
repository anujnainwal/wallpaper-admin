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
  FaUserShield,
  FaHistory,
  FaShieldAlt,
  FaDownload,
  FaHeart,
} from "react-icons/fa";
import Modal from "../../components/common/Modal";
import { userService, type User as AppUser } from "../../services/userService";
import { notifySuccess, notifyError } from "../../utils/toastUtils";

// --- Components for the Tabs ---

const OverviewTab: React.FC<{ user: AppUser }> = ({ user }) => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FaDownload size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Downloads
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              0
            </p>
            {/* Placeholder data */}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-600 dark:text-pink-400">
            <FaHeart size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Likes
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              0
            </p>
            {/* Placeholder data */}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <FaCalendar size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Joined On
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Info Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <FaUserShield className="text-indigo-500" /> Personal Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <FaEnvelope size={14} />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user.email}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                  <FaPhone size={14} />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Phone
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user.phoneNumber || "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <FaGlobe size={14} />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Country
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user.country || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <FaChartLineIcon className="text-green-500" /> Activity Summary
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Current Status
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.isActive
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400"
                }`}
              >
                {user.isActive ? "Online" : "Offline"}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Account Status
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.accountStatus === "Active"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                }`}
              >
                {user.accountStatus}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last Active
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                <FaClock className="inline mr-1 text-gray-400" size={12} />
                {/* Placeholder for Last Active time */}
                Recently
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for icon
const FaChartLineIcon = ({ className }: { className?: string }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 16 16"
    className={className}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="fill-current"
      d="M16 14v1H0V0h1v14h15zM5 13H3V6h2v7zm4 0H7V3h2v10zm4 0h-2V9h2v4z"
    ></path>
  </svg>
);

const ActivityTab: React.FC<{ userId: string }> = ({ userId }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        // Import dynamically or assume it's available in scope if imported at top
        const { auditLogService } =
          await import("../../services/auditLogService");
        const res = await auditLogService.getLogs({
          userId,
          page,
          limit,
          sortBy: "createdAt",
          sortOrder: "desc",
        });
        setLogs(res.data);
        setTotalPages(res.meta.totalPages);
      } catch (error) {
        console.error("Failed to fetch activity logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [userId, page]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-fade-in-up">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
        <FaHistory className="text-indigo-500" /> Recent Activity
      </h3>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <FaHistory size={24} />
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            No activity logs found for this user.
          </p>
        </div>
      ) : (
        <div className="flow-root">
          <ul className="-mb-8">
            {logs.map((log: any, logIdx) => (
              <li key={log._id}>
                <div className="relative pb-8">
                  {logIdx !== logs.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 
                        ${
                          log.action.includes("LOGIN")
                            ? "bg-green-500"
                            : log.action.includes("REGISTER")
                              ? "bg-blue-500"
                              : log.action.includes("UPDATE")
                                ? "bg-orange-500"
                                : "bg-gray-500"
                        }`}
                      >
                        <FaClock
                          className="h-4 w-4 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {log.action.replace(/_/g, " ")}{" "}
                          <span className="font-medium text-gray-500 dark:text-gray-400">
                            - {log.details}
                          </span>
                        </p>
                        {log.ipAddress && (
                          <p className="text-xs text-gray-400 mt-1">
                            IP: {log.ipAddress}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SecurityTab: React.FC<{
  user: AppUser;
  onSuspend: () => void;
  onDelete: () => void;
}> = ({ user, onSuspend, onDelete }) => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FaShieldAlt className="text-indigo-500" /> Account Security
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage account access and dangerous actions
          </p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Account Status
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current access level of this user
              </p>
            </div>
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

          <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
            <h4 className="text-red-600 dark:text-red-400 font-bold mb-4">
              Danger Zone
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={onSuspend}
                className="flex items-center justify-center gap-2 p-4 border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all font-medium"
              >
                <FaBan />
                {user.accountStatus === "Active"
                  ? "Suspend Account"
                  : "Activate Account"}
              </button>
              <button
                onClick={onDelete}
                className="flex items-center justify-center gap-2 p-4 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all font-medium"
              >
                <FaTrash />
                Delete Account
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              These actions may affect the user's ability to login and access
              their data. Proceed with caution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const AppUserDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "activity" | "security"
  >("overview");

  // Modals state
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* Cover Image & Header Area */}
      <div className="relative h-48 md:h-64 rounded-b-[3rem] bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-visible shadow-lg">
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate("/app-users/list")}
            className="p-2 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full text-white transition-all shadow-md"
          >
            <FaArrowLeft size={20} />
          </button>
        </div>
        {/* Overlapping Profile Card */}
        <div className="absolute -bottom-16 left-6 md:left-12 flex items-end gap-6">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-800 shadow-xl overflow-hidden flex items-center justify-center text-4xl font-bold text-white bg-linear-to-br from-indigo-400 to-purple-600">
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </div>
          <div className="mb-4 hidden md:block">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              User ID: #{id}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Container - offset for the overlapping header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 space-y-6">
        {/* Mobile Name (visible only on small screens) */}
        <div className="md:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            User ID: #{id}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: "overview", label: "Overview", icon: FaUserShield },
              { id: "activity", label: "Activity", icon: FaHistory },
              { id: "security", label: "Security", icon: FaShieldAlt },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                              group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all
                              ${
                                activeTab === tab.id
                                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300"
                              }
                          `}
              >
                <tab.icon
                  className={`
                              mr-2 h-4 w-4
                              ${activeTab === tab.id ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500"}
                          `}
                />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "overview" && <OverviewTab user={user} />}
          {activeTab === "activity" && <ActivityTab userId={id || ""} />}
          {activeTab === "security" && (
            <SecurityTab
              user={user}
              onSuspend={() => setSuspendModalOpen(true)}
              onDelete={() => setDeleteModalOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Modals */}
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
              {user.accountStatus === "Active" ? "Suspend" : "Activate"}
            </button>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {user.accountStatus === "Active"
            ? "Are you sure you want to suspend this user's account? They will not be able to access the app until reactivated."
            : "Are you sure you want to activate this user's account? They will regain access to the app."}
        </p>
      </Modal>

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
