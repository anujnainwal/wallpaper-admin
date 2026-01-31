import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { ReusableTable } from "../../components/common/ReusableTable";
import {
  FaAndroid,
  FaApple,
  FaMobileAlt,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaCrown,
  FaHeart,
  FaDownload,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

// Types
type AppUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  platform: "Android" | "iOS" | "Both";
  subscriptionStatus: "Free" | "Premium" | "Expired";
  joinedDate: string;
  lastActive: string;
  totalDownloads: number;
  totalFavorites: number;
  deviceInfo: string;
  country: string;
};

// Mock Data Generator
const generateData = (): AppUser[] => {
  const countries = [
    "USA",
    "India",
    "UK",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Japan",
  ];
  const devices = [
    "Samsung Galaxy S23",
    "iPhone 15 Pro",
    "Google Pixel 8",
    "OnePlus 11",
    "iPhone 14",
    "Xiaomi 13",
    "Samsung Galaxy A54",
    "iPhone 13",
  ];

  const baseData: AppUser[] = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.j@gmail.com",
      phone: "+1 555-0101",
      platform: "iOS",
      subscriptionStatus: "Premium",
      joinedDate: "2023-01-15",
      lastActive: "2024-01-24",
      totalDownloads: 245,
      totalFavorites: 89,
      deviceInfo: "iPhone 15 Pro",
      country: "USA",
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.sharma@gmail.com",
      phone: "+91 98765-43210",
      platform: "Android",
      subscriptionStatus: "Free",
      joinedDate: "2023-03-20",
      lastActive: "2024-01-23",
      totalDownloads: 156,
      totalFavorites: 45,
      deviceInfo: "Samsung Galaxy S23",
      country: "India",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "m.chen@outlook.com",
      phone: "+1 555-0102",
      platform: "Both",
      subscriptionStatus: "Premium",
      joinedDate: "2023-02-10",
      lastActive: "2024-01-24",
      totalDownloads: 412,
      totalFavorites: 178,
      deviceInfo: "iPhone 14 & Galaxy S23",
      country: "Canada",
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma.w@yahoo.com",
      phone: "+44 7700-900123",
      platform: "iOS",
      subscriptionStatus: "Expired",
      joinedDate: "2022-11-05",
      lastActive: "2023-12-15",
      totalDownloads: 89,
      totalFavorites: 23,
      deviceInfo: "iPhone 13",
      country: "UK",
    },
    {
      id: 5,
      name: "Raj Patel",
      email: "raj.patel@gmail.com",
      phone: "+91 98765-43211",
      platform: "Android",
      subscriptionStatus: "Premium",
      joinedDate: "2023-05-22",
      lastActive: "2024-01-24",
      totalDownloads: 334,
      totalFavorites: 112,
      deviceInfo: "Google Pixel 8",
      country: "India",
    },
    {
      id: 6,
      name: "Sophie Martin",
      email: "sophie.m@gmail.com",
      phone: "+33 6-12-34-56-78",
      platform: "iOS",
      subscriptionStatus: "Free",
      joinedDate: "2023-07-18",
      lastActive: "2024-01-22",
      totalDownloads: 67,
      totalFavorites: 34,
      deviceInfo: "iPhone 14",
      country: "France",
    },
    {
      id: 7,
      name: "David Kim",
      email: "david.kim@gmail.com",
      phone: "+1 555-0103",
      platform: "Android",
      subscriptionStatus: "Premium",
      joinedDate: "2023-04-12",
      lastActive: "2024-01-23",
      totalDownloads: 289,
      totalFavorites: 95,
      deviceInfo: "Samsung Galaxy A54",
      country: "USA",
    },
    {
      id: 8,
      name: "Lisa Anderson",
      email: "lisa.a@hotmail.com",
      phone: "+61 4-1234-5678",
      platform: "Both",
      subscriptionStatus: "Free",
      joinedDate: "2023-06-30",
      lastActive: "2024-01-24",
      totalDownloads: 178,
      totalFavorites: 56,
      deviceInfo: "iPhone 15 & OnePlus 11",
      country: "Australia",
    },
  ];

  // Generate more mock data
  const moreData = Array.from({ length: 92 }).map((_, i) => ({
    id: 9 + i,
    name: `User ${9 + i}`,
    email: `user${9 + i}@example.com`,
    phone: `+1 555-${String(104 + i).padStart(4, "0")}`,
    platform: (["Android", "iOS", "Both"] as const)[
      Math.floor(Math.random() * 3)
    ],
    subscriptionStatus: (["Free", "Premium", "Expired"] as const)[
      Math.floor(Math.random() * 3)
    ],
    joinedDate: "2023-08-01",
    lastActive: "2024-01-20",
    totalDownloads: Math.floor(Math.random() * 500),
    totalFavorites: Math.floor(Math.random() * 200),
    deviceInfo: devices[Math.floor(Math.random() * devices.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
  }));

  return [...baseData, ...moreData];
};

const AppUserList: React.FC = () => {
  const navigate = useNavigate();
  const [data] = useState(() => generateData());

  const handleViewDetails = (user: AppUser) => {
    navigate(`/app-users/${user.id}`);
  };

  const handleEditUser = (user: AppUser) => {
    navigate(`/app-users/edit/${user.id}`);
  };

  const handleDeleteUser = (user: AppUser) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      console.log("Deleting user:", user.id);
      // TODO: API call to delete user
    }
  };

  const handleBulkDelete = async (selected: AppUser[]) => {
    if (window.confirm(`Delete ${selected.length} users?`)) {
      console.log(
        "Bulk deleting:",
        selected.map((u) => u.id),
      );
      // In a real app, call service and then fetchData()
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Android":
        return <FaAndroid className="text-green-500 dark:text-green-400" />;
      case "iOS":
        return <FaApple className="text-gray-900 dark:text-gray-100" />;
      case "Both":
        return <FaMobileAlt className="text-indigo-500 dark:text-indigo-400" />;
      default:
        return <FaMobileAlt className="text-gray-500 dark:text-gray-400" />;
    }
  };

  const columns = useMemo<ColumnDef<AppUser>[]>(
    () => [
      {
        accessorKey: "name",
        header: "User Info",
        cell: ({ getValue, row }) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold text-sm">
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
        accessorKey: "platform",
        header: "Platform",
        cell: ({ getValue }) => {
          const platform = getValue() as string;
          return (
            <div className="flex items-center gap-2">
              {getPlatformIcon(platform)}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {platform}
              </span>
            </div>
          );
        },
        filterFn: "equals",
      },
      {
        accessorKey: "subscriptionStatus",
        header: "Subscription",
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status === "Premium"
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                  : status === "Free"
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
              }`}
            >
              {status === "Premium" && <FaCrown className="mr-1" size={10} />}
              {status}
            </span>
          );
        },
        filterFn: "equals",
      },
      {
        accessorKey: "totalDownloads",
        header: "Downloads",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
            <FaDownload
              size={12}
              className="text-gray-400 dark:text-gray-500"
            />
            <span className="font-medium">{getValue() as number}</span>
          </div>
        ),
      },
      {
        accessorKey: "totalFavorites",
        header: "Favorites",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
            <FaHeart size={12} className="text-pink-500 dark:text-pink-400" />
            <span className="font-medium">{getValue() as number}</span>
          </div>
        ),
      },
      {
        accessorKey: "country",
        header: "Country",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <FaGlobe size={12} className="text-gray-400 dark:text-gray-500" />
            <span className="text-sm">{getValue() as string}</span>
          </div>
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
              onClick={() => handleViewDetails(row.original)}
              className="text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              title="View Details"
            >
              <FaEye size={14} />
            </button>
            <button
              onClick={() => handleEditUser(row.original)}
              className="text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              title="Edit User"
            >
              <FaEdit size={14} />
            </button>
            <button
              onClick={() => handleDeleteUser(row.original)}
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
            App Users
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage mobile application users and their subscriptions.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">{data.length}</span>
          <span>Total Users</span>
        </div>
      </div>

      <ReusableTable
        data={data}
        columns={columns}
        searchPlaceholder="Search users by name, email, or phone..."
        onBulkDelete={handleBulkDelete}
        renderGridItem={(row: Row<AppUser>) => {
          const user = row.original;
          return (
            <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="p-5 flex items-start justify-between relative">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-indigo-50/50 to-transparent dark:from-indigo-900/10 rounded-bl-[100px] z-0 pointer-events-none"></div>

                <button
                  onClick={() => handleViewDetails(user)}
                  className="flex items-center gap-4 z-10 text-left w-full"
                >
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          new Date(user.lastActive) >
                          new Date(Date.now() - 86400000 * 2)
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {user.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <FaEnvelope className="shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </button>
                <div className="z-10 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-xl group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors">
                  {getPlatformIcon(user.platform)}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="px-5 py-2 grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-900/10 transition-colors">
                  <FaDownload className="text-gray-400 dark:text-gray-500 mb-1.5" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Downloads
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {user.totalDownloads}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 group-hover:bg-pink-50/50 dark:group-hover:bg-pink-900/10 transition-colors">
                  <FaHeart className="text-pink-400 dark:text-pink-500 mb-1.5" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Favorites
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {user.totalFavorites}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 group-hover:bg-teal-50/50 dark:group-hover:bg-teal-900/10 transition-colors">
                  <FaGlobe className="text-teal-400 dark:text-teal-500 mb-1.5" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Country
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate w-full text-center px-1">
                    {user.country}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 mt-auto flex items-center justify-between border-t border-gray-50 dark:border-gray-700/50">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                    user.subscriptionStatus === "Premium"
                      ? "bg-amber-100/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                      : user.subscriptionStatus === "Free"
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                        : "bg-red-100/80 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                  }`}
                >
                  {user.subscriptionStatus === "Premium" && (
                    <FaCrown className="mr-1.5 mb-px" size={10} />
                  )}
                  {user.subscriptionStatus}
                </span>

                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditUser(user);
                    }}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all"
                    title="Edit"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUser(user);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    title="Delete"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default AppUserList;
