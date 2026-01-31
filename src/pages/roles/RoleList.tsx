import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { ReusableTable } from "../../components/common/ReusableTable";
import Modal from "../../components/common/Modal";
import {
  FaShieldAlt,
  FaEdit,
  FaTrash,
  FaCrown,
  FaCheckCircle,
  FaBan,
} from "react-icons/fa";
import {
  SUPER_ADMIN_PERMISSIONS,
  ADMIN_PERMISSIONS,
  MOBILE_APP_USER_PERMISSIONS,
  countPermissions,
  type ModulePermissions,
} from "../../constants/permissions";
import { notifySuccess } from "../../utils/toastUtils";

// Types
type Role = {
  id: number;
  name: string;
  description: string;
  permissions: ModulePermissions;
  totalPermissions: number;
  status: "Active" | "Inactive";
  createdDate: string;
  isDefault: boolean;
  isEditable: boolean; // Super Admin cannot be edited
};

// Mock Data Generator
const generateData = (): Role[] => {
  const baseData: Role[] = [
    {
      id: 1,
      name: "Super Admin",
      description: "Full system access with all permissions",
      permissions: SUPER_ADMIN_PERMISSIONS,
      totalPermissions: countPermissions(SUPER_ADMIN_PERMISSIONS),
      status: "Active",
      createdDate: "2023-01-01",
      isDefault: true,
      isEditable: false, // Cannot edit Super Admin
    },
    {
      id: 2,
      name: "Admin",
      description:
        "Administrative access with most permissions except role management",
      permissions: ADMIN_PERMISSIONS,
      totalPermissions: countPermissions(ADMIN_PERMISSIONS),
      status: "Active",
      createdDate: "2023-01-01",
      isDefault: true,
      isEditable: true,
    },
    {
      id: 3,
      name: "Mobile App User",
      description:
        "Default role for mobile application users with view-only access",
      permissions: MOBILE_APP_USER_PERMISSIONS,
      totalPermissions: countPermissions(MOBILE_APP_USER_PERMISSIONS),
      status: "Active",
      createdDate: "2023-01-01",
      isDefault: true,
      isEditable: true,
    },
    {
      id: 4,
      name: "Editor",
      description: "Can create and edit content but cannot delete",
      permissions: {
        dashboard: { view: true, create: false, edit: false, delete: false },
        wallpapers: { view: true, create: true, edit: true, delete: false },
        categories: { view: true, create: true, edit: true, delete: false },
        notifications: { view: true, create: true, edit: true, delete: false },
        admin_users: { view: true, create: false, edit: false, delete: false },
        app_users: { view: true, create: false, edit: false, delete: false },
        roles: { view: true, create: false, edit: false, delete: false },
        settings: { view: true, create: false, edit: false, delete: false },
      },
      totalPermissions: 17,
      status: "Active",
      createdDate: "2023-02-15",
      isDefault: false,
      isEditable: true,
    },
    {
      id: 5,
      name: "Viewer",
      description: "Read-only access to all modules",
      permissions: {
        dashboard: { view: true, create: false, edit: false, delete: false },
        wallpapers: { view: true, create: false, edit: false, delete: false },
        categories: { view: true, create: false, edit: false, delete: false },
        notifications: {
          view: true,
          create: false,
          edit: false,
          delete: false,
        },
        admin_users: { view: true, create: false, edit: false, delete: false },
        app_users: { view: true, create: false, edit: false, delete: false },
        roles: { view: true, create: false, edit: false, delete: false },
        settings: { view: true, create: false, edit: false, delete: false },
      },
      totalPermissions: 8,
      status: "Active",
      createdDate: "2023-03-10",
      isDefault: false,
      isEditable: true,
    },
    {
      id: 6,
      name: "Content Manager",
      description: "Manages wallpapers and categories only",
      permissions: {
        dashboard: { view: true, create: false, edit: false, delete: false },
        wallpapers: { view: true, create: true, edit: true, delete: true },
        categories: { view: true, create: true, edit: true, delete: true },
        notifications: {
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
        admin_users: { view: false, create: false, edit: false, delete: false },
        app_users: { view: true, create: false, edit: false, delete: false },
        roles: { view: false, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false },
      },
      totalPermissions: 10,
      status: "Active",
      createdDate: "2023-04-20",
      isDefault: false,
      isEditable: true,
    },
  ];

  return baseData;
};

const RoleList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(() => generateData());

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Role | null>(null);

  const handleDeleteClick = (role: Role) => {
    if (role.isDefault) {
      // Don't allow deleting default roles
      return;
    }
    setItemToDelete(role);
    setDeleteModalOpen(true);
  };

  const handleEditClick = (role: Role) => {
    if (!role.isEditable) {
      // Don't allow editing Super Admin
      return;
    }
    navigate(`/roles/edit/${role.id}`);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData((prev) => prev.filter((item) => item.id !== itemToDelete.id));
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleBulkDelete = async (selected: Role[]) => {
    if (window.confirm(`Delete ${selected.length} roles?`)) {
      const ids = selected.map((r) => r.id);
      setData((prev) => prev.filter((item) => !ids.includes(item.id)));
      notifySuccess(`${selected.length} roles deleted`);
    }
  };

  const columns = useMemo<ColumnDef<Role>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Role Name",
        cell: ({ getValue, row }) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
              <FaShieldAlt size={18} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  {getValue() as string}
                </span>
                {row.original.isDefault && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                    <FaCrown size={10} className="mr-1" />
                    Default
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {row.original.description}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "totalPermissions",
        header: "Permissions",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {getValue() as number}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              permissions
            </span>
          </div>
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
                status === "Active"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
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
        accessorKey: "createdDate",
        header: "Created",
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
              disabled={!row.original.isEditable}
              className={`transition-colors p-2 rounded-full ${
                !row.original.isEditable
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              title={
                !row.original.isEditable
                  ? "Cannot edit Super Admin role"
                  : "Edit Role"
              }
            >
              <FaEdit size={14} />
            </button>
            <button
              onClick={() => handleDeleteClick(row.original)}
              disabled={row.original.isDefault}
              className={`transition-colors p-2 rounded-full ${
                row.original.isDefault
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              title={
                row.original.isDefault
                  ? "Cannot delete default role"
                  : "Delete Role"
              }
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
            Roles & Permissions
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage user roles and their module permissions.
          </p>
        </div>
        <button
          onClick={() => navigate("/roles/add")}
          className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 flex items-center gap-2"
        >
          <span>+</span> Add New Role
        </button>
      </div>

      <ReusableTable
        data={data}
        columns={columns}
        searchPlaceholder="Search roles by name or description..."
        onBulkDelete={handleBulkDelete}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Role?"
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
            Are you sure you want to delete this role? This action cannot be
            undone and will affect all users assigned to this role.
          </p>
          {itemToDelete && (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600 text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                  <FaShieldAlt size={18} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                    {itemToDelete.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {itemToDelete.totalPermissions} permissions
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

export default RoleList;
