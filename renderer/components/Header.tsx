import React from "react";

function Header({ version }: { version: string }) {
  return (
    <a target="_blank">
      <div className="flex items-center gap-3 px-5 py-5">
        <img src="icon-purple.png" className="inline-block w-14" alt="剪佳 Logo" />
        <div className="flex flex-col justify-center">
          <h3 className="text-xl font-bold">
            剪佳 <span className="text-l">{version}</span>
          </h3>
          <p>一剪到底 </p>
        </div>
      </div>
    </a>
  );
}

export default Header
