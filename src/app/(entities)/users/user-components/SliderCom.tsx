"use client";

import React from "react";

type Category = {
  name: string;
  color: string;
  icon: React.ReactNode;
};

const categories: Category[] = [
  {
    name: "Electronics",
    color: "blue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    name: "Fashion",
    color: "pink",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
      </svg>
    ),
  },
  {
    name: "Fitness",
    color: "red",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4M6 12h12" />
      </svg>
    ),
  },
  {
    name: "Home",
    color: "green",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    name: "Gaming",
    color: "purple",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <line x1="6" y1="12" x2="10" y2="12" />
        <line x1="8" y1="10" x2="8" y2="14" />
        <circle cx="15" cy="13" r="1" fill="currentColor" />
        <circle cx="17" cy="11" r="1" fill="currentColor" />
        <path d="M17 4H7a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4z" />
      </svg>
    ),
  },
  {
    name: "Beauty",
    color: "yellow",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
        <path d="M19 3v4M21 5h-4" />
      </svg>
    ),
  },
  {
    name: "Books",
    color: "indigo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    name: "Others",
    color: "gray",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
];

const colorMap: Record<string, { bg: string; text: string }> = {
  blue:   { bg: "rgba(99,155,255,0.12)",  text: "#63a0ff" },
  pink:   { bg: "rgba(255,100,165,0.12)", text: "#ff64a5" },
  red:    { bg: "rgba(255,90,90,0.12)",   text: "#ff5a5a" },
  green:  { bg: "rgba(60,210,130,0.12)",  text: "#3cd282" },
  purple: { bg: "rgba(160,100,255,0.12)", text: "#a064ff" },
  yellow: { bg: "rgba(255,200,60,0.12)",  text: "#ffc83c" },
  indigo: { bg: "rgba(100,130,255,0.12)", text: "#6482ff" },
  gray:   { bg: "rgba(160,160,160,0.1)",  text: "#a0a0a0" },
};

const SliderCom = () => {
  const doubled = [...categories, ...categories];

  return (
    <div className="bg-[#0d0d0d] rounded-2xl py-3 overflow-hidden relative mt-4">

      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #0d0d0d, transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #0d0d0d, transparent)" }}
      />

      <p className="text-[10px] tracking-widest text-zinc-600 uppercase px-6 mb-3">
        Browse categories
      </p>

      <div className="overflow-hidden">
        <div
          className="flex gap-4 px-4 w-max"
          style={{ animation: "autoScroll 22s linear infinite" }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
        >
          {doubled.map((cat, i) => {
            const c = colorMap[cat.color];
            return (
              <div
                key={i}
                className="group w-[100px] h-[100px] rounded-2xl flex flex-col items-center justify-center gap-2
                           border border-white/5 cursor-pointer flex-shrink-0 transition-all duration-300
                           hover:scale-110 hover:-translate-y-1 hover:border-white/20"
                style={{ background: "#111111" }}
              >
                {/* Icon Box */}
                <div
                  className="relative flex items-center justify-center w-10 h-10 rounded-xl"
                  style={{ background: c.bg }}
                >
                  <div
                    style={{ color: c.text }}
                    className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                  >
                    {cat.icon}
                  </div>
                </div>

                {/* Label */}
                <span className="text-[10px] font-medium text-white/60 group-hover:text-white transition-colors duration-300">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes autoScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default SliderCom;
