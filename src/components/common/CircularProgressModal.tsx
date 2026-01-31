import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface CircularProgressModalProps {
  isOpen: boolean;
  progress: number;
  total: number;
  completed: number;
  title?: string;
  isComplete?: boolean;
  onClose?: () => void;
}

const CircularProgressModal: React.FC<CircularProgressModalProps> = ({
  isOpen,
  progress,
  total,
  completed,
  title = "Processing...",
  isComplete = false,
  onClose,
}) => {
  if (!isOpen) return null;

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {isComplete ? "Completed!" : title}
        </h3>

        <div className="relative w-32 h-32 flex items-center justify-center mb-6">
          {/* Background Circle */}
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress Circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`text-indigo-600 transition-all duration-300 ease-out ${isComplete ? "text-green-500" : ""}`}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            {isComplete ? (
              <FaCheckCircle className="text-4xl text-green-500 mb-1" />
            ) : (
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {Math.round(progress)}%
              </span>
            )}
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {isComplete
              ? `Successfully processed ${total} items.`
              : `Processing ${completed} of ${total} items...`}
          </p>
        </div>

        {isComplete && onClose && (
          <button
            onClick={onClose}
            className="mt-6 w-full py-2.5 px-4 bg-gray-900 dark:bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default CircularProgressModal;
