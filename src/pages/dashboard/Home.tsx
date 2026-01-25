import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FaUsers,
  FaAndroid,
  FaApple,
  FaGlobeAmericas,
  FaArrowUp,
  FaMobileAlt,
} from "react-icons/fa";
import {
  dashboardService,
  type DashboardStats,
} from "../../services/dashboardService";

const Home: React.FC = () => {
  const defaultStats: DashboardStats = {
    users: { total: 0, active: 0, growth: 0 },
    devices: {
      android: 0,
      ios: 0,
      distribution: { android: 0, ios: 0 },
    },
    wallpapers: {
      total: 0,
      active: 0,
      pending: 0,
      recent: [],
    },
    countries: [],
    userActivity: [],
  };

  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load dashboard data. Showing empty state.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const platformData = [
    { name: "Android", value: stats.devices.android },
    { name: "iOS", value: stats.devices.ios },
  ];
  const PLATFORM_COLORS = ["#10B981", "#6366f1"]; // Android Green, iOS Indigo

  return (
    <div className="space-y-8">
      {/* Error Alert */}
      {error && (
        <div
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg relative flex items-center justify-between"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-700 dark:text-red-400 font-bold hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            App Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Mobile engagement and user growth metrics.
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <FaUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              <FaArrowUp className="w-3 h-3 mr-1" /> {stats.users.growth}%
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Total Users
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.users.total.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
              <FaMobileAlt className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            {/* Mock percentage as dynamic data not fully available yet */}
            <span className="flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              <FaArrowUp className="w-3 h-3 mr-1" /> 8%
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Active Users
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.users.active.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Last 30 days
            </p>
          </div>
        </div>

        {/* Android Users */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <FaAndroid className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              <FaArrowUp className="w-3 h-3 mr-1" />{" "}
              {stats.devices.distribution.android}%
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Android Users
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.devices.android.toLocaleString()}
            </p>
          </div>
        </div>

        {/* iOS Users */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <FaApple className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              <FaArrowUp className="w-3 h-3 mr-1" />{" "}
              {stats.devices.distribution.ios}%
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              iOS Users
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {stats.devices.ios.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Users Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              User Activity Trend
            </h3>
            <select className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg p-2 outline-none">
              <option>This Week</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.userActivity}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#F3F4F6" }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="active" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Device Distribution
          </h3>
          <div className="flex-1 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                <FaAndroid className="text-green-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Android
                </span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                {stats.devices.distribution.android}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                <FaApple className="text-gray-800 dark:text-gray-200" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  iOS
                </span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                {stats.devices.distribution.ios}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Country Distribution & Uploads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Country List */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Users by Country
            </h3>
            <FaGlobeAmericas className="text-gray-400" />
          </div>
          <div className="space-y-5">
            {stats.countries.map((item) => (
              <div key={item.country}>
                <div className="flex justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.flag}</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {item.country}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {item.users}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${item.users}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Wallpapers
            </h3>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Wallpaper
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {stats.wallpapers.recent.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 mr-3"></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {item.downloads.toLocaleString()}{" "}
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">
                          downloads
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
