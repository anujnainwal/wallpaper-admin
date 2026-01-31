import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaSearch, FaTimes, FaCheck } from "react-icons/fa";

interface Option {
  id: string;
  name: string;
  subText?: string;
  avatar?: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  disabled = false,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(
    (opt) =>
      opt.name.toLowerCase().includes(search.toLowerCase()) ||
      opt.subText?.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleOption = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const removeValue = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== id));
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      {label && (
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`min-h-[46px] w-full px-3 py-2 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
            disabled
              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-200 dark:border-gray-700"
              : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-500"
          }`}
        >
          <div className="flex flex-wrap gap-2 flex-1">
            {value.length > 0 ? (
              value.map((id) => {
                const opt = options.find((o) => o.id === id);
                return (
                  <span
                    key={id}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
                  >
                    {opt ? opt.name : id}
                    <button
                      type="button"
                      onClick={(e) => removeValue(e, id)}
                      className="ml-1.5 hover:text-indigo-900 dark:hover:text-indigo-100"
                    >
                      <FaTimes size={10} />
                    </button>
                  </span>
                );
              })
            ) : (
              <span className="text-sm text-gray-400 dark:text-gray-500 py-1">
                {isLoading ? "Loading..." : placeholder}
              </span>
            )}
          </div>
          <FaChevronDown
            className={`text-gray-400 text-xs transition-transform ml-2 shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-fade-in-up">
            <div className="p-2 border-b border-gray-50 dark:border-gray-700">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50/50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-600 transition-colors"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = value.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleOption(opt.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                        isSelected
                          ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {/* Avatar or Initial */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isSelected
                              ? "bg-indigo-200 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200"
                              : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {opt.avatar ? (
                            <img
                              src={opt.avatar}
                              alt={opt.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            opt.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="truncate">{opt.name}</span>
                          {opt.subText && (
                            <span
                              className={`text-xs truncate ${
                                isSelected
                                  ? "text-indigo-500 dark:text-indigo-400"
                                  : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500"
                              }`}
                            >
                              {opt.subText}
                            </span>
                          )}
                        </div>
                      </div>
                      {isSelected && <FaCheck className="shrink-0 text-xs" />}
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-center text-xs text-gray-400">
                  No matches found
                </div>
              )}
            </div>
            <div className="p-2 border-t border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 text-xs text-center text-gray-500">
              {value.length} selected
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
