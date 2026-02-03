import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { FaPlus, FaFolder, FaArrowRight } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { categoryService, type Category } from "../../services/categoryService";
import { notifySuccess } from "../../utils/toastUtils";
import { useEventStream } from "../../hooks/useEventStream";
import { ReusableTable } from "../../components/common/ReusableTable";
import { type ColumnDef } from "@tanstack/react-table";

const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const [stableData, setStableData] = useState<{
    categories: Category[];
    total: number;
  }>({
    categories: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const parentId = searchParams.get("parent");
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter,
      };

      // Filter by parent if explicit
      params.parent = parentId || "null";

      const response = await categoryService.getAll(params);

      setStableData({
        categories: response.data || [],
        total: response.total || 0,
      });

      if (parentId) {
        try {
          const parent = await categoryService.getById(parentId);
          setParentCategory(parent);
        } catch (e) {
          console.error("Failed to fetch parent details");
        }
      } else {
        setParentCategory(null);
      }
    } catch (error) {
      toast.error("Failed to load categories");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [parentId, pagination.pageIndex, pagination.pageSize, globalFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time updates via SSE
  useEventStream((event) => {
    if (event.model === "categories") {
      console.log("Category change detected, refreshing...", event.action);
      fetchData();
    }
  });

  const handleDelete = async (row: Category) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await categoryService.delete(row.id || row._id!);
      notifySuccess("Category deleted successfully!");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete category");
      console.error("Failed to delete category", error);
    }
  };

  const handleBulkDelete = async (selectedCategories: Category[]) => {
    const ids = selectedCategories
      .map((c) => c._id)
      .filter((id): id is string => !!id);
    if (ids.length === 0) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ${ids.length} categories?`,
      )
    ) {
      return;
    }

    try {
      await categoryService.bulkDelete(ids);
      notifySuccess(`${ids.length} categories deleted successfully!`);
      fetchData();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to bulk delete categories",
      );
      console.error("Failed to bulk delete categories", error);
    }
  };

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.image ? (
              <img
                src={row.original.image}
                alt={row.original.name}
                className="w-10 h-10 rounded-lg object-cover bg-gray-100"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                <FaFolder />
              </div>
            )}
            <div>
              <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Link
                  to={`/content/categories?parent=${row.original.id || row.original._id}`}
                  className="hover:text-indigo-600 hover:underline"
                >
                  {row.original.name}
                </Link>
              </div>
              {row.original.description && (
                <div className="text-xs text-gray-500 truncate max-w-xs">
                  {row.original.description}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ getValue }) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "parent",
        header: "Parent",
        cell: ({ row }) =>
          row.original.parent ? (
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
              {row.original.parent.name}
            </span>
          ) : (
            <span className="text-gray-400 text-xs italic">Root</span>
          ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ getValue }) => {
          const isActive = getValue() as boolean;
          return (
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                isActive
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      },
      {
        id: "drilldown",
        header: "",
        cell: ({ row }) => (
          <Link
            to={`/content/categories?parent=${row.original.id || row.original._id}`}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition inline-block"
            title="View Subcategories"
          >
            <FaArrowRight size={14} />
          </Link>
        ),
      },
    ],
    [],
  );

  const { categories, total: rowCount } = stableData;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FaFolder className="text-indigo-600" />
            {parentCategory
              ? `Subcategories of "${parentCategory.name}"`
              : "Categories"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage wallpaper categories and subcategories
          </p>
        </div>
        <Link
          to={`/content/categories/add${parentId ? `?parent=${parentId}` : ""}`}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-sm"
        >
          <FaPlus />
          Add Category
        </Link>
      </div>

      {/* Breadcrumb */}
      {parentId && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/content/categories" className="hover:text-indigo-600">
            All Categories
          </Link>
          <FaArrowRight size={12} />
          <span className="font-semibold text-gray-900 dark:text-white">
            {parentCategory?.name || "Loading..."}
          </span>
        </div>
      )}

      {/* Reusable Table */}
      <ReusableTable
        columns={columns}
        data={categories}
        loading={loading}
        searchPlaceholder="Search categories..."
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        // Pagination Props
        rowCount={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSelectionChange={(selected) =>
          console.log("Selected categories:", selected)
        }
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onEditPage={(row) => {
          navigate(`/content/categories/edit/${row.id || row._id}`);
        }}
      />
    </div>
  );
};

export default CategoryList;
