import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { wallpaperService, type Wallpaper } from "../services/wallpaperService";
import {
  FaArrowLeft,
  FaDownload,
  FaEdit,
  FaTrash,
  FaExpand,
  FaInfoCircle,
  FaCopy,
} from "react-icons/fa";
import toast from "react-hot-toast";

const WallpaperDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [wallpaper, setWallpaper] = React.useState<Wallpaper | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<any>(null);

  const fetchWallpaper = React.useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const res = await wallpaperService.getById(id);
      // Response structure is { success: true, data: { ... } } or just { ... }
      setWallpaper(res.data || res);
      setError(null);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchWallpaper();
  }, [fetchWallpaper]);

  const handleDelete = async () => {
    if (!wallpaper?._id) return;
    if (!window.confirm("Are you sure you want to delete this wallpaper?"))
      return;

    try {
      await wallpaperService.delete(wallpaper._id);
      toast.success("Wallpaper deleted successfully");
      navigate("/wallpapers/list");
    } catch (error) {
      toast.error("Failed to delete wallpaper");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Loading details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !wallpaper) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Wallpaper not found
          </h3>
          <button
            onClick={() => navigate("/wallpapers/list")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-8">
      {/* Header Navigation covering the top */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Wallpaper Details
            </h1>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mt-1">
              <span>ID: {wallpaper._id}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span
                className={`px-2 py-0.5 rounded-full capitalize ${
                  wallpaper.status === "active"
                    ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                    : "text-amber-500 bg-amber-50 dark:bg-amber-500/10"
                }`}
              >
                {wallpaper.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/wallpapers/edit/${wallpaper._id}`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium text-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95"
          >
            <FaEdit size={14} /> Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-medium text-sm rounded-xl border border-red-100 dark:border-red-900/20 shadow-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-all active:scale-95"
          >
            <FaTrash size={14} /> Delete
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Preview (Immersive) */}
        <div className="lg:col-span-8 flex flex-col gap-6 sticky top-8">
          <div className="group relative  overflow-hidden bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 shadow-2xl aspect-auto min-h-[60vh] flex items-center justify-center">
            {/* Blurred Background */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 blur-3xl scale-125 pointer-events-none transition-opacity duration-700"
              style={{ backgroundImage: `url(${wallpaper.image})` }}
            />

            <img
              src={wallpaper.image}
              alt={wallpaper.title}
              className="relative w-auto h-auto max-w-full max-h-[80vh] object-contain z-10 shadow-xl transition-transform duration-500 group-hover:scale-[1.01]"
            />

            <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <a
                href={wallpaper.image}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md rounded-full shadow-lg transition-all transform hover:scale-105"
                title="Open original"
              >
                <FaExpand size={18} />
              </a>
            </div>
          </div>

          {/* Color Palette (Subtle) */}
          {wallpaper.colors && wallpaper.colors.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {wallpaper.colors.map((color, idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 rounded-full shadow-sm border-2 border-white dark:border-gray-800 cursor-pointer hover:scale-110 transition-transform relative group"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    navigator.clipboard.writeText(color);
                    toast.success(`Copied ${color}`);
                  }}
                  title={color}
                >
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {color}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions (Search UI Style) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Header Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                {typeof wallpaper.category === "object"
                  ? wallpaper.category.name
                  : "Uncategorized"}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide border ${
                  wallpaper.status === "active"
                    ? "border-emerald-200 text-emerald-600 dark:border-emerald-800 dark:text-emerald-400"
                    : "border-amber-200 text-amber-600 dark:border-amber-800 dark:text-amber-400"
                }`}
              >
                {wallpaper.status}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
              {wallpaper.title}
            </h1>

            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <span className="font-medium">
                by {wallpaper.author || "Unknown Artist"}
              </span>
              <span>•</span>
              <span>
                {new Date(
                  wallpaper.createdAt || Date.now(),
                ).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Primary Actions (Visit / Download) */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <a
                href={wallpaper.sourceUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-white transition-all shadow-md hover:shadow-lg active:scale-95 ${!wallpaper.sourceUrl ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed" : "bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"}`}
                onClick={(e) => !wallpaper.sourceUrl && e.preventDefault()}
              >
                Visit Page
              </a>
              <a
                href={wallpaper.image}
                download
                target="_blank"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <FaDownload /> Download
              </a>
            </div>

            <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
              <div className="text-center flex-1">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {wallpaper.views || 0}
                </div>
                <div className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                  Views
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
              <div className="text-center flex-1">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {wallpaper.downloads || 0}
                </div>
                <div className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                  Downloads
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
              <div className="text-center flex-1">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {wallpaper.likes || 0}
                </div>
                <div className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                  Likes
                </div>
              </div>
            </div>
          </div>

          {/* Properties List (Clean) */}
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Image Details
            </h3>

            <div className="grid grid-cols-[100px_1fr] gap-y-3 gap-x-4 text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Dimensions
              </span>
              <span className="font-medium text-gray-900 dark:text-white font-mono">
                {wallpaper.dimensions
                  ? `${wallpaper.dimensions.width} x ${wallpaper.dimensions.height}`
                  : "Unknown"}
              </span>

              <span className="text-gray-500 dark:text-gray-400">Format</span>
              <span className="font-medium text-gray-900 dark:text-white uppercase font-mono">
                {wallpaper.format || "JPG"}
              </span>

              <span className="text-gray-500 dark:text-gray-400">
                File Size
              </span>
              <span className="font-medium text-gray-900 dark:text-white font-mono">
                {wallpaper.fileSize
                  ? `${(wallpaper.fileSize / 1024 / 1024).toFixed(2)} MB`
                  : "Unknown"}
              </span>

              <span className="text-gray-500 dark:text-gray-400">License</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {wallpaper.license || "Standard License"}
              </span>
            </div>
          </div>

          {/* Links Section (Input Style) */}
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FaInfoCircle className="text-indigo-500" /> Content Links
            </h3>

            <div className="space-y-3">
              <div className="group relative">
                <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">
                  Source Page
                </label>
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2.5 border border-transparent focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-gray-900 transition-all">
                  <input
                    type="text"
                    readOnly
                    value={wallpaper.sourceUrl || "Not available"}
                    className="bg-transparent border-none outline-none w-full text-sm text-gray-700 dark:text-gray-300 font-mono truncate"
                  />
                  {wallpaper.sourceUrl && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(wallpaper.sourceUrl!);
                        toast.success("Copied!");
                      }}
                      className="p-1.5 ml-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <FaCopy />
                    </button>
                  )}
                </div>
              </div>

              <div className="group relative">
                <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">
                  Direct Image
                </label>
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2.5 border border-transparent focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-gray-900 transition-all">
                  <input
                    type="text"
                    readOnly
                    value={wallpaper.image}
                    className="bg-transparent border-none outline-none w-full text-sm text-gray-700 dark:text-gray-300 font-mono truncate"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(wallpaper.image);
                      toast.success("Copied!");
                    }}
                    className="p-1.5 ml-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Raw Metadata (Collapsible) */}
          {wallpaper.meta && Object.keys(wallpaper.meta).length > 0 && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors select-none">
                  <span>Raw Metadata</span>
                  <span className="text-xs text-indigo-500 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl font-mono text-xs text-gray-600 dark:text-gray-400 overflow-x-auto border border-gray-100 dark:border-gray-800">
                  <pre>{JSON.stringify(wallpaper.meta, null, 2)}</pre>
                </div>
              </details>
            </div>
          )}

          {/* Description (Bottom of right col) */}
          {wallpaper.description && (
            <div className="pt-4 mt-auto">
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 italic border-l-2 border-indigo-200 pl-4">
                "{wallpaper.description}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WallpaperDetailsPage;
