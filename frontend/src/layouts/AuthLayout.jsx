import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#07090E] p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      {/* Radial Gradient & Grid Mesh Overlay */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]" 
        pointerEvents="none" 
      />
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:4rem_4rem]" 
        pointerEvents="none" 
      />

      {/* Dynamic Glowing Ambient Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none animate-pulse" />
      <div className="absolute top-3/4 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-6xl relative z-10 my-auto">
        <Outlet />
      </div>
    </div>
  );
};
