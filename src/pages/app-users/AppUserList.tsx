import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { ReusableTable } from "../../components/common/ReusableTable";
import {
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaHeart,
  FaEye,
  FaEdit,
  FaTrash,
  FaCalendar,
} from "react-icons/fa";
import { userService, type User as AppUser } from "../../services/userService";
import { notifySuccess, notifyError } from "../../utils/toastUtils";

const AppUserList: React.FC = () => {
  const navigate = useNavigate();
  const [stableData, setStableData] = useState<{
    users: AppUser[];
    total: number;
  }>({
    users: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await userService.getAll({ page, limit, search });
      if (res) {
        // Robust parsing: check for data in res.data (old) or res directly (new)
        const rawData = res.data;
        const users = Array.isArray(rawData)
          ? rawData
          : (rawData as any)?.data || [];
        const total = res.pagination?.total ?? (rawData as any)?.total ?? 0;

        setStableData({ users, total });
      }
    } catch (error: any) {
      notifyError(error || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [page, search]);

  const handleViewDetails = (user: AppUser) => {
    navigate(`/app-users/${user._id}`);
  };

  const handleEditUser = (user: AppUser) => {
    navigate(`/app-users/edit/${user._id}`);
  };

  const handleDeleteUser = async (user: AppUser) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
      )
    ) {
      try {
        const res = await userService.delete(user._id!);
        if (res.success) {
          notifySuccess("User deleted successfully");
          fetchData();
        }
      } catch (error: any) {
        notifyError(error || "Failed to delete user");
      }
    }
  };

  const handleBulkDelete = async (selected: AppUser[]) => {
    if (window.confirm(`Delete ${selected.length} users?`)) {
      try {
        const ids = selected.map((u) => u._id!);
        const res = await userService.bulkDelete(ids);
        if (res.success) {
          notifySuccess(`${selected.length} users deleted`);
          fetchData();
        }
      } catch (error: any) {
        notifyError(error || "Failed to delete users");
      }
    }
  };

  const columns = useMemo<ColumnDef<AppUser>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "User Info",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold text-sm">
              {row.original.firstName?.[0]}
              {row.original.lastName?.[0]}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                {row.original.firstName} {row.original.lastName}
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
        accessorKey: "phoneNumber",
        header: "Phone",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <FaPhone size={12} className="text-gray-400 dark:text-gray-500" />
            <span className="text-sm">{(getValue() as string) || "N/A"}</span>
          </div>
        ),
      },
      {
        accessorKey: "provider",
        header: "Platform",
        cell: ({ getValue }) => {
          const provider = getValue() as string;
          // provider google/email/apple
          return (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {provider || "Email"}
              </span>
            </div>
          );
        },
        filterFn: "equals",
      },
      {
        accessorKey: "accountStatus",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status === "Active"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                  : status === "Suspended"
                    ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
              }`}
            >
              {status}
            </span>
          );
        },
        filterFn: "equals",
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ getValue }) => (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "totalFavorites",
        header: "Favorites",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
            <FaHeart size={12} className="text-pink-500 dark:text-pink-400" />
            <span className="font-medium">{(getValue() as number) || 0}</span>
          </div>
        ),
      },
      {
        accessorKey: "country",
        header: "Country",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <FaGlobe size={12} className="text-gray-400 dark:text-gray-500" />
            <span className="text-sm">
              {(getValue() as string) || "Global"}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ getValue }) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {new Date(getValue() as string).toLocaleDateString()}
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

  const { users: data, total: totalUsers } = stableData;

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
          <span className="font-medium">{totalUsers}</span>
          <span>Total Users</span>
        </div>
      </div>

      <ReusableTable
        data={data || []}
        columns={columns}
        searchPlaceholder="Search users by name or email..."
        onBulkDelete={handleBulkDelete}
        loading={loading}
        rowCount={totalUsers}
        pagination={{ pageIndex: page - 1, pageSize: limit }}
        onPaginationChange={(updater) => {
          if (typeof updater === "function") {
            const newState = updater({ pageIndex: page - 1, pageSize: limit });
            setPage(newState.pageIndex + 1);
          }
        }}
        globalFilter={search}
        onGlobalFilterChange={setSearch}
        renderGridItem={(row: Row<AppUser>) => {
          const user = row?.original;
          if (!user) return null;
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
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {user.firstName} {user.lastName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <FaEnvelope className="shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </button>
              </div>

              {/* Stats Grid */}
              <div className="px-5 py-2 grid grid-cols-2 gap-2">
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-900/10 transition-colors">
                  <FaGlobe className="text-teal-400 dark:text-teal-500 mb-1.5" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Country
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate w-full text-center px-1">
                    {user.country || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 group-hover:bg-purple-50/50 dark:group-hover:bg-purple-900/10 transition-colors">
                  <FaCalendar className="text-purple-400 dark:text-purple-500 mb-1.5" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Joined
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate w-full text-center px-1">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 mt-auto flex items-center justify-between border-t border-gray-50 dark:border-gray-700/50">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                    user.accountStatus === "Active"
                      ? "bg-green-100/80 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                      : "bg-red-100/80 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                  }`}
                >
                  {user.accountStatus}
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
