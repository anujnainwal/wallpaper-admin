import React, { useEffect, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { FaUserClock, FaHistory } from "react-icons/fa";
import { ReusableTable } from "../../components/common/ReusableTable";
import { getAuditLogs, type AuditLog } from "../../services/auditLogService";
import { notifyError } from "../../utils/toastUtils";

const AuditLogList: React.FC = () => {
  const [data, setData] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: "id",
      header: "Log ID",
      cell: (info) => (
        <span className="font-mono text-xs text-gray-500">
          {(info.getValue() as string).substring(0, 8)}...
        </span>
      ),
    },
    {
      accessorKey: "userName",
      header: "User",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <FaUserClock size={12} />
          </div>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {info.getValue() as string}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: (info) => {
        const action = info.getValue() as string;
        let colorClass = "bg-gray-100 text-gray-800";

        switch (action) {
          case "Create":
          case "CREATE":
            colorClass = "bg-green-100 text-green-800 border border-green-200";
            break;
          case "Update":
          case "UPDATE":
            colorClass = "bg-blue-100 text-blue-800 border border-blue-200";
            break;
          case "Delete":
          case "DELETE":
            colorClass = "bg-red-100 text-red-800 border border-red-200";
            break;
          case "Login":
          case "LOGIN":
            colorClass =
              "bg-indigo-100 text-indigo-800 border border-indigo-200";
            break;
        }

        return (
          <span
            className={`px-2 py-0.5 rounded text-xs font-semibold ${colorClass}`}
          >
            {action}
          </span>
        );
      },
    },
    {
      accessorKey: "entity",
      header: "Entity",
      cell: (info) => (
        <span className="text-gray-600 dark:text-gray-400 font-medium">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "details",
      header: "Details",
      cell: (info) => (
        <span
          className="text-gray-500 text-sm truncate max-w-[200px]"
          title={info.getValue() as string}
        >
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "ipAddress",
      header: "IP Address",
      cell: (info) => (
        <span className="font-mono text-xs bg-gray-50 dark:bg-gray-700 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Timestamp",
      cell: (info) => {
        const date = new Date(info.getValue() as string);
        return (
          <div className="text-xs text-gray-500 flex flex-col">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {date.toLocaleDateString()}
            </span>
            <span>{date.toLocaleTimeString()}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as string;
        const isSuccess = status === "success";
        return (
          <div
            className={`flex items-center gap-1.5 ${isSuccess ? "text-green-600" : "text-red-600"}`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${isSuccess ? "bg-green-500" : "bg-red-500"}`}
            ></div>
            <span className="capitalize text-xs font-medium">{status}</span>
          </div>
        );
      },
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAuditLogs({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      });
      setData(response.data);
      setPageCount(response.meta.totalPages);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
      notifyError("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FaHistory className="text-indigo-600" />
            Audit Logs
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track user activities and system events.
          </p>
        </div>
      </div>

      <ReusableTable
        columns={columns}
        data={data}
        loading={loading}
        pagination={pagination}
        pageCount={pageCount}
        onPaginationChange={setPagination}
        searchPlaceholder="Search logs..."
        title="Audit Logs"
      />
    </div>
  );
};

export default AuditLogList;
