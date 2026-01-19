import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
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
  FaFolderOpen,
} from "react-icons/fa";
import { useAppDispatch } from "../hooks/storeHook";
import { logout } from "../store/slices/authSlice";

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

const DashboardLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    Notifications: true, // Default expanded
  });

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
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
        { path: "/wallpapers", label: "Wallpapers", icon: <FaImages /> },
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
        { path: "/users", label: "Users", icon: <FaUsers /> },
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
      ],
    },
    {
      title: "System",
      items: [{ path: "/settings", label: "Settings", icon: <FaCog /> }],
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
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
        <div className="p-6 flex items-center space-x-3 border-b border-gray-50">
          <div className="relative">
            <img
              src="/wallpaper-logo.png"
              alt="Logo"
              className="w-10 h-10 rounded-xl shadow-sm object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <span className="block text-lg font-bold text-gray-900 tracking-tight leading-none">
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
              <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
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
                        >
                          <div className="flex items-center space-x-3">
                            <span
                              className={`text-lg transition-transform duration-200 ${
                                hasActiveChild
                                  ? "text-indigo-600"
                                  : "text-gray-400 group-hover:text-gray-600"
                              }`}
                            >
                              {item.icon}
                            </span>
                            <span className="font-medium text-sm">
                              {item.label}
                            </span>
                          </div>
                          <span className="text-gray-400 text-xs">
                            {isExpanded ? (
                              <FaChevronDown />
                            ) : (
                              <FaChevronRight />
                            )}
                          </span>
                        </button>

                        {/* Nested Items */}
                        {isExpanded && (
                          <ul className="pl-4 space-y-1 mt-1">
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
                      >
                        <span
                          className={`text-lg transition-transform duration-200 ${
                            isActive ? "scale-100" : "group-hover:scale-110"
                          } ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}
                        >
                          {item.icon}
                        </span>
                        <span className="font-medium text-sm">
                          {item.label}
                        </span>
                        {isActive && (
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
          >
            <FaSignOutAlt className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50/50">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200/60 px-8 py-4 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {/* Note: Breadcrumb logic would go here, simplified for now */}
              Dashboard
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Overview of your activity
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
              <FaBell className="w-5 h-5" />
              <span className="absolute -top-1 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-px w-8 bg-gray-200 rotate-90"></div>
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

        <footer className="bg-white border-t border-gray-200 py-4 px-8 flex justify-between items-center text-xs text-gray-400">
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
    </div>
  );
};

export default DashboardLayout;
