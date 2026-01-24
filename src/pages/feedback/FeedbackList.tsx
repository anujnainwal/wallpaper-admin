import React, { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ReusableTable } from "../../components/common/ReusableTable";
import Modal from "../../components/common/Modal";
import {
  FaCommentDots,
  FaBug,
  FaLightbulb,
  FaExclamationTriangle,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaReply,
  FaEye,
} from "react-icons/fa";

// Types
type FeedbackType =
  | "Bug Report"
  | "Feature Request"
  | "Complaint"
  | "Suggestion"
  | "Praise";
type FeedbackStatus = "New" | "In Progress" | "Resolved" | "Closed";

type Feedback = {
  id: number;
  userName: string;
  userEmail: string;
  type: FeedbackType;
  subject: string;
  message: string;
  status: FeedbackStatus;
  priority: "Low" | "Medium" | "High";
  createdDate: string;
  repliedBy?: string;
  reply?: string;
  repliedDate?: string;
};

// Mock Data Generator
const generateData = (): Feedback[] => {
  const baseData: Feedback[] = [
    {
      id: 1,
      userName: "Sarah Johnson",
      userEmail: "sarah.j@example.com",
      type: "Bug Report",
      subject: "App crashes when uploading wallpaper",
      message:
        "The app crashes every time I try to upload a wallpaper from my gallery. This happens on iOS 17.2.",
      status: "In Progress",
      priority: "High",
      createdDate: "2024-01-20",
    },
    {
      id: 2,
      userName: "Mike Chen",
      userEmail: "mike.chen@example.com",
      type: "Feature Request",
      subject: "Add dark mode wallpapers category",
      message:
        "It would be great to have a dedicated category for dark mode wallpapers. Many users prefer dark themes.",
      status: "New",
      priority: "Medium",
      createdDate: "2024-01-19",
    },
    {
      id: 3,
      userName: "Emily Davis",
      userEmail: "emily.d@example.com",
      type: "Complaint",
      subject: "Too many ads",
      message:
        "The app shows too many ads. I understand you need revenue, but it's becoming unusable.",
      status: "Resolved",
      priority: "High",
      createdDate: "2024-01-18",
      repliedBy: "Admin",
      reply:
        "Thank you for your feedback. We've reduced the ad frequency in the latest update. Please update to version 2.1.0.",
      repliedDate: "2024-01-19",
    },
    {
      id: 4,
      userName: "Alex Thompson",
      userEmail: "alex.t@example.com",
      type: "Suggestion",
      subject: "Add wallpaper scheduling feature",
      message:
        "It would be cool to schedule wallpaper changes automatically, like changing wallpaper every day or week.",
      status: "New",
      priority: "Low",
      createdDate: "2024-01-17",
    },
    {
      id: 5,
      userName: "Lisa Anderson",
      userEmail: "lisa.a@example.com",
      type: "Praise",
      subject: "Amazing app!",
      message:
        "I love this app! The wallpapers are high quality and the interface is beautiful. Keep up the great work!",
      status: "Closed",
      priority: "Low",
      createdDate: "2024-01-16",
      repliedBy: "Admin",
      reply:
        "Thank you so much for your kind words! We're glad you're enjoying the app. 😊",
      repliedDate: "2024-01-17",
    },
    {
      id: 6,
      userName: "David Wilson",
      userEmail: "david.w@example.com",
      type: "Bug Report",
      subject: "Search not working properly",
      message:
        "When I search for 'nature', the results show random wallpapers that don't match the keyword.",
      status: "Resolved",
      priority: "Medium",
      createdDate: "2024-01-15",
      repliedBy: "Admin",
      reply:
        "We've fixed the search algorithm. The issue was with keyword matching. Please try again and let us know if it works better.",
      repliedDate: "2024-01-16",
    },
  ];

  return baseData;
};

