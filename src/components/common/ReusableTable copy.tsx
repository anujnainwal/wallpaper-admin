import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
  type OnChangeFn,
} from "@tanstack/react-table";
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
  FaFolderOpen,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaFilter,
  FaTimes,
  FaEdit,
  FaTrash,
  FaEye,
  FaSpinner,
} from "react-icons/fa";
import Modal from "./Modal";
import { Link } from "react-router-dom";
import { notifySuccess } from "../../utils/toastUtils";

interface ReusableTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  searchPlaceholder?: string;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  onView?: (row: TData) => void;
  // New prop for modal navigation
  basePath?: string;
  // Controlled State Props (Optional)
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  globalFilter?: string;
  onGlobalFilterChange?: OnChangeFn<string>;
  loading?: boolean;
}

export function ReusableTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search...",
  onEdit,
  onDelete,
  onView,
  // Detailed Destructuring for controlled props
  pageCount,
  pagination: controlledPagination,
  onPaginationChange,
  sorting: controlledSorting,
  onSortingChange,
  columnFilters: controlledColumnFilters,
  onColumnFiltersChange,
  globalFilter: controlledGlobalFilter,
  onGlobalFilterChange,
  loading = false,
  basePath,
}: ReusableTableProps<TData, TValue>) {
  // Local state fallback if not controlled
  const [internalGlobalFilter, setInternalGlobalFilter] = useState("");
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [internalColumnFilters, setInternalColumnFilters] =
    useState<ColumnFiltersState>([]);

  // Modal State
  const [activeRow, setActiveRow] = useState<TData | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(
    null,
  );
  const [formData, setFormData] = useState<TData | null>(null);

  // Initialize form data when entering edit mode
  React.useEffect(() => {
    if (activeRow && modalType === "edit") {
      setFormData({ ...activeRow });
    } else {
      setFormData(null);
    }
  }, [activeRow, modalType]);

  const handleAction = (row: TData, type: "view" | "edit" | "delete") => {
    setActiveRow(row);
    setModalType(type);
  };

  const closeModal = () => {
    setActiveRow(null);
    setModalType(null);
    setFormData(null);
  };

  const handleFormChange = (key: keyof TData, value: any) => {
    if (!formData) return;
    setFormData((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  // Helper to get ID from row data (assuming 'id' exists)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getRowId = (row: TData) => (row as any).id;

  // Derived state (prefer controlled over internal)
  const globalFilter = controlledGlobalFilter ?? internalGlobalFilter;
  const sorting = controlledSorting ?? internalSorting;
  // NOTE: For column filters, we keep a separate "temp" state for the drawer logic
  // but the MAIN table state should follow the prop if provided.
  // Ideally, columnFilters for the table instance should be controlled if provided.
  const tableColumnFilters = controlledColumnFilters ?? internalColumnFilters;

  const [tempFilters, setTempFilters] = useState<ColumnFiltersState>([]);
  const [showColumnFilters, setShowColumnFilters] = useState(false);

  // setTempFilters sync logic needs to respect which source we are using
  React.useEffect(() => {
    if (showColumnFilters) {
      setTempFilters([...tableColumnFilters]);
    }
  }, [showColumnFilters, tableColumnFilters]);

  // Determine manual modes
  const isManualPagination = !!controlledPagination;
  const isManualSorting = !!controlledSorting;
  const isManualFiltering =
    !!controlledColumnFilters || !!controlledGlobalFilter;

  // Extend columns with Actions if any callback is provided
  const tableColumns = React.useMemo(() => {
    if (!onEdit && !onDelete && !onView) {
      return columns;
    }

    const actionColumn: ColumnDef<TData, TValue> = {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {onView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row.original, "view");
              }}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View"
            >
              <FaEye size={14} />
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row.original, "edit");
              }}
              className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="Edit"
            >
              <FaEdit size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row.original, "delete");
              }}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <FaTrash size={14} />
            </button>
          )}
        </div>
      ),
    };

    return [...columns, actionColumn];
  }, [columns, onEdit, onDelete, onView]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    pageCount: pageCount ?? -1, // -1 means auto-calculate if not provided
    state: {
      globalFilter,
      sorting,
      columnFilters: tableColumnFilters,
      ...(controlledPagination ? { pagination: controlledPagination } : {}),
    },
    // Handlers: Use provided handler OR fallback to internal setter
    onGlobalFilterChange: onGlobalFilterChange ?? setInternalGlobalFilter,
    onSortingChange: onSortingChange ?? setInternalSorting,
    onColumnFiltersChange: onColumnFiltersChange ?? setInternalColumnFilters,
    onPaginationChange: onPaginationChange, // Only used if using manual pagination usually

    // Manual Flags
    manualPagination: isManualPagination,
    manualSorting: isManualSorting,
    manualFiltering: isManualFiltering,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleApplyFilters = () => {
    // If controlled, call parent handler
    if (onColumnFiltersChange) {
      // Tanstack table expects an "updater" function or value. We pass value directly.
      // We need to cast or wrap because OnChangeFn can be complex.
      // However, simple value calling works for most standard use cases or we call the setter from hook.
      // Ideally we use table.setColumnFilters(tempFilters) which triggers the internal OR external handler via the table logic.
      table.setColumnFilters(tempFilters);
    } else {
      setInternalColumnFilters(tempFilters);
    }
    setShowColumnFilters(false);
  };

  const handleClearFilters = () => {
    table.resetColumnFilters(); // This triggers appropriate change handlers
    setTempFilters([]);
    setShowColumnFilters(false);
  };

  const updateTempFilter = (columnId: string, value: string) => {
    setTempFilters((prev) => {
      const existing = prev.find((f) => f.id === columnId);
      if (!value) {
        return prev.filter((f) => f.id !== columnId);
      }
      if (existing) {
        return prev.map((f) => (f.id === columnId ? { ...f, value } : f));
      }
      return [...prev, { id: columnId, value }];
    });
  };

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
          <FaSpinner className="animate-spin text-indigo-600 text-3xl" />
        </div>
      )}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={globalFilter ?? ""}
                onChange={(e) => {
                  if (onGlobalFilterChange) {
                    onGlobalFilterChange(e.target.value);
                  } else {
                    setInternalGlobalFilter(e.target.value);
                  }
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
                placeholder={searchPlaceholder}
              />
            </div>
            <button
              onClick={() => setShowColumnFilters(true)}
              className={`p-2 rounded-lg border bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors`}
              title="Open Filters"
            >
              <FaFilter />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider select-none ${
                        header.id === "actions"
                          ? "sticky right-0 bg-gray-50 z-10 border-l border-gray-100"
                          : ""
                      }`}
                    >
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:text-gray-700"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: <FaSortUp />,
                          desc: <FaSortDown />,
                        }[header.column.getIsSorted() as string] ??
                          (header.column.getCanSort() ? (
                            <FaSort className="text-gray-300" />
                          ) : null)}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isActions = cell.column.id === "actions";
                      return (
                        <td
                          key={cell.id}
                          className={`px-6 py-4 whitespace-nowrap ${
                            isActions
                              ? "sticky right-0 bg-white z-10 border-l border-gray-100 group-hover:bg-gray-50 transition-colors"
                              : ""
                          }`}
                        >
                          {isActions ? (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )
                          ) : (
                            <div
                              className="truncate max-w-[250px] flex items-center h-full"
                              title={
                                typeof cell.getValue() === "string"
                                  ? (cell.getValue() as string)
                                  : undefined
                              }
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FaFolderOpen size={32} className="mb-3 text-gray-300" />
                      <p className="text-base font-medium">No results found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between bg-gray-50/50">
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Rows per page:</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="border border-gray-300 rounded text-sm p-1 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-sm text-gray-700">
              Page{" "}
              <span className="font-medium">
                {table.getState().pagination.pageIndex + 1}
              </span>{" "}
              of <span className="font-medium">{table.getPageCount()}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 justify-center sm:justify-end">
            <button
              className="p-1 rounded border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <FaAngleDoubleLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              className="p-1 rounded border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <FaChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-700">Go to page:</span>
              <input
                type="number"
                min="1"
                max={table.getPageCount()}
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border border-gray-300 rounded w-16 p-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              className="p-1 rounded border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <FaChevronRight className="w-4 h-4 text-gray-600" />
            </button>
            <button
              className="p-1 rounded border border-gray-300 bg-white disabled:opacity-50 hover:bg-gray-50"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <FaAngleDoubleRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Drawer Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          showColumnFilters ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowColumnFilters(false)}
      />

      {/* Filter Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          showColumnFilters ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={() => setShowColumnFilters(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {table.getAllColumns().map((column) => {
              if (!column.getCanFilter()) return null;
              // Find current temp filter value for this column
              const filterValue =
                tempFilters.find((f) => f.id === column.id)?.value ??
                (column.getFilterValue() as string) ??
                "";

              return (
                <div key={column.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {column.columnDef.header as string}
                  </label>
                  <input
                    type="text"
                    value={filterValue as string}
                    onChange={(e) =>
                      updateTempFilter(column.id, e.target.value)
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder={`Filter by ${
                      column.columnDef.header as string
                    }...`}
                  />
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-100 mt-auto flex gap-3">
            <button
              onClick={handleClearFilters}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* CRUD Modals */}
      {/* View Modal */}
      <Modal
        isOpen={modalType === "view" && !!activeRow}
        onClose={closeModal}
        title="View Details"
        footer={
          <div className="flex justify-between items-center w-full bg-gray-50/50 -m-4 p-4 mt-0 border-t border-gray-100 rounded-b-2xl">
            <span className="text-xs text-gray-400 font-medium">
              Action Required?
            </span>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
              >
                Close
              </button>
              {basePath && activeRow && (
                <Link
                  to={`${basePath}/${getRowId(activeRow)}`}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5"
                >
                  Full Details
                </Link>
              )}
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="max-h-[60vh] overflow-y-auto pr-1 -mr-2 custom-scrollbar">
            {activeRow ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(activeRow).map(([key, value]) => {
                  // Key formatting
                  const label = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase());

                  // Value formatting checks
                  let displayValue: React.ReactNode = String(value);
                  const isLongText = String(value).length > 50;
                  const isId = key.toLowerCase().includes("id");
                  const isEmail = key.toLowerCase().includes("email");

                  if (typeof value === "object" && value !== null) {
                    displayValue = (
                      <pre className="text-xs bg-gray-50 p-2 rounded-md border border-gray-100 overflow-x-auto">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    );
                  }

                  return (
                    <div
                      key={key}
                      className={`
                        flex flex-col p-3 rounded-xl border border-gray-100 bg-white hover:border-indigo-100 hover:shadow-sm transition-all
                        ${isLongText || typeof value === "object" ? "sm:col-span-2" : ""}
                      `}
                    >
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                        {label}
                        {isId && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        )}
                      </span>
                      <span
                        className={`
                          text-sm font-medium text-gray-900 leading-relaxed
                          ${isEmail ? "text-indigo-600 underline cursor-pointer" : ""}
                          ${isId ? "font-mono text-gray-600" : ""}
                        `}
                      >
                        {displayValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <FaFolderOpen size={48} className="mb-4 text-gray-200" />
                <p>No details available.</p>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={modalType === "edit" && !!activeRow}
        onClose={closeModal}
        maxWidth="max-w-3xl"
        title="Edit Item (Quick Update)"
        footer={
          <div className="flex justify-between items-center w-full bg-gray-50/50 -m-4 p-4 mt-0 border-t border-gray-100 rounded-b-2xl">
            <div className="flex flex-col">
              {basePath && activeRow && (
                <Link
                  to={`${basePath}/${getRowId(activeRow)}/edit`}
                  className="text-xs text-indigo-600 font-medium hover:text-indigo-800 underline decoration-indigo-200 hover:decoration-indigo-800 transition-all"
                >
                  Go to Full Edit Page
                </Link>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onEdit && formData) {
                    onEdit(formData);
                    notifySuccess("Item updated successfully!");
                  }
                  closeModal();
                }}
                className="px-5 py-2 text-sm font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 shadow-md shadow-amber-100 transition-all hover:-translate-y-0.5"
              >
                Save Changes
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-sm text-gray-500 mb-2">
            Make quick changes here. For complex edits, use the full page.
          </p>

          {formData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {Object.entries(formData).map(([key, value]) => {
                // Skip if object (can't easily edit) or if it looks like an ID (usually immutable)
                if (typeof value === "object" && value !== null) return null;

                const label = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());

                const isId = key.toLowerCase() === "id";
                const isLongText =
                  key.toLowerCase().includes("body") ||
                  String(value).length > 50;

                return (
                  <div
                    key={key}
                    className={`flex flex-col gap-1.5 ${
                      isLongText ? "sm:col-span-2" : ""
                    }`}
                  >
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {label}
                    </label>
                    {isId ? (
                      <input
                        type="text"
                        value={value as string}
                        disabled
                        className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 text-sm font-mono cursor-not-allowed"
                      />
                    ) : isLongText ? (
                      <textarea
                        value={value as string}
                        onChange={(e) =>
                          handleFormChange(key as keyof TData, e.target.value)
                        }
                        rows={4}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-y"
                      />
                    ) : (
                      <input
                        type={typeof value === "number" ? "number" : "text"}
                        value={value as string}
                        onChange={(e) =>
                          handleFormChange(
                            key as keyof TData,
                            e.target.type === "number"
                              ? Number(e.target.value)
                              : e.target.value,
                          )
                        }
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex justify-center p-8">
              <FaSpinner className="animate-spin text-amber-500" />
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={modalType === "delete" && !!activeRow}
        onClose={closeModal}
        title="Delete Item"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (onDelete && activeRow) {
                  onDelete(activeRow);
                  notifySuccess("Item deleted successfully!");
                }
                closeModal();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Confirm Delete
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </p>
          <div className="p-3 bg-red-50 rounded border border-red-100">
            <span className="font-mono text-xs text-red-700">
              ID: {activeRow ? getRowId(activeRow) : "Unknown"}
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
