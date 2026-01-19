import React from "react";

const AuthBranding: React.FC = () => {
  return (
    <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 relative overflow-hidden flex-col justify-between p-12 text-white">
      {/* Geometric Background Overlay (Simple simulation) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border border-white"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full border border-white"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full border border-white translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative z-10">
        <img
          src="/wallpaper-logo.png"
          alt="Logo"
          className="w-16 h-16 mb-4 rounded-xl"
        />
        <h1 className="text-5xl font-bold leading-tight mb-2">
          Hello
          <br />
          Wallpaper Admin! <span className="inline-block animate-wave">👋</span>
        </h1>

        <div className="mt-12 max-w-md">
          <p className="text-lg opacity-90 leading-relaxed">
            Manage your diverse collection of wallpapers, track user engagement,
            and curate the best visual experience for your users.
          </p>
        </div>
      </div>

      <div className="relative z-10 text-sm opacity-60">
        © 2026 Wallpaper Admin. All rights reserved.
      </div>
    </div>
  );
};

export default AuthBranding;
