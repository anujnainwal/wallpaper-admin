import React, { useState, useEffect } from "react";
import {
  FaCloudUploadAlt,
  FaTimes,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { CATEGORIES } from "../constants/categories";
import SearchableSelect from "../components/common/SearchableSelect";

interface UploadFile {
  id: string;
  name: string;
  size: string;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
}

const AddWallpaperPage: React.FC = () => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [selectedParentId, setSelectedParentId] = useState("");
  const [selectedChildId, setSelectedChildId] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Derived Categories
  const parentCategories = CATEGORIES.filter((c) => c.parentId === null);
  const childCategories = CATEGORIES.filter(
    (c) => c.parentId === selectedParentId,
  );

  // Reset child category when parent changes
  useEffect(() => {
    setSelectedChildId("");
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

    const fileArray = Array.from(newFiles).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      preview: URL.createObjectURL(file), // Create preview URL
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

  const handlePublish = () => {
    if (files.length === 0) return;

    setIsUploading(true);

    // Set all pending files to uploading
    setFiles((prev) =>
      prev.map((f) =>
        f.status === "pending" || f.status === "error"
          ? { ...f, status: "uploading" as const, progress: 0 }
          : f,
      ),
    );

    const interval = setInterval(() => {
      setFiles((prev) => {
        let allDone = true;

        const newFiles = prev.map((f) => {
          if (f.status === "uploading") {
            // Random progress increment between 5-15
            const increment = Math.floor(Math.random() * 10) + 5;
            const newProgress = Math.min(f.progress + increment, 100);

            if (newProgress < 100) {
              allDone = false;
              return { ...f, progress: newProgress };
            } else {
              return { ...f, progress: 100, status: "done" as const };
            }
          }
          if (f.status !== "done") allDone = false;
          return f;
        });

        if (allDone) {
          clearInterval(interval);
          setIsUploading(false);
          // Remove uploaded files after a short delay so user sees 100%
          setTimeout(() => {
            setFiles((current) => current.filter((f) => f.status !== "done"));
          }, 1000);
        }

        return newFiles;
      });
    }, 500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Upload Wallpapers
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Bulk upload high-resolution wallpapers to your collection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upload & Queue (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Zone */}
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

          {/* Upload Queue */}
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
                    {/* Preview */}
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

                    {/* Info */}
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
                      {/* Progress Bar */}
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
        </div>

        {/* Right Column: Batch Settings (1/3 width) */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-100/50 dark:shadow-none sticky top-6">
            <div className="p-6 border-b border-gray-50 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white">
                Batch Settings
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Apply metadata to all valid uploads.
              </p>
            </div>

            <div className="p-6 space-y-5">
              {/* Parent Category */}
              <SearchableSelect
                label="Category"
                placeholder="Select Category..."
                options={parentCategories}
                value={selectedParentId}
                onChange={setSelectedParentId}
              />

              {/* Child Category (Conditional) */}
              {childCategories.length > 0 && (
                <div className="animate-fade-in-up">
                  <SearchableSelect
                    label="Sub-Category"
                    placeholder="Select Sub-Category..."
                    options={childCategories}
                    value={selectedChildId}
                    onChange={setSelectedChildId}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Format
                </label>
                <div className="flex gap-2">
                  {["Portrait", "Landscape", "Desktop"].map((format) => (
                    <button
                      key={format}
                      className="flex-1 py-2 text-xs font-medium border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 focus:bg-indigo-50 dark:focus:bg-indigo-900/40 focus:text-indigo-600 dark:focus:text-indigo-400 focus:border-indigo-200 dark:focus:border-indigo-800 transition-all"
                    >
                      {format}
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
                  placeholder="e.g. dark, amoled, neon..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div className="pt-2">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50 flex gap-3">
                  <FaInfoCircle className="text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    Files will be automatically optimized for web performance
                    upon upload.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-50 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-700/30 rounded-b-3xl">
              <button
                onClick={handlePublish}
                disabled={isUploading || files.length === 0}
                className={`w-full py-3.5 font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                  isUploading || files.length === 0
                    ? "bg-indigo-400 text-white cursor-not-allowed shadow-none"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300 transform active:scale-[0.98]"
                }`}
              >
                {isUploading ? (
                  <>
                    <FaCloudUploadAlt className="text-lg animate-bounce" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt className="text-lg" />
                    Publish {files.length} Wallpapers
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
