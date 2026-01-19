import React, { useState, useRef } from "react";
import { FaSave, FaArrowLeft, FaCloudUploadAlt, FaImage } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const AddCategory: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    parentId: "",
    description: "",
  });
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);

  // Mock Parent Categories
  const parents = [
    { id: "1", name: "Wallpapers" },
    { id: "2", name: "Ringtones" },
    { id: "3", name: "Live Wallpapers" },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetImage(file);
    }
  };

  const validateAndSetImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, icon: "Please upload an image file (PNG, JPG)." });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors({ ...errors, icon: "Image size should be less than 2MB." });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setIconPreview(reader.result as string);
      setErrors({ ...errors, icon: "" });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetImage(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }

    if (!iconPreview) {
      newErrors.icon = "Category icon is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit logic here
    console.log("Submitting:", { ...formData, icon: iconPreview });
    alert("Category created successfully!");
    navigate("/content/categories");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/content/categories"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Add New Category
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Create a new category for your content
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 font-medium"
        >
          <FaSave />
          <span>Save Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.name
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                } focus:outline-none focus:ring-2 transition-all`}
                placeholder="e.g. Abstract Art"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Category (Optional)
              </label>
              <select
                name="parentId"
                value={formData.parentId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
              >
                <option value="">No Parent (Root Category)</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Select a parent to make this a sub-category.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                placeholder="Brief description of this category..."
              />
            </div>
          </div>
        </div>

        {/* Right Column - Icon Upload */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Category Icon <span className="text-red-500">*</span>
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all aspect-square ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50"
                  : errors.icon
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />

              {iconPreview ? (
                <div className="relative w-full h-full">
                  <img
                    src={iconPreview}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg text-white font-medium">
                    Change Icon
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FaCloudUploadAlt size={24} />
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    Click to upload
                  </div>
                  <p className="text-xs text-gray-500">
                    or drag and drop <br />
                    PNG, JPG (max 2MB)
                  </p>
                </div>
              )}
            </div>
            {errors.icon && (
              <p className="mt-2 text-sm text-center text-red-500">
                {errors.icon}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
