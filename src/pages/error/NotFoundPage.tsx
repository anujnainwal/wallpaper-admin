import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft, FaGhost } from "react-icons/fa";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/30 dark:bg-indigo-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute top-[20%] right-[30%] w-[20%] h-[20%] bg-pink-400/20 dark:bg-pink-600/10 rounded-full blur-[80px] animate-bounce"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6 text-center">
        <div className="mb-4 inline-flex items-center justify-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-lg ring-1 ring-gray-100 dark:ring-gray-700 animate-bounce">
          <FaGhost className="text-4xl text-indigo-600 dark:text-indigo-400" />
        </div>

        <h1 className="text-[120px] sm:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 animate-fade-in-up drop-shadow-2xl">
          404
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-lg mx-auto leading-relaxed mt-12 animate-fade-in-up delay-200">
          Oops! It seems like you've ventured into the unknown using a broken
          link. This page doesn't exist in our universe.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-8 py-3.5 flex items-center justify-center gap-2.5 font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            <FaArrowLeft className="text-sm" />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-8 py-3.5 flex items-center justify-center gap-2.5 font-bold text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300"
          >
            <FaHome className="text-lg" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
