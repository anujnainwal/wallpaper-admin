import React, { useState } from "react";
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

// Validation Schema
const notificationSchema = z.object({
  title: z.string().min(1, "Title is required").max(50, "Title too long"),
  body: z.string().min(1, "Body is required").max(150, "Body too long"),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  target: z.enum(["all", "android", "ios", "custom"]),
  customEmail: z.string().email("Invalid email").optional().or(z.literal("")),
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
  const [previewMode, setPreviewMode] = useState<"mobile" | "web">("mobile");

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NotificationInputs>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      target: "all",
      metadata: [{ key: "", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "metadata",
  });

  // Watch values for live preview
  const watchedValues = watch();
  const target = watch("target");

  const onSubmit = async (data: NotificationInputs) => {
    console.log("Sending Notification:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Notification Scheduled!");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Left Column - Form */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FaPaperPlane className="mr-3 text-indigo-600" />
            Compose Notification
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title & Body */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notification Title
              </label>
              <input
                {...register("title")}
                placeholder="e.g., New Wallpaper Collection!"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message Body
              </label>
              <textarea
                {...register("body")}
                rows={3}
                placeholder="e.g., Check out the abstract details..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
              {errors.body && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.body.message}
                </p>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Large Image URL (Optional)
              </label>
              <input
                {...register("imageUrl")}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              {errors.imageUrl && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { value: "all", label: "All Users", icon: <FaGlobe /> },
                  { value: "android", label: "Android", icon: <FaAndroid /> },
                  { value: "ios", label: "iOS", icon: <FaApple /> },
                  { value: "custom", label: "Custom", icon: <FaUser /> },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      target === option.value
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      {...register("target" as any)}
                      className="hidden"
                    />
                    <div className="text-xl mb-1">{option.icon}</div>
                    <span className="text-xs font-semibold">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Email Input */}
            {target === "custom" && (
              <div className="animate-fade-in-down">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Email
                </label>
                <input
                  {...register("customEmail")}
                  placeholder="user@example.com"
                  className="w-full bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Found 1 matching user (Mock)
                </p>
                {errors.customEmail && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.customEmail.message}
                  </p>
                )}
              </div>
            )}

            {/* Metadata Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Metadata / Payload
                </label>
                <button
                  type="button"
                  onClick={() => append({ key: "", value: "" })}
                  className="text-xs flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <FaPlus className="mr-1" /> Add Field
                </button>
              </div>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex space-x-2">
                    <input
                      {...register(`metadata.${index}.key` as const)}
                      placeholder="Key (e.g., link)"
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <input
                      {...register(`metadata.${index}.value` as const)}
                      placeholder="Value (e.g., /home)"
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 disabled:opacity-70 flex justify-center items-center"
            >
              {isSubmitting ? "Generating..." : "Send Notification"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Column - Preview */}
      <div className="w-full lg:w-[400px] flex flex-col">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Live Preview</h3>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`p-2 rounded-md text-xs font-medium transition-all ${
                  previewMode === "mobile"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                <FaMobileAlt size={14} />
              </button>
              <button
                onClick={() => setPreviewMode("web")}
                className={`p-2 rounded-md text-xs font-medium transition-all ${
                  previewMode === "web"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                <FaGlobe size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-4 overflow-hidden relative">
            {/* Mobile Preview */}
            {previewMode === "mobile" && (
              <div className="w-[280px] h-[500px] bg-gray-900 rounded-[35px] shadow-2xl p-3 relative border-4 border-gray-800">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-800 rounded-b-xl z-20"></div>

                {/* Screen Content */}
                <div className="w-full h-full bg-gray-100 rounded-[25px] overflow-hidden relative">
                  {/* Mock Status Bar */}
                  <div className="h-6 bg-transparent w-full flex justify-between items-center px-4 text-[10px] font-bold text-black pt-1">
                    <span>9:41</span>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-black rounded-full opacity-20"></div>
                      <div className="w-3 h-3 bg-black rounded-full opacity-20"></div>
                    </div>
                  </div>

                  {/* Notification Card (Lock Screen style) */}
                  <div className="mt-8 mx-3 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg animate-fade-in-up">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-5 h-5 bg-indigo-600 rounded-md flex items-center justify-center">
                          <FaPaperPlane className="text-white text-[10px]" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
                          Wallpaper
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">now</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 leading-tight mb-1">
                        {watchedValues.title || "Notification Title"}
                      </h4>
                      <p className="text-xs text-gray-700 leading-snug">
                        {watchedValues.body ||
                          "Notification body text will appear here..."}
                      </p>
                    </div>
                    {watchedValues.imageUrl && (
                      <div className="mt-3 rounded-lg overflow-hidden h-24 w-full">
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
                <div className="w-full max-w-sm bg-white rounded-lg shadow-xl border-l-4 border-indigo-500 p-4 transform transition-all hover:scale-105">
                  <div className="flex items-start space-x-3">
                    <div className="pt-0.5">
                      <img
                        src="/wallpaper-logo.png"
                        className="h-10 w-10 rounded-full"
                        alt="Icon"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {watchedValues.title || "Notification Title"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
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
                <p className="mt-4 text-xs text-gray-400">
                  Browser Push Notification Style
                </p>
              </div>
            )}
          </div>

          {/* Payload Debug */}
          <div className="mt-4 bg-gray-50 rounded-xl p-3 text-[10px] font-mono text-gray-600 border border-gray-200 overflow-hidden">
            <div className="font-bold mb-1 text-gray-400 uppercase tracking-wider">
              Payload Preview
            </div>
            <pre className="whitespace-pre-wrap break-all">
              {JSON.stringify(
                {
                  to: target === "custom" ? watchedValues.customEmail : target,
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
