import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

type AppUserFormData = {
  name: string;
  email: string;
  phone: string;
  platform: "Android" | "iOS" | "Both";
  country: string;
  city: string;
  status: "Active" | "Suspended" | "Banned";
  isPremium: boolean;
};

const AddAppUser: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Mock data for edit mode
  const [formData, setFormData] = useState<AppUserFormData>({
    name: isEditMode ? "John Doe" : "",
    email: isEditMode ? "john.doe@example.com" : "",
    phone: isEditMode ? "+1 555-0123" : "",
    platform: isEditMode ? "Android" : "Android",
    country: isEditMode ? "United States" : "",
    city: isEditMode ? "New York" : "",
    status: isEditMode ? "Active" : "Active",
    isPremium: isEditMode ? false : false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof AppUserFormData, string>>
  >({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof AppUserFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AppUserFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log(
        isEditMode ? "Updating app user:" : "Creating app user:",
        formData,
      );
      // TODO: API call to create/update app user
      navigate("/app-users/list");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/app-users/list")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Back to App Users"
          >
            <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isEditMode ? "Edit App User" : "Add App User"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isEditMode
                ? "Update mobile app user information"
                : "Create a new mobile app user"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <FaUser className="text-indigo-600 dark:text-indigo-400" />
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-gray-100 ${
                  errors.name
                    ? "border-red-300 dark:border-red-600"
                    : "border-gray-200 dark:border-gray-600"
                }`}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope
                    className="text-gray-400 dark:text-gray-500"
                    size={14}
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-gray-100 ${
                    errors.email
                      ? "border-red-300 dark:border-red-600"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                  placeholder="user@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaPhone
                    className="text-gray-400 dark:text-gray-500"
                    size={14}
                  />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-gray-100 ${
                    errors.phone
                      ? "border-red-300 dark:border-red-600"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                  placeholder="+1 555-0123"
                />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Platform */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Platform <span className="text-red-500">*</span>
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-gray-100"
              >
                <option value="Android">Android</option>
                <option value="iOS">iOS</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <FaMapMarkerAlt className="text-indigo-600 dark:text-indigo-400" />
            Location Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-gray-100 ${
                  errors.country
                    ? "border-red-300 dark:border-red-600"
                    : "border-gray-200 dark:border-gray-600"
                }`}
                placeholder="United States"
              />
              {errors.country && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {errors.country}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-gray-100 ${
                  errors.city
                    ? "border-red-300 dark:border-red-600"
                    : "border-gray-200 dark:border-gray-600"
                }`}
                placeholder="New York"
              />
              {errors.city && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                  {errors.city}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Account Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Account Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all dark:text-gray-100"
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Banned">Banned</option>
              </select>
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                {formData.status === "Active" &&
                  "User can access the app normally"}
                {formData.status === "Suspended" &&
                  "User access is temporarily restricted"}
                {formData.status === "Banned" && "User is permanently blocked"}
              </p>
            </div>

            {/* Premium Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subscription
              </label>
              <div className="flex items-center gap-3 mt-3">
                <input
                  type="checkbox"
                  name="isPremium"
                  checked={formData.isPremium}
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Premium User
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Grant premium features access
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/app-users/list")}
            className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-colors flex items-center gap-2"
          >
            <FaSave />
            {isEditMode ? "Update User" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAppUser;
