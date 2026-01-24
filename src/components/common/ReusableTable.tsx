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
  type Row,
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
  FaList,
  FaThLarge,
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
  renderGridItem?: (row: Row<TData>) => React.ReactNode;
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
  renderGridItem,
}: ReusableTableProps<TData, TValue>) {
  // Local state fallback if not controlled
  const [internalGlobalFilter, setInternalGlobalFilter] = useState("");
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [internalColumnFilters, setInternalColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Modal State
  const [activeRow, setActiveRow] = useState<TData | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(
    null,
  );
  const [formData, setFormData] = useState<TData | null>(null);

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

  const globalFilter = controlledGlobalFilter ?? internalGlobalFilter;
  const sorting = controlledSorting ?? internalSorting;
  const tableColumnFilters = controlledColumnFilters ?? internalColumnFilters;

  const [tempFilters, setTempFilters] = useState<ColumnFiltersState>([]);
  const [showColumnFilters, setShowColumnFilters] = useState(false);

  React.useEffect(() => {
    if (showColumnFilters) {
      setTempFilters([...tableColumnFilters]);
    }
  }, [showColumnFilters, tableColumnFilters]);

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
    if (onColumnFiltersChange) {
      table.setColumnFilters(tempFilters);
    } else {
      setInternalColumnFilters(tempFilters);
    }
    setShowColumnFilters(false);
  };

  const handleClearFilters = () => {
    table.resetColumnFilters();
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-sm" />
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
                className="block w-full pl-9 pr-4 py-2 bg-gray-50/50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all hover:bg-white dark:hover:bg-gray-600"
                placeholder={searchPlaceholder}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100/80 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700"
                }`}
                title="List View"
              >
                <FaList size={14} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700"
                }`}
                title="Grid View"
              >
                <FaThLarge size={14} />
              </button>
            </div>

            <button
              onClick={() => setShowColumnFilters(true)}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all active:scale-95"
              title="Filter Columns"
            >
              <FaFilter size={14} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {viewMode === "list" ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider select-none ${
                          header.id === "actions"
                            ? "sticky right-0 bg-gray-50 dark:bg-gray-800 z-10 border-l border-gray-100 dark:border-gray-700"
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
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    >
                      {row.getVisibleCells().map((cell) => {
                        const isActions = cell.column.id === "actions";
                        return (
                          <td
                            key={cell.id}
                            className={`px-6 py-4 whitespace-nowrap ${
                              isActions
                                ? "sticky right-0 bg-white dark:bg-gray-800 z-10 border-l border-gray-100 dark:border-gray-700 group-hover:bg-gray-50 dark:group-hover:bg-gray-800 transition-colors"
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
                                className="truncate max-w-[250px] flex items-center h-full text-gray-700 dark:text-gray-300"
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
                        <FaFolderOpen
                          size={32}
                          className="mb-3 text-gray-300"
                        />
                        <p className="text-base font-medium">
                          No results found
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50">
            {table.getRowModel().rows.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {table.getRowModel().rows.map((row) => {
                  if (renderGridItem) {
                    return (
                      <React.Fragment key={row.id}>
                        {renderGridItem(row)}
                      </React.Fragment>
                    );
                  }
                  return (
                    <div
                      key={row.id}
                      className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900 transition-all duration-200 flex flex-col overflow-hidden"
                    >
                      {/* Card Header - First Column usually ID or Name */}
                      <div className="p-5 border-b border-gray-50 dark:border-gray-700 flex justify-between items-start gap-3 bg-gray-50/30 dark:bg-gray-700/30">
                        <div className="flex-1 min-w-0">
                          {/* Render the first non-action column as title */}
                          {(() => {
                            const titleCell = row
                              .getVisibleCells()
                              .find(
                                (cell) =>
                                  cell.column.id !== "actions" &&
                                  cell.column.id !== "select",
                              );
                            return titleCell ? (
                              <div className="font-semibold text-gray-900 dark:text-gray-100 truncate text-base">
                                {flexRender(
                                  titleCell.column.columnDef.cell,
                                  titleCell.getContext(),
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">
                                Item #{row.index + 1}
                              </span>
                            );
                          })()}
                          {/* Try to find a secondary subtitle like email or date if available */}
                          {(() => {
                            const subtitleCell = row
                              .getVisibleCells()
                              .find(
                                (cell) =>
                                  cell.column.id !== "actions" &&
                                  cell.column.id !== "select" &&
                                  (cell.column.id
                                    .toLowerCase()
                                    .includes("email") ||
                                    cell.column.id
                                      .toLowerCase()
                                      .includes("date") ||
                                    cell.column.id
                                      .toLowerCase()
                                      .includes("role")),
                              );
                            return subtitleCell ? (
                              <div className="text-xs text-gray-500 mt-1 truncate">
                                {flexRender(
                                  subtitleCell.column.columnDef.cell,
                                  subtitleCell.getContext(),
                                )}
                              </div>
                            ) : null;
                          })()}
                        </div>
                      </div>

                      {/* Card Body - Other Columns */}
                      <div className="p-5 flex-1 space-y-3">
                        {row.getVisibleCells().map((cell) => {
                          if (
                            cell.column.id === "actions" ||
                            cell.column.id === "select"
                          )
                            return null;
                          // Skip the title cell we already showed
                          const titleCellId = row
                            .getVisibleCells()
                            .find(
                              (c) =>
                                c.column.id !== "actions" &&
                                c.column.id !== "select",
                            )?.column.id;
                          if (cell.column.id === titleCellId) return null;

                          // Skip the subtitle cell if we showed one
                          const subtitleCellId = row
                            .getVisibleCells()
                            .find(
                              (c) =>
                                c.column.id !== "actions" &&
                                c.column.id !== "select" &&
                                (c.column.id.toLowerCase().includes("email") ||
                                  c.column.id.toLowerCase().includes("date") ||
                                  c.column.id.toLowerCase().includes("role")),
                            )?.column.id;
                          if (cell.column.id === subtitleCellId) return null;

                          return (
                            <div key={cell.id} className="flex flex-col gap-1">
                              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">
                                {cell.column.columnDef.header as string}
                              </span>
                              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Card Footer - Actions */}
                      <div className="p-4 border-t border-gray-50 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-700/30 flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        {onView && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(row.original, "view");
                            }}
                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            title="View"
                          >
                            <FaEye size={16} />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(row.original, "edit");
                            }}
                            className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(row.original, "delete");
                            }}
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FaTrash size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <FaFolderOpen size={48} className="mb-4 text-gray-300" />
                <p className="text-lg font-medium">No results found</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between sm:justify-start gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Rows per page
              </span>
              <div className="relative">
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-xs rounded-lg py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <FaSortDown size={10} />
                </div>
              </div>
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">
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
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Go to page:
              </span>
              <input
                type="number"
                min="1"
                max={table.getPageCount()}
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded w-16 p-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <FaAngleDoubleRight className="w-4 h-4" />
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
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          showColumnFilters ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filters
            </h2>
            <button
              onClick={() => setShowColumnFilters(false)}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {column.columnDef.header as string}
                  </label>
                  <input
                    type="text"
                    value={filterValue as string}
                    onChange={(e) =>
                      updateTempFilter(column.id, e.target.value)
                    }
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
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
