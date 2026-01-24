import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaArrowLeft, FaShieldAlt } from "react-icons/fa";

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6 transition-colors duration-300">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in-up">
        {/* Icon & Status */}
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-3xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto rotate-12 transform hover:rotate-0 transition-transform duration-300">
            <FaLock className="text-4xl text-red-500 dark:text-red-400" />
          </div>
          <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm">
            <FaShieldAlt className="text-indigo-500" size={16} />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            Access Denied
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            You do not have the necessary permissions to view this resource.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-red-100 dark:border-red-900/30 flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <span className="font-bold text-red-600 dark:text-red-400">
              403
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Error 403: Forbidden
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Please contact your administrator if you believe this is a
              mistake.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm font-medium group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-6 py-3 flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-xl transition-all shadow-lg font-medium"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
