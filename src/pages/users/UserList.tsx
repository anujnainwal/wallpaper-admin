import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
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
  FaCrown,
  FaUserTie,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { userService, type User } from "../../services/userService";
import toast from "react-hot-toast";
import { useEventStream } from "../../hooks/useEventStream";

const UserList: React.FC = () => {
  const navigate = useNavigate();

  // Data State
  const [stableData, setStableData] = useState<{
    users: User[];
    total: number;
  }>({
    users: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  // Table State
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<User | null>(null);

  // Fetch Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter,
      };

      if (sorting.length > 0) {
        params.sortBy = sorting[0].id; // Assumption: backend supports this
        params.sortOrder = sorting[0].desc ? "desc" : "asc";
      }

      const response: any = await userService.getAll(params);
      // Adjust based on actual response structure { success: true, data: { data: [], total: ... } }
      // The service returns response.data, so it should be { data: [], total, ... } directly if standardized
      // Let's assume standard response util structure: { success: true, data: { data: [...], total: ... } }
      // But my service returns response.data directly.
      // Checking backend: ResponseUtil.paginated sends { data, total, page, limit } directly (no success wrapper inside specific methods? No, usually generic success wrapper).
      // Actually ResponseUtil.paginated sends { success: true, statusCode: 200, data: { data: [], total, ... } }
      // And service returns response.data which is the whole body.
      // So response.data.data is the list.

      if (response) {
        // Robust handling
        const rawData = response.data; // This might be array (new) or object (old)

        const users = Array.isArray(rawData) ? rawData : rawData?.data || [];
        const total = response.pagination?.total ?? rawData?.total ?? 0;

        setStableData({ users, total });
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, sorting]);

  // Debounce fetch for search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchData]);

  // Real-time updates via SSE
  useEventStream((event) => {
    if (event.model === "users") {
      console.log("User change detected, refreshing...", event.action);
      fetchData();
    }
  });

  const handleDeleteClick = (user: User) => {
    setItemToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleEditClick = (user: User) => {
    navigate(`/users/edit/${user._id}`);
  };

  const confirmDelete = async () => {
    if (itemToDelete && itemToDelete._id) {
      try {
        await userService.delete(itemToDelete._id);
        toast.success("User deleted successfully");
        fetchData(); // Refresh list
      } catch (error) {
        toast.error("Failed to delete user");
      } finally {
        setDeleteModalOpen(false);
        setItemToDelete(null);
      }
    }
  };

  const handleBulkDelete = async (selectedUsers: User[]) => {
    const ids = selectedUsers
      .map((u) => u._id)
      .filter((id): id is string => !!id);
    if (ids.length === 0) return;

    await userService.bulkDelete(ids);
    // fetchData() is called by the SSE hook automatically if we want,
    // but ReusableTable handles the success toast.
    // Let's explicitly refresh just in case SSE is slow.
    fetchData();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <FaCrown className="text-yellow-500 dark:text-yellow-400" />;
      case "editor":
        return <FaUserTie className="text-blue-500 dark:text-blue-400" />;
      case "viewer":
        return <FaUser className="text-gray-500 dark:text-gray-400" />;
      default:
        return <FaUser className="text-gray-500 dark:text-gray-400" />;
    }
  };

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "userInfo",
        header: "User Info",
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {row.original.firstName?.[0]?.toUpperCase()}
              {row.original.lastName?.[0]?.toUpperCase()}
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
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            {row.original.phoneNumber ? (
              <>
                <FaPhone
                  size={12}
                  className="text-gray-400 dark:text-gray-500"
                />
                <span className="text-sm">
                  {row.original.countryCode} {row.original.phoneNumber}
                </span>
              </>
            ) : (
              <span className="text-xs text-gray-400">-</span>
            )}
          </div>
        ),
      },
      {
        accessorKey: "country",
        header: "Location",
        cell: ({ row }) => {
          const country = row.original.country;
          const city = row.original.city;
          if (!country && !city)
            return <span className="text-xs text-gray-400">-</span>;
          return (
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
              <FaMapMarkerAlt size={12} className="text-gray-400" />
              <span>
                {city ? `${city}, ` : ""}
                {country}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ getValue }) => {
          const role = getValue() as string;
          return (
            <div className="flex items-center gap-2">
              {getRoleIcon(role)}
              <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                {role}
              </span>
            </div>
          );
        },
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

  const { users: data, total: rowCount } = stableData;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            User Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage system users and admins.
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
        searchPlaceholder="Search by name, email, or phone..."
        loading={loading}
        // Server-side props
        rowCount={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        onEditPage={(row) => handleEditClick(row)}
        onBulkDelete={handleBulkDelete}
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
            undone.
          </p>
          {itemToDelete && (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600 text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {itemToDelete.firstName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                    {itemToDelete.firstName} {itemToDelete.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {itemToDelete.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default UserList;
