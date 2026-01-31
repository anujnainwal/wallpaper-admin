import React, { useMemo, useState } from "react";
import {
  type ColumnDef,
  type PaginationState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { ReusableTable } from "../components/common/ReusableTable";
import { FaDownload, FaEye, FaHeart, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { wallpaperService, type Wallpaper } from "../services/wallpaperService";
import { categoryService } from "../services/categoryService";
import toast from "react-hot-toast";
import { useEventStream } from "../hooks/useEventStream";

const WallpaperListPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // TanStack Table State
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);

  // Fetch Categories for Filter
  React.useEffect(() => {
    categoryService
      .getAllCategories()
      .then((cats) => {
        setCategories(cats.map((c) => ({ label: c.name, value: c._id! })));
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch Wallpapers
  const fetchWallpapers = React.useCallback(async () => {
    setLoading(true);
    try {
      const categoryFilter = columnFilters.find(
        (f) => f.id === "category",
      )?.value;
      const statusFilter = columnFilters.find((f) => f.id === "status")?.value;

      const result: any = await wallpaperService.getAll({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter,
        category: (categoryFilter as string) || "",
        status: (statusFilter as string) || "",
      });
      console.log(result);
      setData(result?.data?.data);
      setTotal(result.total);
    } catch (error) {
      toast.error("Failed to fetch wallpapers");
    } finally {
      setLoading(false);
    }
  }, [pagination, globalFilter, columnFilters]);

  React.useEffect(() => {
    fetchWallpapers();
  }, [fetchWallpapers]);

  // Real-time updates via SSE
  useEventStream((event) => {
    if (event.model === "wallpapers") {
      console.log("Wallpaper change detected, refreshing...", event.action);
      fetchWallpapers();
    }
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await wallpaperService.delete(id);
      toast.success("Wallpaper deleted");
      fetchWallpapers();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleBulkDelete = async (selectedWallpapers: Wallpaper[]) => {
    const ids = selectedWallpapers
      .map((w) => w._id)
      .filter((id): id is string => !!id);
    if (ids.length === 0) return;

    await wallpaperService.bulkDelete(ids);
    fetchWallpapers();
  };

  const columns = useMemo<ColumnDef<Wallpaper>[]>(
    () => [
      {
        accessorKey: "thumbnail",
        header: "Preview",
        cell: (info) => (
          <div className="w-20 h-12 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm relative group bg-gray-50 dark:bg-gray-800">
            <img
              src={(info.getValue() as string) || info.row.original.image}
              alt="Wallpaper"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-gray-900 dark:text-white line-clamp-1 text-sm">
              {info.getValue() as string}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono tracking-wide">
              {info.row.original._id}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        meta: {
          filterVariant: "select",
          filterOptions: categories,
        },
        cell: (info) => (
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
            {typeof info.getValue() === "object"
              ? (info.getValue() as any).name
              : info.getValue()}
          </span>
        ),
      },
      {
        accessorKey: "downloads",
        header: "Stats",
        cell: () => (
          <div className="flex items-center gap-4 text-xs font-medium text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1.5" title="Downloads">
              <FaDownload
                className="text-blue-500 dark:text-blue-400"
                size={10}
              />
              0
            </span>
            <span className="flex items-center gap-1.5" title="Views">
              <FaEye
                className="text-purple-500 dark:text-purple-400"
                size={10}
              />
              0
            </span>
            <span className="flex items-center gap-1.5" title="Likes">
              <FaHeart className="text-pink-500 dark:text-pink-400" size={10} />
              0
            </span>
          </div>
        ),
      },
      {
        accessorKey: "resolution",
        header: "Res",
        cell: (info) => (
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded border border-gray-100 dark:border-gray-700">
            {info.row.original.format}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        meta: {
          filterVariant: "select",
          filterOptions: [
            { label: "Active", value: "active" },
            { label: "Processing", value: "processing" },
            { label: "Pending", value: "pending" },
            { label: "Error", value: "error" },
          ],
        },
        cell: (info) => {
          const status = (info.getValue() as string).toLowerCase();

          let styles =
            "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
          let dotColor = "bg-gray-400";

          if (status === "active") {
            styles =
              "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
            dotColor = "bg-emerald-500";
          } else if (status === "processing") {
            styles =
              "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
            dotColor = "bg-blue-500 animate-pulse";
          } else if (status === "pending") {
            styles =
              "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
            dotColor = "bg-amber-500";
          } else if (status === "error") {
            styles =
              "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
            dotColor = "bg-red-500";
          }

          return (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-2 ${dotColor}`}
              ></span>
              <span className="capitalize">{status}</span>
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
          <span className="text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap font-medium">
            {new Date(info.getValue() as string).toLocaleDateString()}
          </span>
        ),
      },
    ],
    [categories],
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
        <button
          onClick={() => navigate("/wallpapers/add")}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-95"
        >
          + Upload New
        </button>
      </div>

      <ReusableTable
        columns={columns}
        data={data}
        loading={loading}
        // Manual Pagination
        pageCount={Math.ceil(total / pagination.pageSize)}
        pagination={pagination}
        onPaginationChange={setPagination}
        // Manual Filtering
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        // Actions
        searchPlaceholder="Search wallpapers..."
        onView={(row) => console.log("View", row)}
        onEditPage={(row) => navigate(`/wallpapers/edit/${row._id}`)}
        onDelete={(row) => handleDelete(row._id!)}
        onBulkDelete={handleBulkDelete}
        basePath="/wallpapers"
        renderGridItem={(row) => {
          const wallpaper = row.original;
          return (
            <div className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
              {/* Image Cover */}
              <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                <img
                  src={wallpaper.thumbnail || wallpaper.image}
                  alt={wallpaper.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                <div className="absolute top-4 right-4 flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                      wallpaper.status === "active"
                        ? "bg-emerald-500/20 text-emerald-100 border-emerald-500/30"
                        : "bg-gray-500/20 text-gray-100 border-gray-500/30"
                    }`}
                  >
                    {wallpaper.status}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-white/20 text-white backdrop-blur-sm mb-2 border border-white/10">
                    {typeof wallpaper.category === "object"
                      ? (wallpaper.category as any).name
                      : "Unknown"}
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
                      0
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
                      0
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
                      0
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                      Format
                    </span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300 font-mono">
                      {wallpaper.format}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Edit", wallpaper._id);
                      }}
                      className="p-2.5 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(wallpaper._id!);
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
