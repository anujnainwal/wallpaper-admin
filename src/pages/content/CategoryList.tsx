import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  SortingState,
  ExpandedState,
} from "@tanstack/react-table";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaFolderOpen,
  FaImage,
  FaChevronRight,
  FaChevronDown,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";

interface Category {
  id: string;
  name: string;
  icon: string | null;
  parentId: string | null;
  children?: Category[];
  itemCount: number;
  createdAt: string;
}

// Mock Data
const initialCategories: Category[] = [
  {
    id: "1",
    name: "Wallpapers",
    icon: "https://ui-avatars.com/api/?name=W&background=6366f1&color=fff",
    parentId: null,
    itemCount: 1250,
    createdAt: "2024-01-15",
    children: [
      {
        id: "1-1",
        name: "Abstract",
        icon: "https://ui-avatars.com/api/?name=A&background=818cf8&color=fff",
        parentId: "1",
        itemCount: 450,
        createdAt: "2024-01-16",
      },
      {
        id: "1-2",
        name: "Nature",
        icon: "https://ui-avatars.com/api/?name=N&background=818cf8&color=fff",
        parentId: "1",
        itemCount: 320,
        createdAt: "2024-01-16",
      },
      {
        id: "1-3",
        name: "Minimal",
        icon: "https://ui-avatars.com/api/?name=M&background=818cf8&color=fff",
        parentId: "1",
        itemCount: 280,
        createdAt: "2024-01-17",
      },
      {
        id: "1-4",
        name: "Dark",
        icon: "https://ui-avatars.com/api/?name=D&background=3730a3&color=fff",
        parentId: "1",
        itemCount: 200,
        createdAt: "2024-01-18",
      },
      {
        id: "1-5",
        name: "Patterns",
        icon: "https://ui-avatars.com/api/?name=P&background=3730a3&color=fff",
        parentId: "1",
        itemCount: 150,
        createdAt: "2024-01-19",
      },
      {
        id: "1-6",
        name: "Textures",
        icon: "https://ui-avatars.com/api/?name=T&background=3730a3&color=fff",
        parentId: "1",
        itemCount: 120,
        createdAt: "2024-01-20",
      },
    ],
  },
  {
    id: "2",
    name: "Ringtones",
    icon: "https://ui-avatars.com/api/?name=R&background=ec4899&color=fff",
    parentId: null,
    itemCount: 850,
    createdAt: "2024-02-01",
    children: [
      {
        id: "2-1",
        name: "Classical",
        icon: "https://ui-avatars.com/api/?name=C&background=f472b6&color=fff",
        parentId: "2",
        itemCount: 120,
        createdAt: "2024-02-02",
      },
      {
        id: "2-2",
        name: "Pop",
        icon: "https://ui-avatars.com/api/?name=P&background=f472b6&color=fff",
        parentId: "2",
        itemCount: 340,
        createdAt: "2024-02-03",
      },
    ],
  },
  {
    id: "3",
    name: "Live Wallpapers",
    icon: "https://ui-avatars.com/api/?name=L&background=10b981&color=fff",
    parentId: null,
    itemCount: 150,
    createdAt: "2024-03-01",
  },
];

const CategoryList: React.FC = () => {
  const [data] = useState(() => initialCategories);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Category Name",
        cell: ({ row, getValue }) => {
          return (
            <div
              className="flex items-center"
              style={{
                paddingLeft: `${row.depth * 2}rem`,
              }}
            >
              {row.getCanExpand() && (
                <button
                  onClick={row.getToggleExpandedHandler()}
                  className="mr-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {row.getIsExpanded() ? (
                    <FaChevronDown size={12} />
                  ) : (
                    <FaChevronRight size={12} />
                  )}
                </button>
              )}
              {!row.getCanExpand() && <span className="w-5 mr-2"></span>}

              <div className="h-10 w-10 rounded-lg bg-gray-100 flex-shrink-0 mr-3 flex items-center justify-center border border-gray-200 overflow-hidden">
                {row.original.icon ? (
                  <img
                    src={row.original.icon}
                    alt={row.original.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaImage className="text-gray-400" />
                )}
              </div>

              <div>
                <span className="font-medium text-gray-900 block">
                  {getValue() as string}
                </span>
                {row.original.parentId === null && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded textxs font-medium bg-indigo-50 text-indigo-700">
                    Parent
                  </span>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "itemCount",
        header: "Items",
        cell: (info) => (
          <span className="text-gray-600 text-sm">
            {info.getValue() as number} items
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: (info) => (
          <span className="text-gray-500 text-sm">
            {new Date(info.getValue() as string).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end space-x-2">
            <button
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit"
            >
              <FaEdit size={14} />
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this category?",
                  )
                ) {
                  console.log("Delete", row.original.id);
                }
              }}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <FaTrash size={14} />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
      globalFilter,
      sorting,
    },
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getSubRows: (row) => row.children,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 5, // Default page size
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your content hierarchy and organization
          </p>
        </div>
        <Link
          to="/content/categories/add"
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
        >
          <FaPlus size={14} />
          <span>Add Category</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
              placeholder="Search categories..."
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="border border-gray-200 rounded-lg text-sm p-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
            >
              {[5, 10, 20, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
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
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
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
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
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
                      <p className="text-base font-medium">
                        No categories found
                      </p>
                      <p className="text-sm">Try adjusting your search terms</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {table.getRowModel().rows.length}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {table.getFilteredRowModel().rows.length}
                </span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <FaChevronDown
                    className="h-5 w-5 rotate-90"
                    aria-hidden="true"
                  />
                </button>
                {/* Simplified page numbers - could be enhanced */}
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
