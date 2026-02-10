import React, { useState, useEffect } from "react";
import { FaSave, FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Editor } from "@tinymce/tinymce-react";

import {
  legalDocumentService,
  type LegalDocument,
} from "../../services/legalDocumentService";

type DocumentType = "terms" | "privacy" | "disclaimer" | "eula" | "about-app";

const LegalDocuments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DocumentType>("terms");
  const [documents, setDocuments] = useState<Record<string, LegalDocument>>({});
  const [loading, setLoading] = useState(false);

  const handleUpdate = (field: keyof LegalDocument, value: string) => {
    setDocuments((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value,
      },
    }));
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await legalDocumentService.getAll();
      const docsMap: Record<string, LegalDocument> = {};

      let fetchedDocs: LegalDocument[] = [];
      if (Array.isArray(response.data)) {
        fetchedDocs = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        fetchedDocs = response.data.data;
      }
      console.log(response?.data);

      const types: DocumentType[] = [
        "terms",
        "privacy",
        "disclaimer",
        "eula",
        "about-app",
      ];
      types.forEach((type) => {
        const found = fetchedDocs.find((d) => d.type === type);
        docsMap[type] = found || {
          title:
            type === "terms"
              ? "Terms & Conditions"
              : type === "about-app"
                ? "About App"
                : type.charAt(0).toUpperCase() + type.slice(1),
          slug: type,
          type: type,
          version: "1.0",
          content: "",
          effectiveDate: new Date().toISOString().split("T")[0],
          status: "draft",
        };
      });

      setDocuments(docsMap);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSave = async () => {
    try {
      const doc = documents[activeTab];
      if (doc._id || doc.id) {
        // Handle both _id (mongoose) and id (if transformed)
        const id = doc._id || doc.id;
        await legalDocumentService.update(id!, doc);
        toast.success("Document updated successfully");
      } else {
        const newDoc = await legalDocumentService.create(doc);
        setDocuments((prev) => ({
          ...prev,
          [activeTab]: newDoc.data,
        }));
        toast.success("Document created successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save document");
    }
  };

  const handlePreview = () => {
    try {
      const doc = documents[activeTab];
      const blob = new Blob(
        [
          `
        <html>
          <head>
            <title>${doc.title} - Preview</title>
            <style>
              body { font-family: sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; line-height: 1.6; }
              img { max-width: 100%; height: auto; }
              blockquote { border-left: 4px solid #ccc; padding-left: 1rem; color: #666; }
              code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div style="margin-bottom: 2rem; color: #666; font-size: 0.9em; border-bottom: 1px solid #eee; padding-bottom: 1rem;">
              <strong>Slug:</strong> /${doc.slug} <br/>
              <strong>Version:</strong> ${doc.version} <br/>
              <strong>Date:</strong> ${doc.effectiveDate}
            </div>
            <div style="white-space: pre-wrap;">${doc.content}</div>
          </body>
        </html>
        `,
        ],
        { type: "text/html" },
      );
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (e) {
      alert("Could not create preview window.");
    }
  };

  const currentDoc = documents[activeTab];

  if (loading || !currentDoc) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

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
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
          >
            <FaSave />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(
          [
            "terms",
            "privacy",
            "disclaimer",
            "eula",
            "about-app",
          ] as DocumentType[]
        ).map((tab) => (
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
                  : tab === "about-app"
                    ? "About App"
                    : "EULA"}
          </button>
        ))}
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
              <div className="flex-1 rounded-xl overflow-hidden shadow-sm bg-white border border-gray-200">
                <Editor
                  key={activeTab} // Force remount on tab change to ensure clean state
                  apiKey="h54nh96celgri1gkivmkyaltregzyuga9m8ggkskpf13qwoe"
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                  initialValue={currentDoc.content || ""}
                  onEditorChange={(content) => handleUpdate("content", content)}
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
                value={
                  currentDoc.effectiveDate
                    ? currentDoc.effectiveDate.split("T")[0]
                    : ""
                }
                onChange={(e) => handleUpdate("effectiveDate", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500 space-y-2">
                <p>
                  <span className="font-semibold">Last Modified:</span>{" "}
                  {currentDoc.updatedAt
                    ? new Date(currentDoc.updatedAt).toLocaleDateString()
                    : "New"}
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
