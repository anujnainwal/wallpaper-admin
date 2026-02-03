import React, { useMemo, useState, useCallback } from "react";
import {
  type ColumnDef,
  type PaginationState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { ReusableTable } from "../components/common/ReusableTable";
import { FaDownload, FaEye, FaHeart, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { wallpaperService, type Wallpaper } from "../services/wallpaperService";
import { categoryService } from "../services/categoryService";
import toast from "react-hot-toast";

import { useDebounce } from "../hooks/useDebounce";

const WallpaperListPage: React.FC = () => {
  /* State & Hooks */
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // TanStack Table State
  const [pagination, setPagination] = useState<PaginationState>(() => {
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    return {
      pageIndex: page ? Number(page) - 1 : 0,
      pageSize: limit ? Number(limit) : 10,
    };
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  // Debounce search term to prevent API flooding
  const debouncedSearch = useDebounce(globalFilter, 500);

  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);

  // Sync Pagination to URL
  React.useEffect(() => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", String(pagination.pageIndex + 1));
        newParams.set("limit", String(pagination.pageSize));
        return newParams;
      },
      { replace: true }, // Replace history to avoid back-button hell
    );
  }, [pagination, setSearchParams]);

  // Build Query Params
  const queryParams = useMemo(() => {
    const categoryFilter = columnFilters.find(
      (f) => f.id === "category",
    )?.value;
    const statusFilter = columnFilters.find((f) => f.id === "status")?.value;

    return {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: debouncedSearch, // Use debounced value
      category: (categoryFilter as string) || "",
      status: (statusFilter as string) || "",
    };
  }, [pagination, columnFilters, debouncedSearch]);

  // Reset pagination when search changes
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearch, columnFilters]); // Also reset on filters

  // Data State
  const [stableData, setStableData] = useState<{
    wallpapers: Wallpaper[];
    total: number;
    totalPages: number;
    isFresh: boolean;
  }>({
    wallpapers: [],
    total: 0,
    totalPages: -1, // Initialize as -1 to indicate loading/unknown
    isFresh: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  // Initial and subsequent fetches
  React.useEffect(() => {
    let ignore = false;

    const runFetch = async () => {
      setLoading(true);
      try {
        const res = await wallpaperService.getAll(queryParams);

        if (ignore) return;

        if (res && res.success) {
          const list = res.data || [];
          const count = res.pagination?.total ?? list.length;
          const pages = res.pagination?.totalPages ?? 1;

          setStableData({
            wallpapers: list,
            total: count,
            totalPages: pages,
            isFresh: true,
          });
          setError(null);
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err);
          setStableData((prev) => ({ ...prev, isFresh: false }));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    runFetch();

    return () => {
      ignore = true;
    };
  }, [queryParams, refreshKey]);

  // Destructure after the effect
  const { wallpapers, total, totalPages } = stableData;

  // Fetch Categories for Filter
  React.useEffect(() => {
    categoryService
      .getAllCategories()
      .then((cats) => {
        setCategories(cats.map((c) => ({ label: c.name, value: c._id! })));
      })
      .catch((err) => {});
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await wallpaperService.delete(id);
      toast.success("Wallpaper deleted");
      fetchData();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleBulkDelete = async (selectedWallpapers: Wallpaper[]) => {
    const ids = selectedWallpapers
      .map((w) => w._id)
      .filter((id): id is string => !!id);
    if (ids.length === 0) return;

    if (!window.confirm(`Delete ${ids.length} wallpapers?`)) return;

    try {
      await wallpaperService.bulkDelete(ids);
      toast.success("Bulk delete successful");
      fetchData();
    } catch (err) {
      toast.error("Bulk delete failed");
    }
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
              "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-900/20";
            dotColor = "bg-blue-500 animate-pulse";
          } else if (status === "pending") {
            styles =
              "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-900/20";
            dotColor = "bg-amber-500 animate-pulse";
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

      {error ? (
        <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
          <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">
            Failed to load wallpapers
          </h3>
          <p className="text-red-600 dark:text-red-300 mb-4">
            {(error as any)?.data?.message ||
              (error as any)?.message ||
              "Unknown error occurred"}
          </p>
          <button
            onClick={() => fetchData()}
            className="px-4 py-2 bg-white border border-red-200 text-red-700 font-medium rounded-lg hover:bg-red-50 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <ReusableTable
          columns={columns}
          data={wallpapers}
          loading={loading}
          pageCount={loading ? -1 : totalPages} // explicit page count
          pagination={pagination}
          onPaginationChange={setPagination}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
          searchPlaceholder="Search wallpapers..."
          onView={(row) => navigate(`/wallpapers/${row._id}`)}
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
      )}
    </div>
  );
};

export default WallpaperListPage;
