import React from "react";

export default function Header({ version }: { version: string }) {
  return (
    <a
      target="_blank"
      className="outline-none focus-visible:ring-2">
      <div className="flex items-center gap-3 px-5 py-5">
        <img src="icon-purple.png" className="inline-block w-14" alt="Upscayl Logo" />
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold">
            剪佳 <span className="text-xs">v{version}</span>
          </h1>
          <p className=""><b>“一剪到底，剪入佳境”</b></p>
        </div>
      </div>
    </a>
  );
}
