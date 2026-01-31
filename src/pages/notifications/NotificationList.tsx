import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { ReusableTable } from "../../components/common/ReusableTable";
import Modal from "../../components/common/Modal";
import {
  FaGlobe,
  FaCheckCircle,
  FaClock,
  FaTrash,
  FaExclamationCircle,
} from "react-icons/fa";
import {
  getNotifications,
  deleteNotification,
  bulkDeleteNotifications,
  type Notification,
} from "../../services/notificationService";
import { notifyError, notifySuccess } from "../../utils/toastUtils";
import { useEventStream } from "../../hooks/useEventStream";

const NotificationList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Notification | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getNotifications({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      });
      // The service now returns the unwrapped data object { data: [], meta: {} }
      if (result && Array.isArray(result.data)) {
        setData(result.data);
        setPageCount(result.meta?.totalPages || 1);
      } else {
        setData([]);
        setPageCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      notifyError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination]);

  // Real-time updates via SSE
  useEventStream((event) => {
    if (event.model === "notifications") {
      console.log("Notification change detected, refreshing...", event.action);
      fetchData();
    }
  });

  const handleDeleteClick = (notification: Notification) => {
    setItemToDelete(notification);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteNotification(itemToDelete._id);
        notifySuccess("Notification deleted");
        fetchData();
        setDeleteModalOpen(false);
        setItemToDelete(null);
      } catch (error) {
        notifyError("Failed to delete notification");
      }
    }
  };

  const handleBulkDelete = async (selectedNotifications: Notification[]) => {
    const ids = selectedNotifications
      .map((n) => n._id)
      .filter((id): id is string => !!id);
    if (ids.length === 0) return;

    await bulkDeleteNotifications(ids);
    fetchData();
  };

  const columns = useMemo<ColumnDef<Notification>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Campaign Info",
        cell: ({ getValue, row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
              {getValue() as string}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-xs truncate max-w-xs">
              {row.original.body}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "target",
        header: "Target",
        cell: ({ getValue }) => {
          const targetObj = getValue() as any; // { type, value }
          const type = targetObj?.type || "all";

          return (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              {type === "all" && (
                <>
                  <FaGlobe className="text-indigo-500 dark:text-indigo-400" />
                  <span className="text-sm">All</span>
                </>
              )}
              {type === "topic" && (
                <>
                  <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                    Topic
                  </span>
                  <span className="text-sm">{targetObj.value}</span>
                </>
              )}
              {type === "tokens" && (
                <>
                  <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                    Devices
                  </span>
                  <span className="text-sm">
                    {Array.isArray(targetObj.value)
                      ? targetObj.value.length
                      : 1}
                  </span>
                </>
              )}
              {type === "users" && (
                <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                  Users
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ getValue }) => {
          const date = new Date(getValue() as string);
          return (
            <span className="text-xs text-gray-600 dark:text-gray-300">
              {date.toLocaleDateString()}{" "}
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status === "sent"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                  : status === "queued" || status === "sending"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                    : status === "failed"
                      ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
              }`}
            >
              {status === "sent" ? (
                <FaCheckCircle className="mr-1" size={10} />
              ) : status === "failed" ? (
                <FaExclamationCircle className="mr-1" size={10} />
              ) : (
                <FaClock className="mr-1" size={10} />
              )}
              <span className="capitalize">{status}</span>
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="text-right">
            <button
              onClick={() => handleDeleteClick(row.original)}
              className="text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <FaTrash size={14} />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Notification History
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage and track your sent push notifications.
          </p>
        </div>
        <button
          onClick={() => navigate("/notifications/add")}
          className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 flex items-center gap-2"
        >
          <span>+</span> Create New
        </button>
      </div>

      <ReusableTable
        data={data}
        columns={columns}
        loading={loading}
        pagination={pagination}
        pageCount={pageCount}
        onPaginationChange={setPagination}
        searchPlaceholder="Search notifications..."
        title="Notification History"
        onBulkDelete={handleBulkDelete}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Notification?"
        footer={
          <>
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-lg shadow-lg shadow-red-200 dark:shadow-red-900/30 transition-colors"
            >
              Delete
            </button>
          </>
        }
      >
        <div className="text-center sm:text-left">
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            Are you sure you want to delete this notification? This action
            cannot be undone.
          </p>
          {itemToDelete && (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600 text-left">
              <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                {itemToDelete.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {itemToDelete.body}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default NotificationList;
