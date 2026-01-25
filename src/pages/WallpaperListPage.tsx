import React, { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ReusableTable } from "../components/common/ReusableTable";
import { FaDownload, FaEye, FaHeart, FaEdit, FaTrash } from "react-icons/fa";

interface Wallpaper {
  id: string;
  title: string;
  category: string;
  resolution: string;
  fileSize: string;
  downloads: number;
  views: number;
  likes: number;
  status: "Active" | "Inactive";
  imageUrl: string;
  createdAt: string;
}

const dummyWallpapers: Wallpaper[] = [
  {
    id: "101",
    title: "Abstract Nexus",
    category: "Abstract",
    resolution: "3840x2160",
    fileSize: "4.2 MB",
    downloads: 1250,
    views: 5600,
    likes: 340,
    status: "Active",
    imageUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200",
    createdAt: "2023-11-15",
  },
  {
    id: "102",
    title: "Cyberpunk City",
    category: "Sci-Fi",
    resolution: "1920x1080",
    fileSize: "2.8 MB",
    downloads: 890,
    views: 3200,
    likes: 210,
    status: "Active",
    imageUrl:
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&q=80&w=200",
    createdAt: "2023-11-18",
  },
  {
    id: "103",
    title: "Mountain Mist",
    category: "Nature",
    resolution: "3840x2160",
    fileSize: "5.1 MB",
    downloads: 2100,
    views: 8900,
    likes: 560,
    status: "Active",
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=200",
    createdAt: "2023-11-20",
  },
  {
    id: "104",
    title: "Neon Geometry",
    category: "Minimalist",
    resolution: "2560x1440",
    fileSize: "1.5 MB",
    downloads: 540,
    views: 1200,
    likes: 95,
    status: "Inactive",
    imageUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=200",
    createdAt: "2023-11-25",
  },
  {
    id: "105",
    title: "Ocean Depths",
    category: "Nature",
    resolution: "3840x2160",
    fileSize: "6.3 MB",
    downloads: 1560,
    views: 6700,
    likes: 420,
    status: "Active",
    imageUrl:
      "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?auto=format&fit=crop&q=80&w=200",
    createdAt: "2023-12-01",
  },
];

const WallpaperListPage: React.FC = () => {
  const [data, setData] = useState<Wallpaper[]>(dummyWallpapers);

  const columns = useMemo<ColumnDef<Wallpaper>[]>(
    () => [
      {
        accessorKey: "imageUrl",
        header: "Preview",
        cell: (info) => (
          <div className="w-16 h-10 rounded-lg overflow-hidden border border-gray-100 shadow-sm relative group">
            <img
              src={info.getValue() as string}
              alt="Wallpaper"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 line-clamp-1">
              {info.getValue() as string}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              {info.row.original.id}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: (info) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "downloads",
        header: "Stats",
        cell: (info) => (
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1" title="Downloads">
              <FaDownload size={10} /> {info.row.original.downloads}
            </span>
            <span className="flex items-center gap-1" title="Views">
              <FaEye size={10} /> {info.row.original.views}
            </span>
            <span
              className="flex items-center gap-1 text-pink-500"
              title="Likes"
            >
              <FaHeart size={10} /> {info.row.original.likes}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "resolution",
        header: "Res",
        cell: (info) => (
          <span className="text-xs text-gray-500 font-mono">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as string;
          return (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white border shadow-sm ${
                status === "Active"
                  ? "text-emerald-600 border-emerald-200"
                  : "text-gray-500 border-gray-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === "Active" ? "bg-emerald-500" : "bg-gray-400"}`}
              ></span>
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        meta: {
          filterVariant: "date",
        },
        cell: (info) => (
          <span className="text-gray-400 text-xs whitespace-nowrap">
            {new Date(info.getValue() as string).toLocaleDateString()}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wallpapers</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your wallpaper collection, uploads, and performance.
          </p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-95">
          + Upload New
        </button>
      </div>

      <ReusableTable
        columns={columns}
        data={data}
        searchPlaceholder="Search wallpapers..."
        onView={(row) => console.log("View", row)}
        onEdit={(row) => console.log("Edit", row)}
        onDelete={(row) => {
          setData((prev) => prev.filter((r) => r.id !== row.id));
        }}
        basePath="/wallpapers"
        renderGridItem={(row) => {
          const wallpaper = row.original;
          return (
            <div className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
              {/* Image Cover */}
              <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                <img
                  src={wallpaper.imageUrl}
                  alt={wallpaper.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                <div className="absolute top-4 right-4 flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                      wallpaper.status === "Active"
                        ? "bg-emerald-500/20 text-emerald-100 border-emerald-500/30"
                        : "bg-gray-500/20 text-gray-100 border-gray-500/30"
                    }`}
                  >
                    {wallpaper.status}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-white/20 text-white backdrop-blur-sm mb-2 border border-white/10">
                    {wallpaper.category}
                  </span>
                  <h3 className="text-white font-bold text-xl leading-tight truncate drop-shadow-md">
                    {wallpaper.title}
                  </h3>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1">
                      <FaDownload size={10} />
                      <span className="text-[10px] uppercase font-bold tracking-wider">
                        DLs
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {(wallpaper.downloads / 1000).toFixed(1)}k
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1">
                      <FaEye size={10} />
                      <span className="text-[10px] uppercase font-bold tracking-wider">
                        Views
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {(wallpaper.views / 1000).toFixed(1)}k
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-pink-50 dark:bg-pink-900/20">
                    <div className="flex items-center gap-1.5 text-pink-500 dark:text-pink-300 mb-1">
                      <FaHeart size={10} />
                      <span className="text-[10px] uppercase font-bold tracking-wider">
                        Likes
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {wallpaper.likes}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                      Format
                    </span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300 font-mono">
                      {wallpaper.resolution}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Edit", wallpaper.id);
                      }}
                      className="p-2.5 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setData((prev) =>
                          prev.filter((r) => r.id !== wallpaper.id),
                        );
                      }}
                      className="p-2.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default WallpaperListPage;
