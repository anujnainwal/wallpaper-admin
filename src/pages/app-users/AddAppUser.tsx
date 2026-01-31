import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaArrowLeft,
  FaSave,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaCloudUploadAlt,
  FaTrash,
} from "react-icons/fa";
import SearchableSelect from "../../components/common/SearchableSelect";
import csc from "countrycitystatejson";
import { userService } from "../../services/userService";
import toast from "react-hot-toast";

type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  country: string;
  state: string;
  city: string;
  address: string;
  role: "user";
  accountStatus: "Active" | "Inactive" | "Suspended";
  password: string;
  confirmPassword: string;
};

const AddAppUser: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "",
    country: "",
    state: "",
    city: "",
    address: "",
    role: "user",
    accountStatus: "Active",
    password: "",
    confirmPassword: "",
  });

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormData, string>>
  >({});

  // Location Data
  const countries = useMemo(() => csc.getCountries(), []);

  // Derived state for location dependents
  const selectedCountryObj = useMemo(
    () => countries.find((c: any) => c.name === formData.country),
    [formData.country, countries],
  );

  const states = useMemo(() => {
    if (!selectedCountryObj) return [];
    return csc.getStatesByShort(selectedCountryObj.shortName) || [];
  }, [selectedCountryObj]);

  const cities = useMemo(() => {
    if (!selectedCountryObj || !formData.state) return [];
    return csc.getCities(selectedCountryObj.shortName, formData.state) || [];
  }, [selectedCountryObj, formData.state]);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchUser = async () => {
        try {
          const res: any = await userService.getById(id);
          const data = res.data || res;
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phone: data.phoneNumber || "",
            countryCode: data.countryCode || "",
            country: data.country || "",
            state: data.state || "",
            city: data.city || "",
            address: data.address || "",
            role: "user",
            accountStatus: data.accountStatus || "Active",
            password: "",
            confirmPassword: "",
          });
          // Note: If backend provides existing profile pic URL, setPreviewUrl here
          // if (data.profilePicture) setPreviewUrl(data.profilePicture);
        } catch (error) {
          toast.error("Failed to load user");
          navigate("/app-users/list");
        }
      };
      fetchUser();
    }
  }, [isEditMode, id, navigate]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith("http")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof UserFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCountryCodeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, countryCode: value }));
  };

  const handleCountryChange = (value: string) => {
    const countryObj = countries.find((c: any) => c.name === value);
    setFormData((prev) => ({
      ...prev,
      country: value,
      state: "",
      city: "",
      countryCode: countryObj?.phone
        ? `+${countryObj.phone}`
        : prev.countryCode,
    }));
  };

  const handleStateChange = (value: string) => {
    setFormData((prev) => ({ ...prev, state: value, city: "" }));
  };

  const handleCityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, city: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeProfilePic = () => {
    setProfilePic(null);
    setPreviewUrl("");
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!isEditMode) {
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 8)
        newErrors.password = "Password must be at least 8 characters";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload: any = new FormData();
      payload.append("firstName", formData.firstName);
      payload.append("lastName", formData.lastName);
      payload.append("email", formData.email);
      payload.append("phoneNumber", formData.phone);
      payload.append("countryCode", formData.countryCode);
      payload.append("country", formData.country);
      payload.append("state", formData.state);
      payload.append("city", formData.city);
      payload.append("address", formData.address);
      payload.append("role", "user");
      payload.append("accountStatus", formData.accountStatus);

      if (formData.password) payload.append("password", formData.password);
      if (profilePic) payload.append("profilePicture", profilePic);

      if (isEditMode && id) {
        await userService.update(id, payload);
        toast.success("App User updated successfully");
      } else {
        await userService.create(payload);
        toast.success("App User created successfully");
      }
      navigate("/app-users/list");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/app-users/list")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
        >
          <FaArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isEditMode ? "Edit App User" : "Add App User"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isEditMode
              ? "Update app user details"
              : "Register a new application user manually"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-gray-400 text-4xl" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors shadow-sm">
              <FaCloudUploadAlt size={16} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {previewUrl && (
              <button
                type="button"
                onClick={removeProfilePic}
                className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-sm transform translate-x-1/2 -translate-y-1/2"
              >
                <FaTrash size={12} />
              </button>
            )}
          </div>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Allowed *.jpeg, *.jpg, *.png, *.gif
          </p>
        </div>

        {/* Personal Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <FaUser className="text-indigo-600 dark:text-indigo-400" />
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Email Address *
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <SearchableSelect
                label="Country Code"
                options={countries
                  .filter((c: any) => c.phone)
                  .map((c: any) => ({
                    id: `+${c.phone}`,
                    name: `+${c.phone} (${c.name})`,
                  }))}
                value={formData.countryCode}
                onChange={handleCountryCodeChange}
                placeholder="+1"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  placeholder="123-456-7890"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <FaMapMarkerAlt className="text-indigo-600 dark:text-indigo-400" />
            Location Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
            <div>
              <SearchableSelect
                label="Country"
                options={countries.map((c: any) => ({
                  id: c.name,
                  name: c.name,
                }))}
                value={formData.country}
                onChange={handleCountryChange}
                placeholder="Select Country"
              />
            </div>
            <div>
              <SearchableSelect
                label="State"
                options={states.map((s: string) => ({ id: s, name: s }))}
                value={formData.state}
                onChange={handleStateChange}
                disabled={!formData.country}
                placeholder="Select State"
              />
            </div>
            <div>
              <SearchableSelect
                label="City"
                options={cities.map((c: string) => ({ id: c, name: c }))}
                value={formData.city}
                onChange={handleCityChange}
                disabled={!formData.state}
                placeholder="Select City"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Full Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
              placeholder="Street Address, Zip Code, etc."
            />
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <FaShieldAlt className="text-indigo-600 dark:text-indigo-400" />
            Account Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Status
              </label>
              <select
                name="accountStatus"
                value={formData.accountStatus}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            {!isEditMode && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={16} />
                      ) : (
                        <FaEye size={16} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash size={16} />
                      ) : (
                        <FaEye size={16} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/app-users/list")}
            className="px-6 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg transition-colors flex items-center gap-2"
          >
            <FaSave />
            {isSubmitting ? "Saving..." : "Save App User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAppUser;
