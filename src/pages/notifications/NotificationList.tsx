import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import Modal from "../../components/common/Modal";
import {
  FaAndroid,
  FaApple,
  FaGlobe,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaClock,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

// Types
type Notification = {
  id: number;
  title: string;
  message: string;
  target: "all" | "android" | "ios" | "custom";
  sentAt: string;
  status: "Sent" | "Scheduled" | "Draft";
  opens: number;
};

// Mock Data Generator
const generateData = (): Notification[] => {
  const baseData: Notification[] = [
    {
      id: 1,
      title: "New Summer Collection",
      message: "Check out our 50+ new nature wallpapers!",
      target: "all",
      sentAt: "2024-01-15",
      status: "Sent",
      opens: 1240,
    },
    {
      id: 2,
      title: "Update Required",
      message: "Please update to the latest version.",
      target: "android",
      sentAt: "2024-01-14",
      status: "Sent",
      opens: 856,
    },
    {
      id: 3,
      title: "Exclusive Pro Features",
      message: "Unlock 4K downloads now!",
      target: "ios",
      sentAt: "2024-01-20",
      status: "Scheduled",
      opens: 0,
    },
    {
      id: 4,
      title: "Welcome New Users",
      message: "Thanks for joining us!",
      target: "custom",
      sentAt: "2024-01-12",
      status: "Sent",
      opens: 45,
    },
    {
      id: 5,
      title: "Weekend Sale",
      message: "50% off on Pro subscription",
      target: "all",
      sentAt: "2024-01-10",
      status: "Sent",
      opens: 2100,
    },
    {
      id: 6,
      title: "System Maintenance",
      message: "We will be down for 1 hour.",
      target: "all",
      sentAt: "2024-01-08",
      status: "Sent",
      opens: 3200,
    },
    {
      id: 7,
      title: "New Abstract Pack",
      message: "Abstract lovers, this is for you.",
      target: "ios",
      sentAt: "2024-01-18",
      status: "Draft",
      opens: 0,
    },
    {
      id: 8,
      title: "Rate Us",
      message: "Loving the app? Rate us on Play Store!",
      target: "android",
      sentAt: "2024-01-05",
      status: "Sent",
      opens: 150,
    },
    {
      id: 9,
      title: "Dark Mode Added",
      message: "Try the new Dark Mode in settings.",
      target: "all",
      sentAt: "2024-01-01",
      status: "Sent",
      opens: 4500,
    },
    {
      id: 10,
      title: "Referral Bonus",
      message: "Invite friends and earn rewards.",
      target: "custom",
      sentAt: "2024-01-16",
      status: "Sent",
      opens: 120,
    },
    {
      id: 11,
      title: "Bug Fixes",
      message: "Crash fixes for Android 14.",
      target: "android",
      sentAt: "2024-01-19",
      status: "Sent",
      opens: 900,
    },
    {
      id: 12,
      title: "Happy New Year",
      message: "Best wishes from the team!",
      target: "all",
      sentAt: "2024-01-01",
      status: "Sent",
      opens: 5000,
    },
  ];

  // Generate more mock data for pagination testing
  const moreData = Array.from({ length: 88 }).map((_, i) => ({
    id: 13 + i,
    title: `Campaign #${13 + i}`,
    message: "Auto-generated test notification message.",
    target: (["all", "android", "ios", "custom"] as const)[
      Math.floor(Math.random() * 4)
    ],
    sentAt: "2024-01-01",
    status: (["Sent", "Scheduled", "Draft"] as const)[
      Math.floor(Math.random() * 3)
    ],
    opens: Math.floor(Math.random() * 1000),
  }));

  return [...baseData, ...moreData];
};

const columnHelper = createColumnHelper<Notification>();

const NotificationList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(() => generateData());
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Notification | null>(null);

  // Filter UI State
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleDeleteClick = (notification: Notification) => {
    setItemToDelete(notification);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setData((prev) => prev.filter((item) => item.id !== itemToDelete.id));
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Campaign Info",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 text-sm">
              {info.getValue()}
            </span>
            <span className="text-gray-500 text-xs truncate max-w-xs">
              {info.row.original.message}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("target", {
        header: "Target",
        cell: (info) => (
          <div className="flex items-center gap-2 text-gray-600">
            {info.getValue() === "all" && (
              <>
                <FaGlobe className="text-indigo-500" />
                <span className="text-sm">All</span>
              </>
            )}
            {info.getValue() === "android" && (
              <>
                <FaAndroid className="text-green-500" />
                <span className="text-sm">Android</span>
              </>
            )}
            {info.getValue() === "ios" && (
              <>
                <FaApple className="text-gray-900" />
                <span className="text-sm">iOS</span>
              </>
            )}
            {info.getValue() === "custom" && (
              <span className="text-sm bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                Custom
              </span>
            )}
          </div>
        ),
      }),
      columnHelper.accessor("sentAt", {
        header: "Date",
        cell: (info) => (
          <span className="text-sm text-gray-600">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              info.getValue() === "Sent"
                ? "bg-green-100 text-green-800"
                : info.getValue() === "Scheduled"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {info.getValue() === "Sent" ? (
              <FaCheckCircle className="mr-1" size={10} />
            ) : (
              <FaClock className="mr-1" size={10} />
            )}
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("opens", {
        header: "Engagement",
        cell: (info) =>
          info.getValue() > 0 ? (
            <span className="font-medium text-gray-900">
              {info.getValue()}{" "}
              <span className="text-gray-400 font-normal">opens</span>
            </span>
          ) : (
            <span className="text-gray-400">-</span>
          ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="text-right">
            <button
              onClick={() => handleDeleteClick(info.row.original)}
              className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <FaTrash size={14} />
            </button>
          </div>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Notification History
          </h1>
          <p className="text-sm text-gray-500">
            Manage and track your sent push notifications.
          </p>
        </div>
        <button
          onClick={() => navigate("/notifications/add")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
        >
          <span>+</span> Create New
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center transition-all">
        <div className="relative w-full sm:w-96 group">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            type="text"
            placeholder="Search notifications..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm transition-all ${
              isFilterOpen
                ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FaFilter
              className={isFilterOpen ? "text-indigo-500" : "text-gray-400"}
            />{" "}
            Filter
          </button>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      {isFilterOpen && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-down">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Target Audience
            </label>
            <select
              value={
                (table.getColumn("target")?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn("target")?.setFilterValue(e.target.value)
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Targets</option>
              <option value="android">Android</option>
              <option value="ios">iOS</option>
              <option value="custom">Custom</option>
              <option value="all">All Users</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={
                (table.getColumn("status")?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn("status")?.setFilterValue(e.target.value)
              }
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="Sent">Sent</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: <FaSortUp className="text-indigo-600" />,
                          desc: <FaSortDown className="text-indigo-600" />,
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
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No notifications found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Rows per page:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="border border-gray-200 rounded-lg text-sm p-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {[10, 20, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          {/* Jump to Page & Nav */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Go to page:</span>
              <input
                type="number"
                min={1}
                max={table.getPageCount()}
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border border-gray-200 rounded-lg p-1.5 w-16 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 mr-2">
                Page{" "}
                <span className="font-medium text-gray-900">
                  {table.getState().pagination.pageIndex + 1}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {table.getPageCount()}
                </span>
              </span>
              <button
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <FaChevronLeft size={12} />
              </button>
              <button
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Notification?"
        footer={
          <>
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-200 transition-colors"
            >
              Delete
            </button>
          </>
        }
      >
        <div className="text-center sm:text-left">
          <p className="text-gray-600 text-sm mb-4">
            Are you sure you want to delete this notification? This action
            cannot be undone.
          </p>
          {itemToDelete && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-left">
              <p className="font-medium text-gray-900 text-sm">
                {itemToDelete.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {itemToDelete.message}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default NotificationList;
