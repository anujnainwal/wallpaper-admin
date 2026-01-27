import React, { useState, useEffect } from "react";
import {
  FaCloudUploadAlt,
  FaTimes,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { categoryService, type Category } from "../services/categoryService";
import { wallpaperService } from "../services/wallpaperService";
import SearchableSelect from "../components/common/SearchableSelect";
import toast from "react-hot-toast";

interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: string;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
}

const AddWallpaperPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [files, setFiles] = useState<UploadFile[]>([]);
  const [selectedParentId, setSelectedParentId] = useState("");
  const [selectedChildId, setSelectedChildId] = useState("");
  const [tags, setTags] = useState("");
  const [format, setFormat] = useState("Portrait");
  const [status, setStatus] = useState("active");
  const [isUploading, setIsUploading] = useState(false);

  // Edit Mode specific state
  const [editTitle, setEditTitle] = useState("");
  const [currentImagePreview, setCurrentImagePreview] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Wallpaper for Edit
  useEffect(() => {
    if (isEditMode && id) {
      const fetchWallpaper = async () => {
        try {
          const res: any = await wallpaperService.getById(id);
          const data = res.data || res; // Handle varying response structures

          setEditTitle(data.title);
          setTags(Array.isArray(data.tags) ? data.tags.join(", ") : data.tags);
          setFormat(data.format || "Portrait");
          setStatus(data.status || "active");
          setCurrentImagePreview(data.image); // Or thumbnail

          // Set Category logic
          if (data.category) {
            // Need to determine if it's a parent or child
            const catId =
              typeof data.category === "object"
                ? data.category._id
                : data.category;
            // We'll set it as parent initially, effect will sort it out or we need better logic if we have the full hierarchy
            // For simplicity, trying to find it in categories list:
            // Note: This simple logic assumes flattened list or needs refinement based on actual cat structure.
            // We'll just set Parent for now if simple, but real app might need to find parent of child.
            // For now, let's just attempt to set it.
            // If we had the full category object with parent populated:
            const catObj = categories.find((c) => c._id === catId);
            if (catObj) {
              if (catObj.parent) {
                setSelectedParentId(
                  typeof catObj.parent === "object"
                    ? (catObj.parent as any)._id
                    : catObj.parent,
                );
                setSelectedChildId(catId);
              } else {
                setSelectedParentId(catId);
              }
            }
          }
        } catch (error) {
          toast.error("Failed to load wallpaper details");
          navigate("/wallpapers/list");
        }
      };
      if (categories.length > 0) {
        // Wait for categories to load to map correctly
        fetchWallpaper();
      }
    }
  }, [isEditMode, id, categories.length]); // Added categories.length dependency

  // Derived Categories
  const parentCategories = categories
    .filter((c) => !c.parent)
    .map((c) => ({ id: c._id!, name: c.name }));

  const childCategories = categories
    .filter((c) => c.parent?._id === selectedParentId)
    .map((c) => ({ id: c._id!, name: c.name }));

  // Reset child category when parent changes (only if NOT in initial edit load... ideally)
  // Simple fix: check if child is valid for parent
  useEffect(() => {
    if (!childCategories.find((c) => c.id === selectedChildId)) {
      setSelectedChildId("");
    }
  }, [selectedParentId]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    if (isEditMode) {
      // Replace single file
      const file = newFiles[0];
      setNewImageFile(file);
      setCurrentImagePreview(URL.createObjectURL(file));
      return;
    }

    // Bulk Mode
    const fileArray = Array.from(newFiles).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: formatFileSize(file.size),
      preview: URL.createObjectURL(file),
      status: "pending" as const,
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...fileArray]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    if (isUploading) return;
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handlePublish = async () => {
    if (!isEditMode && files.length === 0) return;
    setIsUploading(true);

    const categoryId = selectedChildId || selectedParentId;

    if (isEditMode && id) {
      // Handle Update
      try {
        const formData = new FormData();
        if (newImageFile) formData.append("image", newImageFile);
        formData.append("title", editTitle);
        formData.append("category", categoryId);
        formData.append("tags", tags);
        formData.append("format", format);
        formData.append("status", status);

        await wallpaperService.update(id, formData);
        toast.success("Wallpaper updated successfully");
        navigate("/wallpapers/list");
      } catch (error) {
        console.error("Update failed", error);
        toast.error("Failed to update wallpaper");
      }
    } else {
      // Handle Create (Bulk)
      for (const fileItem of files) {
        if (fileItem.status === "done") continue;

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? { ...f, status: "uploading", progress: 0 }
              : f,
          ),
        );

        try {
          const formData = new FormData();
          formData.append("image", fileItem.file);
          formData.append("title", fileItem.name.replace(/\.[^/.]+$/, ""));
          formData.append("category", categoryId);
          if (tags) formData.append("tags", tags);
          formData.append("format", format);
          formData.append("status", status); // Add status

          await wallpaperService.create(formData);

          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id
                ? { ...f, status: "done", progress: 100 }
                : f,
            ),
          );
        } catch (error) {
          console.error("Upload failed", error);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id ? { ...f, status: "error" } : f,
            ),
          );
        }
      }
      toast.success("Batch processing complete");
    }
    setIsUploading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          {isEditMode ? "Edit Wallpaper" : "Upload Wallpapers"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {isEditMode
            ? "Update wallpaper details and status."
            : "Bulk upload high-resolution wallpapers to your collection."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {isEditMode ? (
            /* Edit Mode: Single Image + Title Input */
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                />
              </div>

              {/* Image Preview & Replace */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Preview Image
                </label>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 group">
                  <img
                    src={currentImagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl font-semibold hover:bg-white/30 transition-all">
                      Change Image
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFiles(e.target.files)}
                      />
                    </label>
                  </div>
                </div>
                {newImageFile && (
                  <p className="text-xs text-emerald-500 font-medium">
                    New image selected: {newImageFile.name}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Create Mode: Upload Queue */
            <>
              <div
                className="group relative bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-indigo-100 dark:border-indigo-900 hover:border-indigo-400 hover:bg-indigo-50/10 dark:hover:bg-indigo-900/10 transition-all duration-300 cursor-pointer overflow-hidden"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-indigo-100">
                    <FaCloudUploadAlt className="text-4xl text-indigo-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      Drag & drop files here
                    </p>
                    <p className="text-sm text-gray-500">
                      or click to browse from your computer
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700">
                    <span>JPG, PNG, WEBP</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                    <span>Max 20MB per file</span>
                  </div>
                </div>
              </div>

              {files.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center bg-gray-50/30 dark:bg-gray-700/30">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                      Upload Queue ({files.length})
                    </h3>
                    <button
                      onClick={() => setFiles([])}
                      className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="p-4 flex items-center gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors group"
                      >
                        <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 overflow-hidden relative shrink-0">
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                          {file.status === "done" && (
                            <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                              <FaCheckCircle className="text-white drop-shadow-sm" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate pr-4">
                              {file.name}
                            </p>
                            <button
                              onClick={() => removeFile(file.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 opacity-0 group-hover:opacity-100"
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            {file.size}
                          </p>
                          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                file.status === "done"
                                  ? "bg-emerald-500"
                                  : "bg-indigo-500"
                              }`}
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Column: Settings */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-100/50 dark:shadow-none sticky top-6">
            <div className="p-6 border-b border-gray-50 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white">
                {isEditMode ? "Wallpaper Settings" : "Batch Settings"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {isEditMode
                  ? "Manage metadata."
                  : "Apply metadata to all uploads."}
              </p>
            </div>

            <div className="p-6 space-y-5">
              <SearchableSelect
                label="Category"
                placeholder="Select Category..."
                options={parentCategories}
                value={selectedParentId}
                onChange={setSelectedParentId}
                isLoading={loadingCategories}
              />

              {childCategories.length > 0 && (
                <div className="animate-fade-in-up">
                  <SearchableSelect
                    label="Sub-Category"
                    placeholder="Select Sub-Category..."
                    options={childCategories}
                    value={selectedChildId}
                    onChange={setSelectedChildId}
                    isLoading={loadingCategories}
                  />
                </div>
              )}

              {/* Status Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Format
                </label>
                <div className="flex gap-2">
                  {["Portrait", "Landscape", "Desktop"].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`flex-1 py-2 text-xs font-medium border rounded-lg transition-all ${
                        format === fmt
                          ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/40 dark:border-indigo-800 dark:text-indigo-400"
                          : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tags
                </label>
                <textarea
                  rows={3}
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. dark, amoled, neon..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div className="pt-2">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50 flex gap-3">
                  <FaInfoCircle className="text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    files will be automatically optimized for web.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-50 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-700/30 rounded-b-3xl">
              <button
                onClick={handlePublish}
                disabled={isUploading || (!isEditMode && files.length === 0)}
                className={`w-full py-3.5 font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                  isUploading || (!isEditMode && files.length === 0)
                    ? "bg-indigo-400 text-white cursor-not-allowed shadow-none"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300 transform active:scale-[0.98]"
                }`}
              >
                {isUploading ? (
                  <>
                    <FaCloudUploadAlt className="text-lg animate-bounce" />
                    {isEditMode ? "Updating..." : "Uploading..."}
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt className="text-lg" />
                    {isEditMode
                      ? "Update Wallpaper"
                      : `Publish ${files.length} Wallpapers`}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWallpaperPage;
