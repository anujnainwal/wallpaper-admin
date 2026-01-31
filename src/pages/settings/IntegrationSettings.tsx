import React, { useState, useEffect } from "react";
import {
  FaSave,
  FaUnsplash,
  FaImage,
  FaCloud,
  FaSearch,
  FaArrowLeft,
  FaKey,
  FaToggleOn,
  FaToggleOff,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { integrationService } from "../../services/integrationService";

type IntegrationType = "content" | "storage";

interface IntegrationMeta {
  id: string;
  name: string;
  type: IntegrationType;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const INTEGRATIONS: IntegrationMeta[] = [
  {
    id: "unsplash",
    name: "Unsplash",
    type: "content",
    description: "Source high-quality wallpapers from Unsplash API.",
    icon: <FaUnsplash size={24} />,
    color: "bg-black",
  },
  {
    id: "freepik",
    name: "Freepik",
    type: "content",
    description: "Access premium assets and vectors from Freepik.",
    icon: <FaImage size={24} />,
    color: "bg-blue-600",
  },
  {
    id: "cloudflare-r2",
    name: "Cloudflare R2",
    type: "storage",
    description: "Store and serve assets using Cloudflare R2 Storage.",
    icon: <FaCloud size={24} />,
    color: "bg-orange-500",
  },
];

const IntegrationSettings: React.FC = () => {
  const [view, setView] = useState<"grid" | "form">("grid");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
    {},
  );

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Configuration States
  const [unsplashConfig, setUnsplashConfig] = useState({
    accessKey: "",
    secretKey: "",
    isActive: false,
  });

  const [freepikConfig, setFreepikConfig] = useState({
    apiKey: "",
    isActive: false,
  });

  const [r2Config, setR2Config] = useState({
    accountId: "",
    accessKeyId: "",
    secretAccessKey: "",
    bucketName: "",
    publicUrl: "",
    isActive: false,
  });

  // Fetch Integrations
  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const response = await integrationService.getAll();
      const integrations = response.data || [];

      integrations.forEach((integration: any) => {
        if (integration.key === "unsplash") {
          setUnsplashConfig({
            ...integration.config,
            isActive: integration.isActive,
          });
        } else if (integration.key === "freepik") {
          setFreepikConfig({
            ...integration.config,
            isActive: integration.isActive,
          });
        } else if (integration.key === "cloudflare-r2") {
          setR2Config({
            ...integration.config,
            isActive: integration.isActive,
          });
        }
      });
    } catch (error) {
      console.error("Failed to fetch integrations", error);
      toast.error("Failed to load settings");
    }
  };

  // Helpers
  const selectedIntegration = INTEGRATIONS.find((i) => i.id === selectedId);

  const getIsActive = (id: string) => {
    switch (id) {
      case "unsplash":
        return unsplashConfig.isActive;
      case "freepik":
        return freepikConfig.isActive;
      case "cloudflare-r2":
        return r2Config.isActive;
      default:
        return false;
    }
  };

  const handleBack = () => {
    setView("grid");
    setSelectedId(null);
  };

  const handleSave = async (e: React.FormEvent, name: string, key: string) => {
    e.preventDefault();
    setLoading(true);

    let payload: any = { key, name };

    if (key === "unsplash") {
      payload = {
        ...payload,
        type: "content",
        config: {
          accessKey: unsplashConfig.accessKey,
          secretKey: unsplashConfig.secretKey,
        },
        isActive: unsplashConfig.isActive,
      };
    } else if (key === "freepik") {
      payload = {
        ...payload,
        type: "content",
        config: { apiKey: freepikConfig.apiKey },
        isActive: freepikConfig.isActive,
      };
    } else if (key === "cloudflare-r2") {
      payload = {
        ...payload,
        type: "storage",
        config: {
          accountId: r2Config.accountId,
          accessKeyId: r2Config.accessKeyId,
          secretAccessKey: r2Config.secretAccessKey,
          bucketName: r2Config.bucketName,
          publicUrl: r2Config.publicUrl,
        },
        isActive: r2Config.isActive,
      };
    }

    try {
      await integrationService.save(payload);
      toast.success(`${name} configuration saved successfully`);
      setView("grid");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = (setter: React.Dispatch<React.SetStateAction<any>>) => {
    setter((prev: any) => ({ ...prev, isActive: !prev.isActive }));
  };

  // Render Forms
  const renderUnsplashForm = () => (
    <form
      onSubmit={(e) => handleSave(e, "Unsplash", "unsplash")}
      className="space-y-6 animate-fade-in-up"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Access Key
          </label>
          <div className="relative">
            <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type={showPasswords["unsplashAccess"] ? "text" : "password"}
              value={unsplashConfig.accessKey}
              onChange={(e) =>
                setUnsplashConfig({
                  ...unsplashConfig,
                  accessKey: e.target.value,
                })
              }
              placeholder="Enter Access Key"
              className="w-full pl-9 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black dark:text-white"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("unsplashAccess")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              {showPasswords["unsplashAccess"] ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Secret Key
          </label>
          <div className="relative">
            <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type={showPasswords["unsplashSecret"] ? "text" : "password"}
              value={unsplashConfig.secretKey}
              onChange={(e) =>
                setUnsplashConfig({
                  ...unsplashConfig,
                  secretKey: e.target.value,
                })
              }
              placeholder="Enter Secret Key"
              className="w-full pl-9 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black dark:text-white"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("unsplashSecret")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              {showPasswords["unsplashSecret"] ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      </div>
    </form>
  );

  const renderFreepikForm = () => (
    <form
      onSubmit={(e) => handleSave(e, "Freepik", "freepik")}
      className="space-y-6 animate-fade-in-up"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          API Key
        </label>
        <div className="relative">
          <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type={showPasswords["freepikApi"] ? "text" : "password"}
            value={freepikConfig.apiKey}
            onChange={(e) =>
              setFreepikConfig({ ...freepikConfig, apiKey: e.target.value })
            }
            placeholder="Enter API Key"
            className="w-full pl-9 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("freepikApi")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            {showPasswords["freepikApi"] ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>
    </form>
  );

  const renderR2Form = () => (
    <form
      onSubmit={(e) => handleSave(e, "Cloudflare R2", "cloudflare-r2")}
      className="space-y-6 animate-fade-in-up"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Account ID
          </label>
          <input
            type="text"
            value={r2Config.accountId}
            onChange={(e) =>
              setR2Config({ ...r2Config, accountId: e.target.value })
            }
            placeholder="Cloudflare Account ID"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Bucket Name
          </label>
          <input
            type="text"
            value={r2Config.bucketName}
            onChange={(e) =>
              setR2Config({ ...r2Config, bucketName: e.target.value })
            }
            placeholder="R2 Bucket Name"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Access Key ID
          </label>
          <div className="relative">
            <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type={showPasswords["r2Access"] ? "text" : "password"}
              value={r2Config.accessKeyId}
              onChange={(e) =>
                setR2Config({ ...r2Config, accessKeyId: e.target.value })
              }
              placeholder="R2 Access Key"
              className="w-full pl-9 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("r2Access")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              {showPasswords["r2Access"] ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Secret Access Key
          </label>
          <div className="relative">
            <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type={showPasswords["r2Secret"] ? "text" : "password"}
              value={r2Config.secretAccessKey}
              onChange={(e) =>
                setR2Config({ ...r2Config, secretAccessKey: e.target.value })
              }
              placeholder="R2 Secret Key"
              className="w-full pl-9 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("r2Secret")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              {showPasswords["r2Secret"] ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Public URL / Custom Domain
          </label>
          <input
            type="text"
            value={r2Config.publicUrl}
            onChange={(e) =>
              setR2Config({ ...r2Config, publicUrl: e.target.value })
            }
            placeholder="https://assets.example.com"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white"
          />
        </div>
      </div>
    </form>
  );

  const renderActiveToggle = () => {
    if (!selectedId) return null;
    let isActive = false;
    let toggleFn: any = () => {};

    if (selectedId === "unsplash") {
      isActive = unsplashConfig.isActive;
      toggleFn = () => toggleActive(setUnsplashConfig);
    } else if (selectedId === "freepik") {
      isActive = freepikConfig.isActive;
      toggleFn = () => toggleActive(setFreepikConfig);
    } else if (selectedId === "cloudflare-r2") {
      isActive = r2Config.isActive;
      toggleFn = () => toggleActive(setR2Config);
    }

    return (
      <button
        onClick={toggleFn}
        type="button"
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
          isActive
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
        }`}
      >
        <span className="text-sm font-bold">
          {isActive ? "Active" : "Inactive"}
        </span>
        {isActive ? <FaToggleOn size={22} /> : <FaToggleOff size={22} />}
      </button>
    );
  };

  const filteredIntegrations = INTEGRATIONS.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {view === "grid" ? (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Integration Settings
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Manage third-party services and storage providers
              </p>
            </div>
            <div className="relative w-full md:w-72">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => {
              const isActive = getIsActive(integration.id);
              return (
                <div
                  key={integration.id}
                  onClick={() => {
                    setSelectedId(integration.id);
                    setView("form");
                  }}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-indigo-100 dark:hover:border-indigo-900 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`p-3 rounded-xl text-white ${integration.color} shadow-lg shadow-gray-200 dark:shadow-none bg-opacity-90 group-hover:bg-opacity-100 transition-all`}
                    >
                      {integration.icon}
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                        isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {isActive ? (
                        <>
                          <FaCheckCircle size={10} /> Active
                        </>
                      ) : (
                        "Inactive"
                      )}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                    {integration.description}
                  </p>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700/50 rounded-md text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {integration.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredIntegrations.length === 0 && (
            <div className="text-center py-20 flex flex-col items-center justify-center text-gray-400">
              <FaSearch size={48} className="mb-4 opacity-20" />
              <p>No integrations found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      ) : (
        <div className="animate-fade-in-right">
          {/* Form Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-500"
              >
                <FaArrowLeft />
              </button>
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg text-white ${selectedIntegration?.color}`}
                >
                  {selectedIntegration?.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedIntegration?.name}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    Configuration
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                    <span className="uppercase tracking-wider font-semibold text-indigo-500">
                      {selectedIntegration?.type}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {renderActiveToggle()}
              <button
                onClick={(e) =>
                  selectedId &&
                  handleSave(
                    e as any,
                    selectedIntegration!.name,
                    selectedIntegration!.id,
                  )
                }
                disabled={loading}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaSave />
                )}
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            {selectedId === "unsplash" && renderUnsplashForm()}
            {selectedId === "freepik" && renderFreepikForm()}
            {selectedId === "cloudflare-r2" && renderR2Form()}
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationSettings;
