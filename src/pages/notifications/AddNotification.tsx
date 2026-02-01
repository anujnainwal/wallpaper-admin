import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FaAndroid,
  FaApple,
  FaGlobe,
  FaMobileAlt,
  FaTrash,
  FaPlus,
  FaPaperPlane,
  FaUser,
} from "react-icons/fa";
import { userService, type User } from "../../services/userService";
import { createNotification } from "../../services/notificationService";
import { uploadService } from "../../services/uploadService";
import MultiSelect from "../../components/common/MultiSelect";
import { notifyError, notifySuccess } from "../../utils/toastUtils";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";

// Validation Schema
const notificationSchema = z.object({
  title: z.string().min(1, "Title is required").max(50, "Title too long"),
  body: z.string().min(1, "Body is required").max(150, "Body too long"),
  imageUrl: z.string().optional().or(z.literal("")),
  target: z.enum(["all", "android", "ios", "custom"]),
  customUsers: z.array(z.string()).optional(),
  metadata: z
    .array(
      z.object({
        key: z.string().min(1, "Key required"),
        value: z.string().min(1, "Value required"),
      }),
    )
    .optional(),
});

type NotificationInputs = z.infer<typeof notificationSchema>;

const AddNotification: React.FC = () => {
  const navigate = useNavigate();
  const [previewMode, setPreviewMode] = useState<"mobile" | "web">("mobile");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NotificationInputs>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      target: "all",
      metadata: [{ key: "", value: "" }],
      customUsers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "metadata",
  });

  // Watch values for live preview
  const watchedValues = watch();
  const target = watch("target");
  const customUsers = watch("customUsers");

  useEffect(() => {
    if (target === "custom") {
      fetchUsers();
    }
  }, [target]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await userService.getAll();
      // Assuming response.data is the array of users, or adjust based on actual API
      const userList = Array.isArray(response) ? response : response.data || [];
      setUsers(userList);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      notifyError("Failed to load users for custom selection");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadService.upload(file);
      setValue("imageUrl", response.data.url);
      notifySuccess("Image uploaded successfully");
    } catch (error) {
      console.error("Upload failed", error);
      notifyError("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: NotificationInputs) => {
    try {
      // transform form data to API payload
      const payload: Partial<
        import("../../services/notificationService").Notification
      > = {
        title: data.title,
        body: data.body,
        status: "queued", // Initial status
        target: {
          type: (data.target === "custom"
            ? "users"
            : data.target === "all"
              ? "all"
              : "topic") as "all" | "topic" | "tokens" | "users",
          value:
            data.target === "custom"
              ? data.customUsers
              : data.target === "android"
                ? "android"
                : data.target === "ios"
                  ? "ios"
                  : undefined,
        },
        image: data.imageUrl,
        data: data.metadata?.reduce(
          (acc, curr) => ({ ...acc, [curr.key]: curr.value }),
          {},
        ),
      };

      await createNotification(payload);
      notifySuccess("Notification scheduled successfully!");

      // Delay navigation to show toast
      setTimeout(() => {
        navigate("/notifications/list");
      }, 1500);
    } catch (error) {
      console.error("Failed to send notification:", error);
      notifyError("Failed to schedule notification");
    }
  };

  const userOptions = users.map((user) => ({
    id: user._id || user.email, // Use _id but fallback to email if missing
    name: `${user.firstName} ${user.lastName}`,
    subText: user.email,
  }));

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Left Column - Form */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <FaPaperPlane className="mr-3 text-indigo-600 dark:text-indigo-400" />
            Compose Notification
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title & Body */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notification Title
              </label>
              <input
                {...register("title")}
                placeholder="e.g., New Wallpaper Collection!"
                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-900 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message Body
              </label>
              <textarea
                {...register("body")}
                rows={3}
                placeholder="e.g., Check out the abstract details..."
                className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none text-gray-900 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              {errors.body && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.body.message}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Large Image (Optional)
              </label>
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <div className="relative border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 p-1 flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-600 rounded-lg shadow-sm border border-gray-100 dark:border-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors text-xs font-medium text-gray-700 dark:text-gray-200 ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <FaCloudUploadAlt className="text-indigo-500" />
                      {isUploading ? "Uploading..." : "Upload Image"}
                    </label>
                    <input
                      {...register("imageUrl")}
                      placeholder="or paste URL..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3 text-gray-900 dark:text-white placeholder:text-gray-400"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 pl-1">
                    Upload a file or paste a direct image link.
                  </p>
                </div>
              </div>

              {errors.imageUrl && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Target Audience
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    value: "all",
                    label: "All Users",
                    icon: <FaGlobe />,
                    desc: "Send to everyone",
                  },
                  {
                    value: "android",
                    label: "Android",
                    icon: <FaAndroid />,
                    desc: "Android devices only",
                  },
                  {
                    value: "ios",
                    label: "iOS",
                    icon: <FaApple />,
                    desc: "iOS devices only",
                  },
                  {
                    value: "custom",
                    label: "Custom",
                    icon: <FaUser />,
                    desc: "Select specific users",
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex flex-col items-start p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                      target === option.value
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      {...register("target" as any)}
                      className="hidden"
                    />
                    <div
                      className={`p-2 rounded-lg mb-3 ${
                        target === option.value
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <div className="text-lg">{option.icon}</div>
                    </div>
                    <span
                      className={`font-bold text-sm mb-1 ${
                        target === option.value
                          ? "text-indigo-900 dark:text-indigo-300"
                          : "text-gray-900 dark:text-gray-200"
                      }`}
                    >
                      {option.label}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {option.desc}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom User Selection */}
            {target === "custom" && (
              <div className="animate-fade-in-down bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700 space-y-3">
                <MultiSelect
                  label="Select Users"
                  options={userOptions}
                  value={customUsers || []}
                  onChange={(val) => setValue("customUsers", val)}
                  isLoading={isLoadingUsers}
                  placeholder="Search and select users..."
                />
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 px-1">
                  <span>Selected: {customUsers?.length || 0} users</span>
                  {isLoadingUsers && <span>Fetching users...</span>}
                </div>
                {errors.customUsers && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.customUsers.message}
                  </p>
                )}
              </div>
            )}

            {/* Metadata Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Metadata / Payload
                </label>
                <button
                  type="button"
                  onClick={() => append({ key: "", value: "" })}
                  className="text-xs flex items-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-3 py-1.5 rounded-lg font-medium transition-colors"
                >
                  <FaPlus className="mr-1.5" size={10} /> Add Field
                </button>
              </div>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3">
                    <div className="flex-1">
                      <input
                        {...register(`metadata.${index}.key` as const)}
                        placeholder="Key (e.g., link)"
                        className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        {...register(`metadata.${index}.value` as const)}
                        placeholder="Value (e.g., /home)"
                        className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-900 dark:text-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
                {fields.length === 0 && (
                  <div className="text-center py-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                    No metadata fields added
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 dark:bg-indigo-500 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center transform active:scale-[0.99]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FaPaperPlane size={14} /> Send Notification
                </span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Column - Preview */}
      <div className="w-full lg:w-[400px] flex flex-col shrink-0">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex-1 flex flex-col sticky top-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">
              Live Preview
            </h3>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`p-2 rounded-md text-xs font-medium transition-all ${
                  previewMode === "mobile"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <FaMobileAlt size={14} />
              </button>
              <button
                onClick={() => setPreviewMode("web")}
                className={`p-2 rounded-md text-xs font-medium transition-all ${
                  previewMode === "web"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <FaGlobe size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-4 overflow-hidden relative min-h-[500px]">
            {/* Mobile Preview */}
            {previewMode === "mobile" && (
              <div className="w-[280px] h-[500px] bg-gray-900 rounded-[35px] shadow-2xl p-3 relative border-4 border-gray-800 ring-1 ring-gray-900/10">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-800 rounded-b-xl z-20"></div>

                {/* Screen Content */}
                <div className="w-full h-full bg-wallpaper-bg bg-cover bg-center rounded-[25px] overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>

                  {/* Mock Status Bar */}
                  <div className="h-6 bg-transparent w-full flex justify-between items-center px-4 text-[10px] font-bold text-white pt-1 relative z-10">
                    <span>9:41</span>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
                      <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
                    </div>
                  </div>

                  {/* Notification Card (Lock Screen style) */}
                  <div className="mt-8 mx-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-3 shadow-lg animate-fade-in-up border border-white/20 relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-indigo-600 rounded-md flex items-center justify-center shadow-sm">
                          <FaPaperPlane className="text-white text-[10px]" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                          Wallpaper
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        now
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight mb-1">
                        {watchedValues.title || "Notification Title"}
                      </h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">
                        {watchedValues.body ||
                          "Notification body text will appear here..."}
                      </p>
                    </div>
                    {watchedValues.imageUrl && (
                      <div className="mt-3 rounded-xl overflow-hidden h-28 w-full shadow-inner">
                        <img
                          src={watchedValues.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Web Preview */}
            {previewMode === "web" && (
              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-xl border-l-4 border-indigo-500 p-4 transform transition-all hover:scale-105 pointer-events-none">
                  <div className="flex items-start space-x-3">
                    <div className="pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <FaPaperPlane />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {watchedValues.title || "Notification Title"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {watchedValues.body || "Notification body text..."}
                      </p>
                      {watchedValues.imageUrl && (
                        <img
                          src={watchedValues.imageUrl}
                          className="mt-2 rounded-md w-full h-32 object-cover"
                          alt="Web Preview"
                        />
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Close</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                  Browser Push Notification Style
                </p>
              </div>
            )}
          </div>

          {/* Payload Debug */}
          <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-xl p-3 text-[10px] font-mono text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="font-bold mb-1 text-gray-400 dark:text-gray-500 uppercase tracking-wider flex justify-between">
              <span>Payload Preview</span>
              <span className="text-[9px]">JSON</span>
            </div>
            <pre className="whitespace-pre-wrap break-all max-h-32 overflow-y-auto custom-scrollbar">
              {JSON.stringify(
                {
                  to: target === "custom" ? customUsers : target,
                  notification: {
                    title: watchedValues.title,
                    body: watchedValues.body,
                    image: watchedValues.imageUrl,
                  },
                  data: watchedValues.metadata?.reduce(
                    (acc, curr) => ({ ...acc, [curr.key]: curr.value }),
                    {},
                  ),
                },
                null,
                2,
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNotification;
