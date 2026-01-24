// Module definitions
export const MODULES = {
  DASHBOARD: "dashboard",
  WALLPAPERS: "wallpapers",
  CATEGORIES: "categories",
  NOTIFICATIONS: "notifications",
  ADMIN_USERS: "admin_users",
  APP_USERS: "app_users",
  ROLES: "roles",
  SETTINGS: "settings",
} as const;

// Permission types
export const PERMISSIONS = {
  VIEW: "view",
  CREATE: "create",
  EDIT: "edit",
  DELETE: "delete",
} as const;

// Module display names
export const MODULE_LABELS: Record<string, string> = {
  [MODULES.DASHBOARD]: "Dashboard",
  [MODULES.WALLPAPERS]: "Wallpapers",
  [MODULES.CATEGORIES]: "Categories",
  [MODULES.NOTIFICATIONS]: "Notifications",
  [MODULES.ADMIN_USERS]: "Admin Users",
  [MODULES.APP_USERS]: "App Users",
  [MODULES.ROLES]: "Roles & Permissions",
  [MODULES.SETTINGS]: "Settings",
};

// Permission display names
export const PERMISSION_LABELS: Record<string, string> = {
  [PERMISSIONS.VIEW]: "View",
  [PERMISSIONS.CREATE]: "Create",
  [PERMISSIONS.EDIT]: "Edit",
  [PERMISSIONS.DELETE]: "Delete",
};

// Type for permissions
export type ModulePermissions = {
  [key in typeof MODULES[keyof typeof MODULES]]?: {
    [key in typeof PERMISSIONS[keyof typeof PERMISSIONS]]?: boolean;
  };
};

// Helper to create full permissions for a module
export const createFullModulePermissions = () => ({
  [PERMISSIONS.VIEW]: true,
  [PERMISSIONS.CREATE]: true,
  [PERMISSIONS.EDIT]: true,
  [PERMISSIONS.DELETE]: true,
});

// Helper to create view-only permissions for a module
export const createViewOnlyPermissions = () => ({
  [PERMISSIONS.VIEW]: true,
  [PERMISSIONS.CREATE]: false,
  [PERMISSIONS.EDIT]: false,
  [PERMISSIONS.DELETE]: false,
});

// Default Super Admin permissions (all permissions)
export const SUPER_ADMIN_PERMISSIONS: ModulePermissions = {
  [MODULES.DASHBOARD]: createFullModulePermissions(),
  [MODULES.WALLPAPERS]: createFullModulePermissions(),
  [MODULES.CATEGORIES]: createFullModulePermissions(),
  [MODULES.NOTIFICATIONS]: createFullModulePermissions(),
  [MODULES.ADMIN_USERS]: createFullModulePermissions(),
  [MODULES.APP_USERS]: createFullModulePermissions(),
  [MODULES.ROLES]: createFullModulePermissions(),
  [MODULES.SETTINGS]: createFullModulePermissions(),
};

// Default Admin permissions (most permissions except role management)
export const ADMIN_PERMISSIONS: ModulePermissions = {
  [MODULES.DASHBOARD]: createFullModulePermissions(),
  [MODULES.WALLPAPERS]: createFullModulePermissions(),
  [MODULES.CATEGORIES]: createFullModulePermissions(),
  [MODULES.NOTIFICATIONS]: createFullModulePermissions(),
  [MODULES.ADMIN_USERS]: {
    [PERMISSIONS.VIEW]: true,
    [PERMISSIONS.CREATE]: true,
    [PERMISSIONS.EDIT]: true,
    [PERMISSIONS.DELETE]: false, // Cannot delete admin users
  },
  [MODULES.APP_USERS]: createFullModulePermissions(),
  [MODULES.ROLES]: createViewOnlyPermissions(), // Can only view roles
  [MODULES.SETTINGS]: {
    [PERMISSIONS.VIEW]: true,
    [PERMISSIONS.CREATE]: false,
    [PERMISSIONS.EDIT]: true,
    [PERMISSIONS.DELETE]: false,
  },
};

// Default Mobile App User permissions (minimal access - for mobile app users)
export const MOBILE_APP_USER_PERMISSIONS: ModulePermissions = {
  [MODULES.DASHBOARD]: createViewOnlyPermissions(),
  [MODULES.WALLPAPERS]: createViewOnlyPermissions(),
  [MODULES.CATEGORIES]: createViewOnlyPermissions(),
  [MODULES.NOTIFICATIONS]: createViewOnlyPermissions(),
  [MODULES.ADMIN_USERS]: {
    [PERMISSIONS.VIEW]: false,
    [PERMISSIONS.CREATE]: false,
    [PERMISSIONS.EDIT]: false,
    [PERMISSIONS.DELETE]: false,
  },
  [MODULES.APP_USERS]: {
    [PERMISSIONS.VIEW]: false,
    [PERMISSIONS.CREATE]: false,
    [PERMISSIONS.EDIT]: false,
    [PERMISSIONS.DELETE]: false,
  },
  [MODULES.ROLES]: {
    [PERMISSIONS.VIEW]: false,
    [PERMISSIONS.CREATE]: false,
    [PERMISSIONS.EDIT]: false,
    [PERMISSIONS.DELETE]: false,
  },
  [MODULES.SETTINGS]: createViewOnlyPermissions(),
};

// Get all modules as array
export const getAllModules = () => Object.values(MODULES);

// Get all permissions as array
export const getAllPermissions = () => Object.values(PERMISSIONS);

// Count total permissions for a role
export const countPermissions = (permissions: ModulePermissions): number => {
  let count = 0;
  Object.values(permissions).forEach((modulePerms) => {
    if (modulePerms) {
      Object.values(modulePerms).forEach((hasPermission) => {
        if (hasPermission) count++;
      });
    }
  });
  return count;
};
