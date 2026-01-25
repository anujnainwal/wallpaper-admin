import React, { useState } from "react";
import { FaSave, FaUnsplash, FaImage, FaKey } from "react-icons/fa";
import { notifySuccess } from "../../utils/toastUtils";

const IntegrationSettings: React.FC = () => {
  const [unsplashConfig, setUnsplashConfig] = useState({
    accessKey: "",
    secretKey: "",
  });

  const [freepikConfig, setFreepikConfig] = useState({
    apiKey: "",
  });

  const handleUnsplashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUnsplashConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleFreepikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFreepikConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUnsplash = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving Unsplash Config:", unsplashConfig);
    notifySuccess("Unsplash configuration saved successfully");
  };

  const handleSaveFreepik = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving Freepik Config:", freepikConfig);
    notifySuccess("Freepik configuration saved successfully");
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Integration Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage API keys and configurations for third-party services.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Unsplash Integration */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
            <div className="p-2 bg-black text-white rounded-lg">
              <FaUnsplash size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Unsplash
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configure Unsplash API for wallpaper sourcing.
              </p>
            </div>
          </div>
          <form onSubmit={handleSaveUnsplash} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Access Key
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className="text-gray-400 text-xs" />
                  </div>
                  <input
                    type="password"
                    name="accessKey"
                    value={unsplashConfig.accessKey}
                    onChange={handleUnsplashChange}
                    placeholder="Enter Access Key"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-black/20 focus:border-black dark:focus:border-white transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Secret Key
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className="text-gray-400 text-xs" />
                  </div>
                  <input
                    type="password"
                    name="secretKey"
                    value={unsplashConfig.secretKey}
                    onChange={handleUnsplashChange}
                    placeholder="Enter Secret Key"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-black/20 focus:border-black dark:focus:border-white transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-all font-medium text-sm shadow-lg shadow-gray-200 dark:shadow-none"
              >
                <FaSave />
                Save Changes
              </button>
            </div>
          </form>
        </section>

        {/* Freepik Integration */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <FaImage size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Freepik
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configure Freepik API for premium assets.
              </p>
            </div>
          </div>
          <form onSubmit={handleSaveFreepik} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                API Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaKey className="text-gray-400 text-xs" />
                </div>
                <input
                  type="password"
                  name="apiKey"
                  value={freepikConfig.apiKey}
                  onChange={handleFreepikChange}
                  placeholder="Enter API Key"
                  className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium text-sm shadow-lg shadow-blue-200 dark:shadow-none"
              >
                <FaSave />
                Save Changes
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default IntegrationSettings;
