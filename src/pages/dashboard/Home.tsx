import React from "react";

const Home: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">1,234</p>
          <span className="text-green-500 text-sm mt-2 block">
            ↑ 12% from last month
          </span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">$45,678</p>
          <span className="text-green-500 text-sm mt-2 block">
            ↑ 8% from last month
          </span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Active Sessions</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">892</p>
          <span className="text-red-500 text-sm mt-2 block">
            ↓ 3% from last month
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-500">No recent activity to show.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
