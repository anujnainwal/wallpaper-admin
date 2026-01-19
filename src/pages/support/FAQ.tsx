import React, { useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: 1,
      question: "How do I change my password?",
      answer: "Go to Settings > Security and click on 'Change Password'.",
    },
    {
      id: 2,
      question: "Where can I find the API documentation?",
      answer:
        "The API documentation is available in the 'Help & Support' section.",
    },
  ]);

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ question: "", answer: "" });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAdd = () => {
    if (!newItem.question || !newItem.answer) return;
    setFaqs([...faqs, { id: Date.now(), ...newItem }]);
    setNewItem({ question: "", answer: "" });
    setIsAdding(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      setFaqs(faqs.filter((faq) => faq.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and edit Frequently Asked Questions
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
        >
          <FaPlus size={14} />
          <span>Add New FAQ</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-6 space-y-4 animate-fade-in-up">
          <h3 className="text-lg font-semibold text-gray-900">
            Add New Question
          </h3>
          <div>
            <input
              type="text"
              placeholder="Question"
              value={newItem.question}
              onChange={(e) =>
                setNewItem({ ...newItem, question: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 mb-3"
            />
            <textarea
              placeholder="Answer"
              rows={3}
              value={newItem.answer}
              onChange={(e) =>
                setNewItem({ ...newItem, answer: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newItem.question || !newItem.answer}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Save FAQ
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
          >
            <div
              className="p-4 flex items-center justify-between cursor-pointer bg-gray-50/50 hover:bg-gray-50"
              onClick={() => toggleExpand(faq.id)}
            >
              <h3 className="font-medium text-gray-900">{faq.question}</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Edit logic would go here
                    alert("Edit functionality placeholder");
                  }}
                  className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <FaEdit size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(faq.id);
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FaTrash size={14} />
                </button>
                <span className="text-gray-400">
                  {expandedId === faq.id ? (
                    <FaChevronUp size={14} />
                  ) : (
                    <FaChevronDown size={14} />
                  )}
                </span>
              </div>
            </div>
            {expandedId === faq.id && (
              <div className="px-4 py-3 border-t border-gray-100 text-gray-600 text-sm bg-white">
                {faq.answer}
              </div>
            )}
          </div>
        ))}

        {faqs.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">
              No FAQs found. Create one to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;
