import React, { useState, useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ReusableTable } from "../components/common/ReusableTable";

interface TempData {
  id: string;
  name: string;
  status: "Active" | "Inactive" | "Pending";
  role: string;
  email: string;
  joinDate: string;
}

const initialData: TempData[] = [
  {
    id: "1",
    name: "John Doe",
    status: "Active",
    role: "Admin",
    email: "john.doe@example.com",
    joinDate: "2023-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    status: "Inactive",
    role: "User",
    email: "jane.smith@example.com",
    joinDate: "2023-02-20",
  },
  {
    id: "3",
    name: "Robert Brown",
    status: "Pending",
    role: "Editor",
    email: "robert.brown@example.com",
    joinDate: "2023-03-10",
  },
  {
    id: "4",
    name: "Emily Davis",
    status: "Active",
    role: "User",
    email: "emily.davis@example.com",
    joinDate: "2023-04-05",
  },
  {
    id: "5",
    name: "Michael Wilson",
    status: "Active",
    role: "Viewer",
    email: "michael.wilson@example.com",
    joinDate: "2023-05-12",
  },
  // Add more dummy data if needed
];

const TempTablePage: React.FC = () => {
  const [data] = useState<TempData[]>(initialData);

  const columns = useMemo<ColumnDef<TempData>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => (
          <span className="font-medium text-gray-900">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => (
          <span className="text-gray-600">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (info) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as string;
          let colorClass = "bg-gray-100 text-gray-800";
          if (status === "Active") colorClass = "bg-green-100 text-green-800";
          else if (status === "Inactive")
            colorClass = "bg-red-100 text-red-800";
          else if (status === "Pending")
            colorClass = "bg-yellow-100 text-yellow-800";

          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "joinDate",
        header: "Join Date",
        cell: (info) => (
          <span className="text-gray-500 text-sm">
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
          <h1 className="text-2xl font-bold text-gray-900">Temporary Table</h1>
          <p className="text-sm text-gray-500 mt-1">
            A temporary view for testing table functionalities.
          </p>
        </div>
      </div>

      <ReusableTable
        columns={columns}
        data={data}
        searchPlaceholder="Search users..."
        onView={(row) => console.log("View", row)}
        onEdit={(row) => console.log("Edit", row)}
        onDelete={(row) => console.log("Delete", row)}
        onBulkDelete={async (selected) => {
          console.log("Bulk Delete", selected);
          alert(`Bulk delete ${selected.length} rows`);
        }}
      />
    </div>
  );
};

export default TempTablePage;
