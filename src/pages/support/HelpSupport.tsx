import React, { useState } from "react";
import {
  FaEnvelope,
  FaBook,
  FaServer,
  FaUsers,
  FaTwitter,
  FaGithub,
  FaGlobe,
  FaExternalLinkAlt,
} from "react-icons/fa";

const HelpSupport: React.FC = () => {
  const [ticket, setTicket] = useState({ subject: "", message: "" });
  const [socials, setSocials] = useState({
    twitter: "https://twitter.com/wallpaperapp",
    github: "https://github.com/wallpaperapp",
    website: "https://wallpaperapp.com",
  });

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Ticket submitted successfully! (Placeholder)");
    setTicket({ subject: "", message: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-sm text-gray-500 mt-1">
            Support resources and contact channels
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Support */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FaEnvelope />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Contact Support
            </h3>
          </div>
          <p className="text-sm text-gray-500">
            Need help with the admin panel? Send us a message and our support
            team will get back to you within 24 hours.
          </p>

          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                value={ticket.subject}
                onChange={(e) =>
                  setTicket({ ...ticket, subject: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="e.g. Issue with notifications"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                required
                rows={5}
                value={ticket.message}
                onChange={(e) =>
                  setTicket({ ...ticket, message: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                placeholder="Describe your issue in detail..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Submit Ticket
            </button>
          </form>
        </div>

        {/* Resources & Socials */}
        <div className="space-y-6">
          {/* Quick Links */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resources
            </h3>
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <FaBook className="text-gray-400 group-hover:text-indigo-500" />
                  <span className="font-medium">Documentation</span>
                </div>
                <FaExternalLinkAlt className="text-xs text-gray-400" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <FaServer className="text-gray-400 group-hover:text-indigo-500" />
                  <span className="font-medium">System Status</span>
                </div>
                <FaExternalLinkAlt className="text-xs text-gray-400" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <FaUsers className="text-gray-400 group-hover:text-indigo-500" />
                  <span className="font-medium">Community Forum</span>
                </div>
                <FaExternalLinkAlt className="text-xs text-gray-400" />
              </a>
            </div>
          </div>

          {/* Follow Links Management */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Follow Links
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                  <FaTwitter />
                </div>
                <input
                  type="text"
                  value={socials.twitter}
                  onChange={(e) =>
                    setSocials({ ...socials, twitter: e.target.value })
                  }
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 text-gray-700 rounded-lg">
                  <FaGithub />
                </div>
                <input
                  type="text"
                  value={socials.github}
                  onChange={(e) =>
                    setSocials({ ...socials, github: e.target.value })
                  }
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500"
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg">
                  <FaGlobe />
                </div>
                <input
                  type="text"
                  value={socials.website}
                  onChange={(e) =>
                    setSocials({ ...socials, website: e.target.value })
                  }
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <button className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium mt-2">
                Update Links
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
