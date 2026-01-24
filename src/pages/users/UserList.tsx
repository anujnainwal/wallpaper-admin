import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { ReusableTable } from "../../components/common/ReusableTable";
import Modal from "../../components/common/Modal";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaBan,
  FaEdit,
  FaTrash,
  FaShieldAlt,
  FaCrown,
  FaUserTie,
} from "react-icons/fa";

// Types
type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "Active" | "Inactive" | "Suspended";
  joinedDate: string;
  lastActive: string;
  totalWallpapers: number;
};

// Mock Data Generator
const generateData = (): User[] => {
  const baseData: User[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 234-567-8900",
      role: "Admin",
      status: "Active",
      joinedDate: "2023-01-15",
      lastActive: "2024-01-24",
      totalWallpapers: 245,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 234-567-8901",
      role: "Editor",
      status: "Active",
      joinedDate: "2023-03-20",
      lastActive: "2024-01-23",
      totalWallpapers: 189,
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.j@example.com",
      phone: "+1 234-567-8902",
      role: "Viewer",
      status: "Active",
      joinedDate: "2023-05-10",
      lastActive: "2024-01-22",
      totalWallpapers: 0,
    },
    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      phone: "+1 234-567-8903",
      role: "Editor",
      status: "Inactive",
      joinedDate: "2023-02-14",
      lastActive: "2023-12-15",
      totalWallpapers: 156,
    },
    {
      id: 5,
      name: "David Brown",
      email: "david.brown@example.com",
      phone: "+1 234-567-8904",
      role: "Admin",
      status: "Active",
      joinedDate: "2022-11-05",
      lastActive: "2024-01-24",
      totalWallpapers: 312,
    },
    {
      id: 6,
      name: "Emily Davis",
      email: "emily.d@example.com",
      phone: "+1 234-567-8905",
      role: "Editor",
      status: "Suspended",
      joinedDate: "2023-07-22",
      lastActive: "2024-01-10",
      totalWallpapers: 78,
    },
    {
      id: 7,
      name: "Robert Miller",
      email: "robert.m@example.com",
      phone: "+1 234-567-8906",
      role: "Viewer",
      status: "Active",
      joinedDate: "2023-09-18",
      lastActive: "2024-01-24",
      totalWallpapers: 0,
    },
    {
      id: 8,
      name: "Lisa Anderson",
      email: "lisa.a@example.com",
      phone: "+1 234-567-8907",
      role: "Editor",
      status: "Active",
      joinedDate: "2023-04-30",
      lastActive: "2024-01-23",
      totalWallpapers: 203,
    },
  ];

  // Generate more mock data for pagination testing
  const moreData = Array.from({ length: 42 }).map((_, i) => ({
    id: 9 + i,
    name: `User ${9 + i}`,
    email: `user${9 + i}@example.com`,
    phone: `+1 234-567-${8900 + i}`,
    role: (["Admin", "Editor", "Viewer"] as const)[
      Math.floor(Math.random() * 3)
    ],
    status: (["Active", "Inactive", "Suspended"] as const)[
      Math.floor(Math.random() * 3)
    ],
    joinedDate: "2023-06-01",
    lastActive: "2024-01-20",
    totalWallpapers: Math.floor(Math.random() * 300),
  }));

  return [...baseData, ...moreData];
};

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(() => generateData());

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<User | null>(null);

  const handleDeleteClick = (user: User) => {
    setItemToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleEditClick = (user: User) => {
    navigate(`/users/edit/${user.id}`);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData((prev) => prev.filter((item) => item.id !== itemToDelete.id));
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <FaCrown className="text-yellow-500 dark:text-yellow-400" />;
      case "Editor":
        return <FaUserTie className="text-blue-500 dark:text-blue-400" />;
      case "Viewer":
        return <FaUser className="text-gray-500 dark:text-gray-400" />;
      default:
        return <FaUser className="text-gray-500 dark:text-gray-400" />;
    }
  };

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "User Info",
        cell: ({ getValue, row }) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {(getValue() as string)
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                {getValue() as string}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <FaEnvelope size={10} />
                <span>{row.original.email}</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <FaPhone size={12} className="text-gray-400 dark:text-gray-500" />
            <span className="text-sm">{getValue() as string}</span>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ getValue }) => {
          const role = getValue() as string;
          return (
            <div className="flex items-center gap-2">
              {getRoleIcon(role)}
              <span
                className={`text-sm font-medium ${
                  role === "Admin"
                    ? "text-yellow-700 dark:text-yellow-400"
                    : role === "Editor"
                      ? "text-blue-700 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-400"
                }`}
              >
                {role}
              </span>
            </div>
          );
        },
        filterFn: "equals",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status === "Active"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                  : status === "Inactive"
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
              }`}
            >
              {status === "Active" ? (
                <FaCheckCircle className="mr-1" size={10} />
              ) : (
                <FaBan className="mr-1" size={10} />
              )}
              {status}
            </span>
          );
        },
        filterFn: "equals",
      },
      {
        accessorKey: "totalWallpapers",
        header: "Wallpapers",
        cell: ({ getValue }) => (
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {getValue() as number}
          </span>
        ),
      },
      {
        accessorKey: "joinedDate",
        header: "Joined",
        cell: ({ getValue }) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "lastActive",
        header: "Last Active",
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
              onClick={() => handleEditClick(row.original)}
              className="text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              title="Edit User"
            >
              <FaEdit size={14} />
            </button>
            <button
              onClick={() => handleDeleteClick(row.original)}
              className="text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              title="Delete User"
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
            User Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage admin users and their permissions.
          </p>
        </div>
        <button
          onClick={() => navigate("/users/add")}
          className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 flex items-center gap-2"
        >
          <span>+</span> Add New User
        </button>
      </div>

      <ReusableTable
        data={data}
        columns={columns}
        searchPlaceholder="Search users by name, email, or phone..."
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete User?"
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
            Are you sure you want to delete this user? This action cannot be
            undone and will remove all associated data.
          </p>
          {itemToDelete && (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600 text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {itemToDelete.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                    {itemToDelete.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {itemToDelete.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <FaShieldAlt size={10} />
                  {itemToDelete.role}
                </span>
                <span>•</span>
                <span>{itemToDelete.totalWallpapers} wallpapers</span>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default UserList;
