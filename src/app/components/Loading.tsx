import React from "react";

const Loading = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#0b0f19] text-white">

      <div className="flex flex-col items-center gap-4">

        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-sm text-white/60 tracking-wide">
          Loading, please wait...
        </p>

        {/* Dots animation */}
        <div className="flex gap-1 mt-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></span>
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></span>
        </div>

      </div>

    </div>
  );
};

export default Loading;
