import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaShieldAlt,
  FaCheckSquare,
  FaSquare,
} from "react-icons/fa";
import {
  MODULE_LABELS,
  PERMISSION_LABELS,
  getAllModules,
  getAllPermissions,
  type ModulePermissions,
} from "../../constants/permissions";

type RoleFormData = {
  name: string;
  description: string;
  status: "Active" | "Inactive";
  permissions: ModulePermissions;
};

const AddRole: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    description: "",
    status: "Active",
    permissions: {},
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof RoleFormData, string>>
  >({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RoleFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePermissionChange = (
    module: string,
    permission: string,
    checked: boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module],
          [permission]: checked,
        },
      },
    }));
  };

  const handleSelectAllModule = (module: string, checked: boolean) => {
    const allPermissions = getAllPermissions().reduce(
      (acc, perm) => ({ ...acc, [perm]: checked }),
      {},
    );
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: allPermissions,
      },
    }));
  };

  const isModuleFullySelected = (module: string): boolean => {
    const modulePerms = formData.permissions[module];
    if (!modulePerms) return false;
    return getAllPermissions().every((perm) => modulePerms[perm] === true);
  };

  const isModulePartiallySelected = (module: string): boolean => {
    const modulePerms = formData.permissions[module];
    if (!modulePerms) return false;
    const selectedCount = getAllPermissions().filter(
      (perm) => modulePerms[perm] === true,
    ).length;
    return selectedCount > 0 && selectedCount < getAllPermissions().length;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RoleFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Role name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // TODO: Submit to API
      console.log("Form submitted:", formData);
      navigate("/roles/list");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/roles/list")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
        >
          <FaArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isEditMode ? "Edit Role" : "Add New Role"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isEditMode
              ? "Update role information and permissions"
              : "Create a new role with custom permissions"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <FaShieldAlt className="text-indigo-600 dark:text-indigo-400" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-gray-100 ${
                  errors.name
                    ? "border-red-300 dark:border-red-600"
                    : "border-gray-200 dark:border-gray-600"
                }`}
                placeholder="e.g., Content Manager"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-gray-100"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-gray-100 resize-none ${
                  errors.description
                    ? "border-red-300 dark:border-red-600"
                    : "border-gray-200 dark:border-gray-600"
                }`}
                placeholder="Describe the role and its responsibilities..."
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Permissions Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Module Permissions
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Select permissions for each module. Use "Select All" to quickly
            grant all permissions for a module.
          </p>

          <div className="space-y-4">
            {getAllModules().map((module) => {
              const isFullySelected = isModuleFullySelected(module);
              const isPartiallySelected = isModulePartiallySelected(module);

              return (
                <div
                  key={module}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
                >
                  {/* Module Header with Select All */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {MODULE_LABELS[module]}
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        handleSelectAllModule(module, !isFullySelected)
                      }
                      className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                    >
                      {isFullySelected ? (
                        <FaCheckSquare size={16} />
                      ) : (
                        <FaSquare
                          size={16}
                          className={
                            isPartiallySelected ? "text-indigo-400" : ""
                          }
                        />
                      )}
                      <span className="font-medium">
                        {isFullySelected ? "Deselect All" : "Select All"}
                      </span>
                    </button>
                  </div>

                  {/* Permission Checkboxes */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {getAllPermissions().map((permission) => {
                      const isChecked =
                        formData.permissions[module]?.[permission] === true;

                      return (
                        <label
                          key={permission}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              handlePermissionChange(
                                module,
                                permission,
                                e.target.checked,
                              )
                            }
                            className="w-4 h-4 text-indigo-600 dark:text-indigo-500 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-2 cursor-pointer"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                            {PERMISSION_LABELS[permission]}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/roles/list")}
            className="px-6 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-colors flex items-center gap-2"
          >
            <FaSave />
            {isEditMode ? "Update Role" : "Create Role"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRole;
