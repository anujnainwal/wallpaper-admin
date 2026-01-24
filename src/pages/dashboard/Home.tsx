import React from "react";
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

const Home: React.FC = () => {
  // Mock Data for Charts
  const platformData = [
    { name: "Android", value: 15400 },
    { name: "iOS", value: 9132 },
  ];
  const PLATFORM_COLORS = ["#10B981", "#6366f1"]; // Android Green, iOS Indigo

  const userActivityData = [
    { name: "Mon", active: 12000 },
    { name: "Tue", active: 13500 },
    { name: "Wed", active: 11000 },
    { name: "Thu", active: 14200 },
    { name: "Fri", active: 15800 },
    { name: "Sat", active: 18900 },
    { name: "Sun", active: 19500 },
  ];

  const countryData = [
    { country: "India", users: 45, flag: "🇮🇳", color: "bg-orange-500" },
    { country: "USA", users: 25, flag: "🇺🇸", color: "bg-blue-600" },
    { country: "UK", users: 10, flag: "🇬🇧", color: "bg-red-600" },
    { country: "Brazil", users: 8, flag: "🇧🇷", color: "bg-green-500" },
    { country: "Others", users: 12, flag: "🌍", color: "bg-gray-400" },
  ];

  return (
    <div className="space-y-8">
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
              <FaArrowUp className="w-3 h-3 mr-1" /> 12%
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Total Users
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              24,532
            </p>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
              <FaMobileAlt className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              <FaArrowUp className="w-3 h-3 mr-1" /> 8%
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Active Users
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              12,404
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
              <FaArrowUp className="w-3 h-3 mr-1" /> 5%
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Android Users
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              15,400
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
              <FaArrowUp className="w-3 h-3 mr-1" /> 18%
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              iOS Users
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              9,132
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
              <BarChart data={userActivityData}>
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
                63%
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
                37%
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
            {countryData.map((item) => (
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

        {/* Recent Uploads (Keeping existing table structure but compacted) */}
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
                {[
                  {
                    title: "Neon Nights",
                    category: "Abstract",
                    downloads: 1240,
                    status: "Active",
                  },
                  {
                    title: "Mountain Peak",
                    category: "Nature",
                    downloads: 890,
                    status: "Pending",
                  },
                  {
                    title: "Ocean Waves",
                    category: "Nature",
                    downloads: 2300,
                    status: "Active",
                  },
                ].map((item, index) => (
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