const FeedbackList: React.FC = () => {
  const [data, setData] = useState(() => generateData());
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null,
  );
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState<FeedbackStatus>("In Progress");

  const handleViewClick = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setViewModalOpen(true);
  };

  const handleReplyClick = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setReplyText(feedback.reply || "");
    setReplyStatus(feedback.status);
    setReplyModalOpen(true);
  };

  const handleSubmitReply = () => {
    if (selectedFeedback && replyText.trim()) {
      setData((prev) =>
        prev.map((item) =>
          item.id === selectedFeedback.id
            ? {
                ...item,
                reply: replyText,
                repliedBy: "Admin",
                repliedDate: new Date().toISOString().split("T")[0],
                status: replyStatus,
              }
            : item,
        ),
      );
      setReplyModalOpen(false);
      setReplyText("");
      setSelectedFeedback(null);
    }
  };

  const getFeedbackTypeIcon = (type: FeedbackType) => {
    switch (type) {
      case "Bug Report":
        return <FaBug className="text-red-600 dark:text-red-400" />;
      case "Feature Request":
        return <FaLightbulb className="text-yellow-600 dark:text-yellow-400" />;
      case "Complaint":
        return (
          <FaExclamationTriangle className="text-orange-600 dark:text-orange-400" />
        );
      case "Suggestion":
        return <FaCommentDots className="text-blue-600 dark:text-blue-400" />;
      case "Praise":
        return <FaStar className="text-green-600 dark:text-green-400" />;
      default:
        return <FaCommentDots />;
    }
  };

  const getStatusIcon = (status: FeedbackStatus) => {
    switch (status) {
      case "New":
        return <FaClock className="mr-1" size={10} />;
      case "In Progress":
        return <FaClock className="mr-1" size={10} />;
      case "Resolved":
        return <FaCheckCircle className="mr-1" size={10} />;
      case "Closed":
        return <FaTimesCircle className="mr-1" size={10} />;
      default:
        return null;
    }
  };

  const columns = useMemo<ColumnDef<Feedback>[]>(
    () => [
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
              {getFeedbackTypeIcon(getValue() as FeedbackType)}
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {getValue() as string}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "subject",
        header: "Subject",
        cell: ({ getValue, row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
              {getValue() as string}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              by {row.original.userName}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ getValue }) => {
          const priority = getValue() as string;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                priority === "High"
                  ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                  : priority === "Medium"
                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
              }`}
            >
              {priority}
            </span>
          );
        },
        filterFn: "equals",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue() as FeedbackStatus;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status === "Resolved"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                  : status === "In Progress"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                    : status === "Closed"
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                      : "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400"
              }`}
            >
              {getStatusIcon(status)}
              {status}
            </span>
          );
        },
        filterFn: "equals",
      },
      {
        accessorKey: "createdDate",
        header: "Date",
        cell: ({ getValue }) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {getValue() as string}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleViewClick(row.original)}
              className="text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              title="View Details"
            >
              <FaEye size={14} />
            </button>
            <button
              onClick={() => handleReplyClick(row.original)}
              className="text-gray-400 hover:text-green-600 dark:text-gray-500 dark:hover:text-green-400 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              title="Reply"
            >
              <FaReply size={14} />
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
            User Feedback
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage feedback from mobile app users
          </p>
        </div>
      </div>

      <ReusableTable
        data={data}
        columns={columns}
        searchPlaceholder="Search feedback by subject or user..."
      />

      {/* View Feedback Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Feedback Details"
      >
        {selectedFeedback && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                {getFeedbackTypeIcon(selectedFeedback.type)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {selectedFeedback.subject}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedFeedback.type}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {selectedFeedback.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">User:</span>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedFeedback.userName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedFeedback.userEmail}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Date:</span>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedFeedback.createdDate}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Priority:
                </span>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedFeedback.priority}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Status:
                </span>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedFeedback.status}
                </p>
              </div>
            </div>

            {selectedFeedback.reply && (
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Admin Reply
                </h4>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {selectedFeedback.reply}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Replied by {selectedFeedback.repliedBy} on{" "}
                    {selectedFeedback.repliedDate}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reply Modal */}
      <Modal
        isOpen={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        title="Reply to Feedback"
        footer={
          <>
            <button
              onClick={() => setReplyModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitReply}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-colors"
            >
              Send Reply
            </button>
          </>
        }
      >
        {selectedFeedback && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                {selectedFeedback.subject}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {selectedFeedback.message}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Reply
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-gray-100"
                placeholder="Type your reply here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Update Status
              </label>
              <select
                value={replyStatus}
                onChange={(e) =>
                  setReplyStatus(e.target.value as FeedbackStatus)
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-gray-100"
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FeedbackList;
