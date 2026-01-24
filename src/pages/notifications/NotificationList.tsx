import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { ReusableTable } from "../../components/common/ReusableTable";
import Modal from "../../components/common/Modal";
import {
  FaAndroid,
  FaApple,
  FaGlobe,
  FaCheckCircle,
  FaClock,
  FaTrash,
} from "react-icons/fa";

// Types
type Notification = {
  id: number;
  title: string;
  message: string;
  target: "all" | "android" | "ios" | "custom";
  sentAt: string;
  status: "Sent" | "Scheduled" | "Draft";
  opens: number;
};

// Mock Data Generator
const generateData = (): Notification[] => {
  const baseData: Notification[] = [
    {
      id: 1,
      title: "New Summer Collection",
      message: "Check out our 50+ new nature wallpapers!",
      target: "all",
      sentAt: "2024-01-15",
      status: "Sent",
      opens: 1240,
    },
    {
      id: 2,
      title: "Update Required",
      message: "Please update to the latest version.",
      target: "android",
      sentAt: "2024-01-14",
      status: "Sent",
      opens: 856,
    },
    {
      id: 3,
      title: "Exclusive Pro Features",
      message: "Unlock 4K downloads now!",
      target: "ios",
      sentAt: "2024-01-20",
      status: "Scheduled",
      opens: 0,
    },
    {
      id: 4,
      title: "Welcome New Users",
      message: "Thanks for joining us!",
      target: "custom",
      sentAt: "2024-01-12",
      status: "Sent",
      opens: 45,
    },
    {
      id: 5,
      title: "Weekend Sale",
      message: "50% off on Pro subscription",
      target: "all",
      sentAt: "2024-01-10",
      status: "Sent",
      opens: 2100,
    },
    {
      id: 6,
      title: "System Maintenance",
      message: "We will be down for 1 hour.",
      target: "all",
      sentAt: "2024-01-08",
      status: "Sent",
      opens: 3200,
    },
    {
      id: 7,
      title: "New Abstract Pack",
      message: "Abstract lovers, this is for you.",
      target: "ios",
      sentAt: "2024-01-18",
      status: "Draft",
      opens: 0,
    },
    {
      id: 8,
      title: "Rate Us",
      message: "Loving the app? Rate us on Play Store!",
      target: "android",
      sentAt: "2024-01-05",
      status: "Sent",
      opens: 150,
    },
    {
      id: 9,
      title: "Dark Mode Added",
      message: "Try the new Dark Mode in settings.",
      target: "all",
      sentAt: "2024-01-01",
      status: "Sent",
      opens: 4500,
    },
    {
      id: 10,
      title: "Referral Bonus",
      message: "Invite friends and earn rewards.",
      target: "custom",
      sentAt: "2024-01-16",
      status: "Sent",
      opens: 120,
    },
    {
      id: 11,
      title: "Bug Fixes",
      message: "Crash fixes for Android 14.",
      target: "android",
      sentAt: "2024-01-19",
      status: "Sent",
      opens: 900,
    },
    {
      id: 12,
      title: "Happy New Year",
      message: "Best wishes from the team!",
      target: "all",
      sentAt: "2024-01-01",
      status: "Sent",
      opens: 5000,
    },
  ];

  // Generate more mock data for pagination testing
  const moreData = Array.from({ length: 88 }).map((_, i) => ({
    id: 13 + i,
    title: `Campaign #${13 + i}`,
    message: "Auto-generated test notification message.",
    target: (["all", "android", "ios", "custom"] as const)[
      Math.floor(Math.random() * 4)
    ],
    sentAt: "2024-01-01",
    status: (["Sent", "Scheduled", "Draft"] as const)[
      Math.floor(Math.random() * 3)
    ],
    opens: Math.floor(Math.random() * 1000),
  }));

  return [...baseData, ...moreData];
};

const NotificationList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(() => generateData());

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Notification | null>(null);

  const handleDeleteClick = (notification: Notification) => {
    setItemToDelete(notification);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData((prev) => prev.filter((item) => item.id !== itemToDelete.id));
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
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
              {row.original.message}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "target",
        header: "Target",
        cell: ({ getValue }) => {
          const target = getValue() as string;
          return (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              {target === "all" && (
                <>
                  <FaGlobe className="text-indigo-500 dark:text-indigo-400" />
                  <span className="text-sm">All</span>
                </>
              )}
              {target === "android" && (
                <>
                  <FaAndroid className="text-green-500 dark:text-green-400" />
                  <span className="text-sm">Android</span>
                </>
              )}
              {target === "ios" && (
                <>
                  <FaApple className="text-gray-900 dark:text-gray-100" />
                  <span className="text-sm">iOS</span>
                </>
              )}
              {target === "custom" && (
                <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                  Custom
                </span>
              )}
            </div>
          );
        },
        filterFn: "equals",
      },
      {
        accessorKey: "sentAt",
        header: "Date",
        cell: ({ getValue }) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status === "Sent"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                  : status === "Scheduled"
                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
              }`}
            >
              {status === "Sent" ? (
                <FaCheckCircle className="mr-1" size={10} />
              ) : (
                <FaClock className="mr-1" size={10} />
              )}
              {status}
            </span>
          );
        },
        filterFn: "equals",
      },
      {
        accessorKey: "opens",
        header: "Engagement",
        cell: ({ getValue }) => {
          const opens = getValue() as number;
          return opens > 0 ? (
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {opens}{" "}
              <span className="text-gray-400 dark:text-gray-500 font-normal">
                opens
              </span>
            </span>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">-</span>
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
        searchPlaceholder="Search notifications..."
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
                {itemToDelete.message}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default NotificationList;
