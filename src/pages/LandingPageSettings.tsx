import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  getLandingPageConfig,
  updateLandingPageConfig,
} from "../services/landingPageService";
import { uploadService } from "../services/uploadService";
import { toast } from "react-hot-toast";
import {
  FaSave,
  FaPlus,
  FaTrash,
  FaUpload,
  FaLayerGroup,
  FaImage,
  FaStar,
  FaComment,
  FaLink,
  FaMobileAlt,
} from "react-icons/fa";

interface LandingPageConfig {
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    backgroundImage: string;
    phoneImages: string[];
    visible: boolean;
  };
  collections: {
    data: {
      id: number;
      title: string;
      image: string;
    }[];
    visible: boolean;
  };
  features: {
    data: {
      icon: string;
      text: string;
    }[];
    visible: boolean;
  };
  reviews: {
    data: {
      id: number;
      name: string;
      rating: number;
      text: string;
      image: string;
    }[];
    visible: boolean;
  };
  footer: {
    description: string;
    facebookLink: string;
    twitterLink: string;
    instagramLink: string;
    visible: boolean;
  };
}

const LandingPageSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  const { control, handleSubmit, reset, register, setValue } =
    useForm<LandingPageConfig>({
      defaultValues: {
        hero: { phoneImages: [], visible: true },
        collections: { data: [], visible: true },
        features: { data: [], visible: true },
        reviews: { data: [], visible: true },
        footer: { visible: true },
      },
    });

  const {
    fields: collectionFields,
    append: appendCollection,
    remove: removeCollection,
  } = useFieldArray({
    control,
    name: "collections.data",
  });

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control,
    name: "features.data",
  });

  const {
    fields: reviewFields,
    append: appendReview,
    remove: removeReview,
  } = useFieldArray({
    control,
    name: "reviews.data",
  });

  const {
    fields: phoneImageFields,
    append: appendPhoneImage,
    remove: removePhoneImage,
  } = useFieldArray({
    control,
    name: "hero.phoneImages" as any,
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await getLandingPageConfig();
      reset(data);
    } catch (error) {
      console.error("Failed to fetch config", error);
      toast.error("Failed to load landing page configuration");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: LandingPageConfig) => {
    setSaving(true);
    try {
      await updateLandingPageConfig(data);
      toast.success("Landing page configuration updated successfully");
    } catch (error) {
      console.error("Failed to update config", error);
      toast.error("Failed to update landing page configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File, fieldName: any) => {
    try {
      const response = await uploadService.upload(file);
      // Ensure we get the correct URL from response.data.url
      if (response && response.data && response.data.url) {
        setValue(fieldName, response.data.url);
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("Invalid upload response");
      }
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Image upload failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: "hero", label: "Hero Section", icon: FaLayerGroup },
    { id: "collections", label: "Collections", icon: FaImage },
    { id: "features", label: "Features", icon: FaStar },
    { id: "reviews", label: "Reviews", icon: FaComment },
    { id: "footer", label: "Footer", icon: FaLink },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Landing Page Settings
        </h1>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {saving ? (
            "Saving..."
          ) : (
            <>
              <FaSave className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } group inline-flex items-center py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap`}
                >
                  <Icon
                    className={`${
                      activeTab === tab.id
                        ? "text-indigo-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    } -ml-0.5 mr-2 h-5 w-5`}
                  />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "hero" && (
            <div className="space-y-6">
              <div className="flex items-center mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  id="hero-visible"
                  {...register("hero.visible")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="hero-visible"
                  className="ml-2 block text-sm font-medium text-gray-900"
                >
                  Show Hero Section
                </label>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <textarea
                    {...register("hero.title")}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subtitle
                  </label>
                  <textarea
                    {...register("hero.subtitle")}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Button Text
                  </label>
                  <input
                    type="text"
                    {...register("hero.buttonText")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Button Link
                  </label>
                  <input
                    type="text"
                    {...register("hero.buttonLink")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Images
                </label>
                <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {phoneImageFields.map((field, index) => (
                    <div key={field.id} className="relative group">
                      <div className="aspect-9/16 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <Controller
                          control={control}
                          name={`hero.phoneImages.${index}`}
                          render={({ field: { value } }) =>
                            value ? (
                              <img
                                src={value}
                                alt={`Phone ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400">
                                <FaMobileAlt className="h-8 w-8" />
                              </div>
                            )
                          }
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <label className="cursor-pointer p-2 bg-white rounded-full text-gray-700 hover:text-indigo-600 mr-2">
                            <FaUpload className="h-4 w-4" />
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file)
                                  handleImageUpload(
                                    file,
                                    `hero.phoneImages.${index}`,
                                  );
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => removePhoneImage(index)}
                            className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => appendPhoneImage("")} // Append empty string, not object
                    className="aspect-9/16 w-full border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FaPlus className="h-8 w-8" />
                    <span className="mt-2 text-sm font-medium">Add Image</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "collections" && (
            <div className="space-y-4">
              <div className="flex items-center mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  id="collections-visible"
                  {...register("collections.visible")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="collections-visible"
                  className="ml-2 block text-sm font-medium text-gray-900"
                >
                  Show Collections Section
                </label>
              </div>
              {collectionFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex-none w-32 aspect-square bg-gray-200 rounded-md overflow-hidden relative group">
                    <Controller
                      control={control}
                      name={`collections.data.${index}.image`}
                      render={({ field: { value } }) =>
                        value ? (
                          <img
                            src={value}
                            alt="Collection"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FaImage />
                          </div>
                        )
                      }
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                      <FaUpload className="h-6 w-6" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file)
                            handleImageUpload(
                              file,
                              `collections.data.${index}.image`,
                            );
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        {...register(`collections.data.${index}.title`)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Sort Order (ID)
                      </label>
                      <input
                        type="number"
                        {...register(`collections.data.${index}.id`, {
                          valueAsNumber: true,
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCollection(index)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  appendCollection({
                    id: collectionFields.length + 1,
                    title: "",
                    image: "",
                  })
                }
                className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaPlus className="mr-2 h-4 w-4" />
                Add Collection
              </button>
            </div>
          )}

          {activeTab === "features" && (
            <div className="space-y-4">
              <div className="flex items-center mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  id="features-visible"
                  {...register("features.visible")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="features-visible"
                  className="ml-2 block text-sm font-medium text-gray-900"
                >
                  Show Features Section
                </label>
              </div>
              {featureFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Feature Text
                    </label>
                    <input
                      type="text"
                      {...register(`features.data.${index}.text`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-gray-700">
                      Icon Name (React Icons)
                    </label>
                    <input
                      type="text"
                      {...register(`features.data.${index}.icon`)}
                      placeholder="e.g. FaStar, FaBolt"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="mt-6 p-2 text-gray-400 hover:text-red-600"
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendFeature({ text: "", icon: "" })}
                className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaPlus className="mr-2 h-4 w-4" />
                Add Feature
              </button>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="flex items-center mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  id="reviews-visible"
                  {...register("reviews.visible")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="reviews-visible"
                  className="ml-2 block text-sm font-medium text-gray-900"
                >
                  Show Reviews Section
                </label>
              </div>
              {reviewFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex-none w-16 h-16 bg-gray-200 rounded-full overflow-hidden relative group">
                    <Controller
                      control={control}
                      name={`reviews.data.${index}.image`}
                      render={({ field: { value } }) =>
                        value ? (
                          <img
                            src={value}
                            alt="Reviewer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FaImage className="w-6 h-6" />
                          </div>
                        )
                      }
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                      <FaUpload className="h-4 w-4" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file)
                            handleImageUpload(
                              file,
                              `reviews.data.${index}.image`,
                            );
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          {...register(`reviews.data.${index}.name`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Rating (1-5)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          {...register(`reviews.data.${index}.rating`, {
                            valueAsNumber: true,
                          })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Review Text
                      </label>
                      <textarea
                        {...register(`reviews.data.${index}.text`)}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeReview(index)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  appendReview({
                    id: reviewFields.length + 1,
                    name: "",
                    rating: 5,
                    text: "",
                    image: "",
                  })
                }
                className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaPlus className="mr-2 h-4 w-4" />
                Add Review
              </button>
            </div>
          )}

          {activeTab === "footer" && (
            <div className="space-y-6">
              <div className="flex items-center mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  id="footer-visible"
                  {...register("footer.visible")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="footer-visible"
                  className="ml-2 block text-sm font-medium text-gray-900"
                >
                  Show Footer Section
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Footer Description
                </label>
                <textarea
                  {...register("footer.description")}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Facebook Link
                  </label>
                  <input
                    type="text"
                    {...register("footer.facebookLink")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Twitter Link
                  </label>
                  <input
                    type="text"
                    {...register("footer.twitterLink")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Instagram Link
                  </label>
                  <input
                    type="text"
                    {...register("footer.instagramLink")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPageSettings;
