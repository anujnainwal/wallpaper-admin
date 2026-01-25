
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  ipAddress: string;
  userAgent?: string;
  createdAt: string;
  status: "success" | "failure" | "warning";
}

interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface AuditLogsResponse {
  data: AuditLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Mock data generator for development
const generateMockLogs = (count: number): AuditLog[] => {
  const actions = [
    "LOGIN",
    "LOGOUT",
    "CREATE",
    "UPDATE",
    "DELETE",
    "VIEW",
    "EXPORT",
  ];
  const entities = [
    "USER",
    "WALLPAPER",
    "CATEGORY",
    "ROLE",
    "SYSTEM",
    "REPORT",
  ];
  const statuses: ("success" | "failure" | "warning")[] = [
    "success",
    "success",
    "success",
    "failure",
    "warning",
  ];

  return Array.from({ length: count }).map((_, index) => {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const entity = entities[Math.floor(Math.random() * entities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const date = new Date(
      Date.now() - Math.floor(Math.random() * 10000000000),
    ).toISOString();

    return {
      id: `log_${Date.now()}_${index}`,
      userId: `user_${Math.floor(Math.random() * 100)}`,
      userName: `Admin User ${Math.floor(Math.random() * 20)}`,
      action,
      entity,
      entityId: `ent_${Math.floor(Math.random() * 1000)}`,
      details: `${action} action performed on ${entity}`,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      createdAt: date,
      status,
    };
  });
};

// Simulated backend delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAuditLogs = async (
  params: GetAuditLogsParams,
): Promise<AuditLogsResponse> => {
  // In a real app, you would call the API:
  // const response = await api.get('/audit-logs', { params });
  // return response.data;

  // Mock implementation
  await delay(800); // Simulate network latency

  const mockLogs = generateMockLogs(50);

  // Basic filtering
  let filteredLogs = [...mockLogs];
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredLogs = filteredLogs.filter(
      (log) =>
        log.userName.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        log.entity.toLowerCase().includes(searchLower) ||
        log.ipAddress.includes(searchLower),
    );
  }

  // Sorting
  if (params.sortBy) {
    filteredLogs.sort((a, b) => {
      const fieldA = a[params.sortBy as keyof AuditLog];
      const fieldB = b[params.sortBy as keyof AuditLog];

      if (!fieldA || !fieldB) return 0;

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return params.sortOrder === "desc"
          ? fieldB.localeCompare(fieldA)
          : fieldA.localeCompare(fieldB);
      }
      return 0;
    });
  } else {
    // Default sort by date desc
    filteredLogs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  // Pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  return {
    data: paginatedLogs,
    meta: {
      total: filteredLogs.length,
      page,
      limit,
      totalPages: Math.ceil(filteredLogs.length / limit),
    },
  };
};
