import React from 'react';

/**
 * Enterprise Triple-Cube Isometric Logo Component
 * Identical to the modern royal blue gradient badge with 3D interconnected isometric cubes logo.
 */
export const Logo = ({ 
  variant = 'icon', // 'icon' | 'mark' | 'full'
  size = 'md',      // 'sm' | 'md' | 'lg' | 'xl'
  title = 'MINI ERP',
  subtitle = '+ CRM Enterprise',
  className = '',
  iconClassName = '',
  animated = false
}) => {
  // Size mappings for icon container
  const sizeClasses = {
    sm: 'w-7 h-7 p-1 rounded-xl text-[10px]',
    md: 'w-9 h-9 p-1.5 rounded-2xl text-xs',
    lg: 'w-11 h-11 p-2 rounded-2xl text-sm',
    xl: 'w-14 h-14 p-2.5 rounded-3xl text-base'
  };

  const pixelSizes = {
    sm: 28,
    md: 36,
    lg: 44,
    xl: 56
  };

  // Pure SVG vector 3D Isometric 3-Cube Mesh
  const CubeMeshSvg = ({ svgClassName = "w-full h-full text-white" }) => (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${svgClassName} ${animated ? 'animate-pulse' : ''}`}
    >
      <defs>
        {/* Subtle face gradient overlays */}
        <linearGradient id="topFaceGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#E0E7FF" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="leftFaceGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="rightFaceGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#A5B4FC" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* TOP CUBE */}
      <g className="cube-top">
        {/* Top Face */}
        <path d="M 50 15 L 67.32 25 L 50 35 L 32.68 25 Z" fill="url(#topFaceGlow)" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
        {/* Left Face */}
        <path d="M 32.68 25 L 50 35 L 50 55 L 32.68 45 Z" fill="url(#leftFaceGlow)" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
        {/* Right Face */}
        <path d="M 50 35 L 67.32 25 L 67.32 45 L 50 55 Z" fill="url(#rightFaceGlow)" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
      </g>

      {/* BOTTOM-LEFT CUBE */}
      <g className="cube-bottom-left">
        {/* Top Face */}
        <path d="M 32.68 45 L 50 55 L 32.68 65 L 15.36 55 Z" fill="url(#topFaceGlow)" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
        {/* Left Face */}
        <path d="M 15.36 55 L 32.68 65 L 32.68 85 L 15.36 75 Z" fill="url(#leftFaceGlow)" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
        {/* Right Face */}
        <path d="M 32.68 65 L 50 55 L 50 75 L 32.68 85 Z" fill="url(#rightFaceGlow)" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
      </g>

      {/* BOTTOM-RIGHT CUBE */}
      <g className="cube-bottom-right">
        {/* Top Face */}
        <path d="M 50 55 L 67.32 45 L 84.64 55 L 67.32 65 Z" fill="url(#topFaceGlow)" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
        {/* Left Face */}
        <path d="M 50 55 L 67.32 65 L 67.32 85 L 50 75 Z" fill="url(#leftFaceGlow)" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
        {/* Right Face */}
        <path d="M 67.32 65 L 84.64 55 L 84.64 75 L 67.32 85 Z" fill="url(#rightFaceGlow)" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
      </g>
    </svg>
  );

  // Background Squircle Badge with rich royal blue gradient
  const IconBadge = (
    <div 
      className={`
        relative flex items-center justify-center shrink-0
        bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500
        border border-blue-400/30
        shadow-lg shadow-blue-600/30
        hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300
        ${sizeClasses[size] || 'w-9 h-9 p-1.5 rounded-2xl'}
        ${iconClassName}
      `}
    >
      {/* Inner ambient glow reflection */}
      <div className="absolute inset-0 bg-white/10 rounded-[inherit] pointer-events-none" />
      <CubeMeshSvg />
    </div>
  );

  if (variant === 'mark') {
    return (
      <div className={`inline-block ${className}`}>
        <CubeMeshSvg svgClassName={`text-blue-500 ${iconClassName}`} />
      </div>
    );
  }

  if (variant === 'icon') {
    return IconBadge;
  }

  // Full variant: Icon badge + Brand Text typography
  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      {IconBadge}
      <div>
        <span className="font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight block">
          {title} <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">{subtitle}</span>
        </span>
        {subtitle && (
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-500 dark:text-blue-400 block -mt-0.5">
            Enterprise Operations
          </span>
        )}
      </div>
    </div>
  );
};
