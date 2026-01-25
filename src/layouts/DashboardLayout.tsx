import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  FaHome,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaImages,
  FaLayerGroup,
  FaUsers,
  FaChartBar,
  FaBell,
  FaChevronDown,
  FaChevronRight,
  FaList,
  FaPlus,
  FaBalanceScale,
  FaInfoCircle,
  FaQuestionCircle,
  FaLifeRing,
  FaBars,
  FaTable,
  FaCloud,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSun,
  FaMoon,
  FaUserShield,
  FaMobileAlt,
  FaCommentDots,
} from "react-icons/fa";
import { useAppDispatch } from "../hooks/storeHook";
import { logout } from "../store/slices/authSlice";
import { useTheme } from "../hooks/useTheme";

// Define Menu Item types
interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface MenuGroup {
  title: string;
  items: (
    | MenuItem
    | {
        label: string;
        icon: React.ReactNode;
        path?: string;
        subItems: MenuItem[];
      }
  )[];
}

const DASHBOARD_NOTIFICATIONS = [
  {
    id: 1,
    title: "Server overloaded",
    message: "High CPU usage detected on primary instance.",
    time: "2m ago",
    type: "alert",
    read: false,
  },
  {
    id: 2,
    title: "New user registered",
    message: "User 'JohnDoe' joined the platform.",
    time: "1h ago",
    type: "system",
    read: false,
  },
  {
    id: 3,
    title: "Backup completed",
    message: "Daily backup finished successfully.",
    time: "5h ago",
    type: "success",
    read: true,
  },
  {
    id: 4,
    title: "Storage Warning",
    message: "Server storage has reached 85% capacity.",
    time: "6h ago",
    type: "alert",
    read: true,
  },
  {
    id: 5,
    title: "Payment Received",
    message: "Monthly subscription payment from user #443.",
    time: "1d ago",
    type: "success",
    read: true,
  },
  {
    id: 6,
    title: "System Update",
    message: "System maintenance scheduled for 12:00 AM.",
    time: "1d ago",
    type: "system",
    read: true,
  },
  {
    id: 7,
    title: "New Review",
    message: "5-star review received from 'Sarah'.",
    time: "2d ago",
    type: "success",
    read: true,
  },
  {
    id: 8,
    title: "Wallpapers Approved",
    message: "Batch #2203 has been auto-approved.",
    time: "2d ago",
    type: "success",
    read: true,
  },
  {
    id: 9,
    title: "Failed Login Attempt",
    message: "Multiple failed login attempts from IP 192.168.1.1",
    time: "3d ago",
    type: "alert",
    read: true,
  },
  {
    id: 10,
    title: "API Limit Reached",
    message: "Free tier API usage limit reached for key 883...",
    time: "4d ago",
    type: "alert",
    read: true,
  },
  {
    id: 11,
    title: "Welcome New Staff",
    message: "Please welcome Mike to the support team!",
    time: "5d ago",
    type: "system",
    read: true,
  },
];

const DashboardLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    Notifications: true, // Default expanded
  });
  // Initialize sidebar based on screen width (optional, basic check)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();

  // Notification State
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [activeNotificationTab, setActiveNotificationTab] = useState<
    "all" | "unread"
  >("all");
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close sidebar on route change on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Profile Dropdown Text
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
      // Notification Dropdown Check
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleSubMenu = (label: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const filteredNotifications = DASHBOARD_NOTIFICATIONS.filter((n) => {
    if (activeNotificationTab === "unread") return !n.read;
    return true;
  });

  const menuGroups: MenuGroup[] = [
    {
      title: "Overview",
      items: [
        { path: "/", label: "Dashboard", icon: <FaHome /> },
        { path: "/analytics", label: "Analytics", icon: <FaChartBar /> },
      ],
    },
    {
      title: "Content",
      items: [
        {
          label: "Wallpapers",
          icon: <FaImages />,
          subItems: [
            {
              path: "/wallpapers/list",
              label: "All Wallpapers",
              icon: <FaList />,
            },
            {
              path: "/wallpapers/add",
              label: "Add Wallpaper",
              icon: <FaPlus />,
            },
          ],
        },
        {
          label: "Categories",
          icon: <FaLayerGroup />,
          subItems: [
            {
              path: "/content/categories",
              label: "All Categories",
              icon: <FaList />,
            },
            {
              path: "/content/categories/add",
              label: "Add Category",
              icon: <FaPlus />,
            },
          ],
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          label: "Users",
          icon: <FaUsers />,
          subItems: [
            {
              path: "/users/list",
              label: "Admin Users",
              icon: <FaUserShield />,
            },
            {
              path: "/users/add",
              label: "Add Admin",
              icon: <FaPlus />,
            },
            {
              path: "/app-users/list",
              label: "App Users",
              icon: <FaMobileAlt />,
            },
            {
              path: "/app-users/add",
              label: "Add App User",
              icon: <FaPlus />,
            },
          ],
        },
        { path: "/profile", label: "Profile", icon: <FaUser /> },
        {
          label: "Notifications",
          icon: <FaBell />,
          subItems: [
            {
              path: "/notifications/list",
              label: "All Notifications",
              icon: <FaList />,
            },
            {
              path: "/notifications/add",
              label: "Send Notification",
              icon: <FaPlus />,
            },
          ],
        },
        {
          label: "Roles & Permissions",
          icon: <FaUserShield />,
          subItems: [
            {
              path: "/roles/list",
              label: "All Roles",
              icon: <FaList />,
            },
            {
              path: "/roles/add",
              label: "Add Role",
              icon: <FaPlus />,
            },
          ],
        },
        {
          path: "/feedback/list",
          label: "User Feedback",
          icon: <FaCommentDots />,
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          label: "Settings",
          icon: <FaCog />,
          subItems: [
            {
              path: "/settings/integrations",
              label: "Integrations",
              icon: <FaCloud />,
            },
          ],
        },
        { path: "/temp-table", label: "Temporary", icon: <FaTable /> },
        { path: "/api-table", label: "API Table", icon: <FaCloud /> },
        {
          path: "/system/audit-logs",
          label: "Audit Logs",
          icon: <FaList />, // Using FaList as FaClipboardList might not be imported yet
        },
      ],
    },
    {
      title: "Legal",
      items: [
        { path: "/legal", label: "Legal Documents", icon: <FaBalanceScale /> },
      ],
    },
    {
      title: "Support",
      items: [
        { path: "/about", label: "About App", icon: <FaInfoCircle /> },
        { path: "/faq", label: "FAQ", icon: <FaQuestionCircle /> },
        { path: "/help", label: "Help & Support", icon: <FaLifeRing /> },
      ],
    },
  ];

  return (
    <div
      className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-30 h-full border-r flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0 md:w-20"}
          ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}
        `}
      >
        <div
          className={`p-6 flex items-center space-x-3 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-50"} ${!isSidebarOpen ? "md:justify-center md:px-2" : ""}`}
        >
          <div className="relative">
            <img
              src="/wallpaper-logo.png"
              alt="Logo"
              className="w-10 h-10 rounded-xl shadow-sm object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className={`${!isSidebarOpen ? "md:hidden" : "block"}`}>
            <span
              className={`block text-lg font-bold tracking-tight leading-none ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              Wallpaper
            </span>
            <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
              Admin Panel
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <p
                className={`px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 ${!isSidebarOpen ? "md:hidden" : ""}`}
              >
                {group.title}
              </p>
              <ul className="space-y-1">
                {group.items.map((item, itemIndex) => {
                  // Check if item has subItems (Nested Menu)
                  if ("subItems" in item && item.subItems) {
                    const isExpanded = expandedMenus[item.label];
                    const hasActiveChild = item.subItems.some(
                      (sub) => location.pathname === sub.path,
                    );

                    return (
                      <li key={itemIndex} className="space-y-1">
                        <button
                          onClick={() => toggleSubMenu(item.label)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                            hasActiveChild
                              ? "bg-gray-50 text-gray-900"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                          title={!isSidebarOpen ? item.label : ""}
                        >
                          <div
                            className={`flex items-center space-x-3 ${!isSidebarOpen ? "md:justify-center md:w-full md:space-x-0" : ""}`}
                          >
                            <span
                              className={`text-lg transition-transform duration-200 ${
                                hasActiveChild
                                  ? "text-indigo-600"
                                  : "text-gray-400 group-hover:text-gray-600"
                              }`}
                            >
                              {item.icon}
                            </span>
                            <span
                              className={`font-medium text-sm ${!isSidebarOpen ? "md:hidden" : "block"}`}
                            >
                              {item.label}
                            </span>
                          </div>
                          <span
                            className={`text-gray-400 text-xs ${!isSidebarOpen ? "md:hidden" : "block"}`}
                          >
                            {isExpanded ? (
                              <FaChevronDown />
                            ) : (
                              <FaChevronRight />
                            )}
                          </span>
                        </button>

                        {/* Nested Items */}
                        {isExpanded && (
                          <ul
                            className={`pl-4 space-y-1 mt-1 ${!isSidebarOpen ? "md:hidden" : ""}`}
                          >
                            {item.subItems.map((subItem) => {
                              const isSubActive =
                                location.pathname === subItem.path;
                              return (
                                <li key={subItem.path}>
                                  <Link
                                    to={subItem.path}
                                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                                      isSubActive
                                        ? "bg-gray-900 text-white shadow-md shadow-gray-200"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                  >
                                    <span
                                      className={`text-sm ${isSubActive ? "text-white" : "text-gray-400"}`}
                                    >
                                      {subItem.icon}
                                    </span>
                                    <span className="font-medium text-sm">
                                      {subItem.label}
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  }

                  // Regular Item
                  if (!item.path) return null;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                          isActive
                            ? "bg-gray-900 text-white shadow-md shadow-gray-200"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                        title={!isSidebarOpen ? item.label : ""}
                      >
                        <span
                          className={`text-lg transition-transform duration-200 ${
                            isActive ? "scale-100" : "group-hover:scale-110"
                          } ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}
                        >
                          {item.icon}
                        </span>
                        <span
                          className={`font-medium text-sm ${!isSidebarOpen ? "md:hidden" : "block"}`}
                        >
                          {item.label}
                        </span>
                        {isActive && isSidebarOpen && (
                          <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-sm"></span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-white hover:text-red-600 hover:border-red-100 hover:shadow-sm transition-all duration-200 group bg-white"
            title={!isSidebarOpen ? "Sign Out" : ""}
          >
            <FaSignOutAlt className="group-hover:-translate-x-0.5 transition-transform" />
            <span
              className={`font-medium text-sm ${!isSidebarOpen ? "md:hidden" : "block"}`}
            >
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col h-screen overflow-hidden ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50/50"}`}
      >
        <header
          className={`backdrop-blur-md sticky top-0 z-10 border-b px-8 py-4 flex justify-between items-center shadow-sm transition-colors duration-300 ${
            theme === "dark"
              ? "bg-gray-800/80 border-gray-700"
              : "bg-white/80 border-gray-200/60"
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 -ml-2 rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                theme === "dark"
                  ? "text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
                  : "text-gray-500 hover:bg-gray-100 focus:ring-gray-200"
              }`}
              aria-label="Toggle Sidebar"
            >
              <FaBars size={20} />
            </button>
            <div>
              <h2
                className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                {/* Note: Breadcrumb logic would go here, simplified for now */}
                Dashboard
              </h2>
              <p
                className={`text-xs mt-0.5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                Overview of your activity
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-700 text-yellow-400 shadow-lg shadow-yellow-500/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title={
                theme === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
            >
              {theme === "dark" ? (
                <FaSun className="w-5 h-5" />
              ) : (
                <FaMoon className="w-5 h-5" />
              )}
            </button>
            <div
              className={`h-px w-8 rotate-90 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
            ></div>

            {/* Notification Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button
                className={`relative p-2 rounded-xl transition-all duration-200 ${
                  isNotificationDropdownOpen
                    ? theme === "dark"
                      ? "bg-indigo-900/50 text-indigo-400"
                      : "bg-indigo-50 text-indigo-600"
                    : theme === "dark"
                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() =>
                  setIsNotificationDropdownOpen(!isNotificationDropdownOpen)
                }
              >
                <FaBell className="w-5 h-5" />
                <span
                  className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 pointer-events-none ${
                    theme === "dark" ? "border-gray-800" : "border-white"
                  }`}
                ></span>
              </button>

              {isNotificationDropdownOpen && (
                <div
                  className={`absolute top-12 right-0 w-80 sm:w-96 rounded-2xl shadow-xl border z-50 overflow-hidden animate-fade-in-up origin-top-right transition-colors duration-300 ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-100"
                  }`}
                >
                  {/* Header & Tabs */}
                  <div
                    className={`p-4 border-b transition-colors duration-300 ${
                      theme === "dark"
                        ? "border-gray-700 bg-gray-800/50"
                        : "border-gray-50 bg-gray-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className={`font-bold ${
                          theme === "dark" ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        Notifications
                      </h3>
                      <button
                        className={`text-xs font-medium transition-colors ${
                          theme === "dark"
                            ? "text-indigo-400 hover:text-indigo-300"
                            : "text-indigo-600 hover:text-indigo-700"
                        }`}
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div
                      className={`flex p-1 rounded-lg ${
                        theme === "dark" ? "bg-gray-700/50" : "bg-gray-200/50"
                      }`}
                    >
                      {["all", "unread"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveNotificationTab(tab as any)}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                            activeNotificationTab === tab
                              ? theme === "dark"
                                ? "bg-gray-600 text-gray-100 shadow-sm"
                                : "bg-white text-gray-900 shadow-sm"
                              : theme === "dark"
                                ? "text-gray-400 hover:text-gray-300"
                                : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notification List */}
                  <div
                    className={`max-h-[380px] overflow-y-auto scrollbar-thin ${
                      theme === "dark"
                        ? "scrollbar-thumb-gray-600"
                        : "scrollbar-thumb-gray-200"
                    }`}
                  >
                    {filteredNotifications.length > 0 ? (
                      <div
                        className={`divide-y ${
                          theme === "dark"
                            ? "divide-gray-700"
                            : "divide-gray-50"
                        }`}
                      >
                        {filteredNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 flex gap-3 transition-colors cursor-pointer group ${
                              !notification.read
                                ? theme === "dark"
                                  ? "bg-indigo-900/20"
                                  : "bg-indigo-50/30"
                                : ""
                            } ${
                              theme === "dark"
                                ? "hover:bg-gray-700/50"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                                notification.type === "alert"
                                  ? theme === "dark"
                                    ? "bg-red-900/30 text-red-400 border-red-800"
                                    : "bg-red-50 text-red-500 border-red-100"
                                  : notification.type === "system"
                                    ? theme === "dark"
                                      ? "bg-blue-900/30 text-blue-400 border-blue-800"
                                      : "bg-blue-50 text-blue-500 border-blue-100"
                                    : theme === "dark"
                                      ? "bg-emerald-900/30 text-emerald-400 border-emerald-800"
                                      : "bg-emerald-50 text-emerald-500 border-emerald-100"
                              }`}
                            >
                              {notification.type === "alert" ? (
                                <FaExclamationTriangle size={14} />
                              ) : notification.type === "system" ? (
                                <FaInfoCircle size={14} />
                              ) : (
                                <FaCheckCircle size={14} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-0.5">
                                <p
                                  className={`text-sm truncate pr-2 ${
                                    !notification.read
                                      ? theme === "dark"
                                        ? "font-bold text-gray-100"
                                        : "font-bold text-gray-900"
                                      : theme === "dark"
                                        ? "font-medium text-gray-300"
                                        : "font-medium text-gray-700"
                                  }`}
                                >
                                  {notification.title}
                                </p>
                                <span
                                  className={`text-[10px] whitespace-nowrap ${
                                    theme === "dark"
                                      ? "text-gray-500"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {notification.time}
                                </span>
                              </div>
                              <p
                                className={`text-xs line-clamp-2 leading-relaxed ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
                                {notification.message}
                              </p>
                            </div>
                            {!notification.read && (
                              <div
                                className={`self-center w-2 h-2 rounded-full shrink-0 ${
                                  theme === "dark"
                                    ? "bg-indigo-400"
                                    : "bg-indigo-500"
                                }`}
                              ></div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                            theme === "dark"
                              ? "bg-gray-700 text-gray-500"
                              : "bg-gray-50 text-gray-300"
                          }`}
                        >
                          <FaBell size={20} />
                        </div>
                        <p
                          className={`text-sm font-medium ${
                            theme === "dark" ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          No notifications
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          You're all caught up!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <Link
                    to="/notifications/list"
                    className={`block p-3 text-center text-xs font-semibold border-t transition-colors ${
                      theme === "dark"
                        ? "text-indigo-400 border-gray-700 hover:bg-gray-700/50"
                        : "text-indigo-600 border-gray-50 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsNotificationDropdownOpen(false)}
                  >
                    View All Notifications
                  </Link>
                </div>
              )}
            </div>

            <div className="h-px w-8 bg-gray-200 rotate-90 hidden sm:block"></div>
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <div className="text-right d-none md:block">
                  <span className="block text-sm font-bold text-gray-900 leading-tight">
                    Admin User
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Super Admin
                  </span>
                </div>
                <img
                  src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff"
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute top-12 right-0 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fade-in-up z-50">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      Account
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                  >
                    <FaUser size={14} />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                  >
                    <FaCog size={14} />
                    <span>Settings</span>
                  </Link>
                  <div className="h-px bg-gray-50 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                  >
                    <FaSignOutAlt size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 custom-scrollbar">
          <Outlet />
        </div>

        <footer
          className={`border-t py-4 px-8 flex justify-between items-center text-xs ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 text-gray-500"
              : "bg-white border-gray-200 text-gray-400"
          }`}
        >
          <span>© {new Date().getFullYear()} Wallpaper Admin</span>
          <div className="space-x-4">
            <a href="#" className="hover:text-gray-600 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-600 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-gray-600 transition-colors">
              Support
            </a>
          </div>
        </footer>
      </main>
      <Toaster />
    </div>
  );
};

export default DashboardLayout;
