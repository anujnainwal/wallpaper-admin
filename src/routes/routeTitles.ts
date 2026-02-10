export const ROUTE_TITLES: Record<string, string> = {
  // Auth
  "/auth/login": "Login",
  "/auth/forgot-password": "Forgot Password",
  "/auth/reset-password": "Reset Password",

  // Dashboard
  "/": "Dashboard",
  "/notifications/list": "Notifications",
  "/notifications/add": "Send Notification",

  // Content
  "/content/categories": "Categories",
  "/content/categories/add": "Add Category",
  "/content/categories/edit/:id": "Edit Category",
  "/wallpapers/list": "Wallpapers",
  "/wallpapers/:id": "Wallpaper Details",
  "/wallpapers/add": "Add Wallpaper",
  "/wallpapers/edit/:id": "Edit Wallpaper",

  // Legal & Support
  "/legal": "Legal Documents",
  "/about": "About Us",
  "/faq": "FAQ",
  "/help": "Help & Support",
  "/system/audit-logs": "Audit Logs",

  // User Management
  "/users/list": "Users",
  "/users/add": "Add User",
  "/users/edit/:id": "Edit User",

  // App Users
  "/app-users/list": "App Users",
  "/app-users/add": "Add App User",
  "/app-users/edit/:id": "Edit App User",
  "/app-users/:id": "App User Details",

  // Roles
  "/roles/list": "Roles",
  "/roles/add": "Add Role",
  "/roles/edit/:id": "Edit Role",

  // Settings
  "/settings/integrations": "Integrations",

  // Profile
  "/profile": "My Profile",

  // Feedback
  "/feedback/list": "Feedback",

  // Errors
  "/403": "Forbidden",
  "*": "Page Not Found",
};
