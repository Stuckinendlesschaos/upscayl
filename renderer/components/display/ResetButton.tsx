import React from "react";

function ResetButton(props) {
  return (
    <button
      className="animate bg-gradient-blue absolute top-1 right-1 z-10 rounded-full py-2 px-4 text-white opacity-30 hover:opacity-100"
      onClick={props.resetImagePaths}
    >
      重置
    </button>
  );
}

export default ResetButton;
