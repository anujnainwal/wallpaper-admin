import React, { useState } from "react";
import {
  FaSave,
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaLink,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

type DocumentType = "terms" | "privacy" | "disclaimer" | "eula";

interface DocumentData {
  title: string;
  slug: string;
  version: string;
  content: string;
  effectiveDate: string;
  status: "published" | "draft";
}

const initialData: Record<DocumentType, DocumentData> = {
  terms: {
    title: "Terms and Conditions",
    slug: "terms-and-conditions",
    version: "1.0",
    content: "Welcome to our application...",
    effectiveDate: "2024-01-01",
    status: "published",
  },
  privacy: {
    title: "Privacy Policy",
    slug: "privacy-policy",
    version: "1.0",
    content: "Your privacy is important to us...",
    effectiveDate: "2024-01-01",
    status: "published",
  },
  disclaimer: {
    title: "Disclaimer",
    slug: "disclaimer",
    version: "0.9",
    content: "The information provided...",
    effectiveDate: "2024-01-01",
    status: "draft",
  },
  eula: {
    title: "End User License Agreement",
    slug: "eula",
    version: "0.1",
    content: "By installing this application...",
    effectiveDate: "2024-01-01",
    status: "draft",
  },
};

const LegalDocuments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DocumentType>("terms");
  const [documents, setDocuments] =
    useState<Record<DocumentType, DocumentData>>(initialData);

  // We need a ref to the contentEditable element to update its content when switching tabs
  // and to avoid cursor jumping issues if we were fully controlled (though here we use a hybrid approach)
  const editorRef = React.useRef<HTMLDivElement>(null);

  // Update editor content when active tab changes
  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = documents[activeTab].content;
    }
  }, [activeTab]); // Intentionally not including documents to avoid re-render loops on content edit

  const handleUpdate = (field: keyof DocumentData, value: string) => {
    setDocuments((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value,
      },
    }));
  };

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    handleUpdate("content", e.currentTarget.innerHTML);
  };

  const execCommand = (
    command: string,
    value: string | undefined = undefined,
  ) => {
    document.execCommand(command, false, value);
    // Keep focus on editor
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handlePreview = () => {
    try {
      // Create a temporary blob to exhibit the HTML content properly
      const blob = new Blob(
        [
          `
        <html>
          <head>
            <title>${documents[activeTab].title} - Preview</title>
            <style>
              body { font-family: sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; line-height: 1.6; }
              h1 { border-bottom: 2px solid #eee; padding-bottom: 0.5rem; }
              h2, h3 { margin-top: 1.5rem; }
              ul, ol { padding-left: 1.5rem; }
            </style>
          </head>
          <body>
            <div style="margin-bottom: 2rem; color: #666; font-size: 0.9em; border-bottom: 1px solid #eee; padding-bottom: 1rem;">
              <strong>Slug:</strong> /${documents[activeTab].slug} <br/>
              <strong>Version:</strong> ${documents[activeTab].version} <br/>
              <strong>Date:</strong> ${documents[activeTab].effectiveDate}
            </div>
            ${documents[activeTab].content}
          </body>
        </html>
        `,
        ],
        { type: "text/html" },
      );
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (e) {
      // Fallback
      alert("Could not create preview window.");
    }
  };

  const currentDoc = documents[activeTab];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Legal Documents</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your application's legal content
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePreview}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaEye />
            <span>Preview</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
            <FaSave />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(["terms", "privacy", "disclaimer", "eula"] as DocumentType[]).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              }`}
            >
              {tab === "terms"
                ? "Terms"
                : tab === "privacy"
                  ? "Privacy"
                  : tab === "disclaimer"
                    ? "Disclaimer"
                    : "EULA"}
            </button>
          ),
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={currentDoc.title}
                  onChange={(e) => handleUpdate("title", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug
                </label>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                  <span className="bg-gray-50 px-3 py-2 text-sm text-gray-500 border-r border-gray-200">
                    /
                  </span>
                  <input
                    type="text"
                    value={currentDoc.slug}
                    onChange={(e) => handleUpdate("slug", e.target.value)}
                    className="flex-1 px-3 py-2 focus:outline-none"
                    placeholder="e.g. terms-of-service"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Version
                </label>
                <input
                  type="text"
                  value={currentDoc.version}
                  onChange={(e) => handleUpdate("version", e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="e.g. 1.0"
                />
              </div>
            </div>

            <div className="flex flex-col h-[600px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all flex flex-col">
                {/* Real Toolbar */}
                <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center gap-1 flex-wrap">
                  {/* Headings */}
                  <div className="flex items-center bg-white rounded-lg border border-gray-200 p-0.5">
                    <button
                      onClick={() => execCommand("formatBlock", "H1")}
                      className="px-2 py-1 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded text-sm font-bold"
                      title="Heading 1"
                    >
                      H1
                    </button>
                    <button
                      onClick={() => execCommand("formatBlock", "H2")}
                      className="px-2 py-1 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded text-sm font-bold"
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      onClick={() => execCommand("formatBlock", "H3")}
                      className="px-2 py-1 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded text-sm font-bold"
                      title="Heading 3"
                    >
                      H3
                    </button>
                  </div>

                  <div className="w-px h-6 bg-gray-300 mx-1"></div>

                  {/* Formatting */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => execCommand("bold")}
                      className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-gray-200 rounded transition-colors"
                      title="Bold"
                    >
                      <FaBold size={14} />
                    </button>
                    <button
                      onClick={() => execCommand("italic")}
                      className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-gray-200 rounded transition-colors"
                      title="Italic"
                    >
                      <FaItalic size={14} />
                    </button>
                    <button
                      onClick={() => execCommand("underline")}
                      className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-gray-200 rounded transition-colors font-serif font-bold text-sm underline"
                      title="Underline"
                    >
                      U
                    </button>
                  </div>

                  <div className="w-px h-6 bg-gray-300 mx-1"></div>

                  {/* Lists */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => execCommand("insertUnorderedList")}
                      className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-gray-200 rounded transition-colors"
                      title="Bullet List"
                    >
                      <FaListUl size={14} />
                    </button>
                    <button
                      onClick={() => execCommand("insertOrderedList")}
                      className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-gray-200 rounded transition-colors"
                      title="Numbered List"
                    >
                      <FaListOl size={14} />
                    </button>
                  </div>

                  <div className="w-px h-6 bg-gray-300 mx-1"></div>

                  <button
                    onClick={() => {
                      const url = prompt("Enter Link URL:");
                      if (url) execCommand("createLink", url);
                    }}
                    className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-gray-200 rounded transition-colors"
                    title="Insert Link"
                  >
                    <FaLink size={14} />
                  </button>
                </div>

                {/* Content Area */}
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={handleContentChange}
                  className="flex-1 p-6 focus:outline-none overflow-y-auto prose max-w-none text-gray-800"
                  style={{ minHeight: "200px" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Settings Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Publishing Settings
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleUpdate("status", "published")}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                    currentDoc.status === "published"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <FaCheckCircle size={14} />
                  <span className="text-sm font-medium">Published</span>
                </button>
                <button
                  onClick={() => handleUpdate("status", "draft")}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                    currentDoc.status === "draft"
                      ? "bg-amber-50 border-amber-200 text-amber-700"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <FaTimesCircle size={14} />
                  <span className="text-sm font-medium">Draft</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Effective Date
              </label>
              <input
                type="date"
                value={currentDoc.effectiveDate}
                onChange={(e) => handleUpdate("effectiveDate", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500 space-y-2">
                <p>
                  <span className="font-semibold">Last Modified:</span> Just now
                </p>
                <p>
                  <span className="font-semibold">Modified By:</span> Admin User
                </p>
                <p>
                  <span className="font-semibold">Version:</span>{" "}
                  {currentDoc.version}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalDocuments;
