import React, { useEffect, useMemo, useState } from "react";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import { ReusableTable } from "../components/common/ReusableTable";
import axios from "axios";

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

const ApiTablePage: React.FC = () => {
  const [data, setData] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);

  // Controlled State
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const { pageIndex, pageSize } = pagination;
      // JSONPlaceholder uses 1-based indexing for pages
      const page = pageIndex + 1;

      const response = await axios.get<Comment[]>(
        "https://jsonplaceholder.typicode.com/comments",
        {
          params: {
            _page: page,
            _limit: pageSize,
            q: globalFilter || undefined, // Only send if not empty
          },
        },
      );

      setData(response.data);
      // JSONPlaceholder returns total count in headers
      const total = parseInt(response.headers["x-total-count"] || "0", 10);
      setTotalRows(total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when pagination or filter changes
  useEffect(() => {
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter]);

  const columns = useMemo<ColumnDef<Comment>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => (
          <span className="text-gray-500">#{info.getValue() as number}</span>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => (
          <span className="font-medium text-gray-900 line-clamp-1">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => (
          <span className="text-blue-600">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: "body",
        header: "Comment",
        cell: (info) => (
          <span
            className="text-gray-600 line-clamp-2 max-w-xs"
            title={info.getValue() as string}
          >
            {info.getValue() as string}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">
          API Integration Example
        </h1>
        <p className="text-sm text-gray-500">
          Fetching data from JSONPlaceholder (Server-side Pagination &
          Searching).
        </p>
      </div>

      <ReusableTable
        columns={columns}
        data={data}
        searchPlaceholder="Search comments..."
        // Controlled Props
        pageCount={Math.ceil(totalRows / pagination.pageSize)}
        pagination={pagination}
        onPaginationChange={setPagination}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        loading={loading}
        // Actions
        basePath="/comments"
        onView={(row) => console.log("View", row)}
        onEdit={(row) => console.log("Edit", row)}
        onDelete={(row) => {
          setData((prev) => prev.filter((r) => r.id !== row.id));
        }}
      />
    </div>
  );
};

export default ApiTablePage;
