import React from "react";

function RightPaneInfo({ batchMode, isVideo }) {
  return isVideo ? (
    <>
      <p className="p-5 pb-1 text-lg font-semibold">Select Video to Handle</p>
      <p className="text-sm">Image-Assistant</p>
    </>
  ) : (
    <>
      <p className="p-5 pb-1 text-lg font-semibold">
        选择{batchMode ? "批量素材" : "图片素材"}处理
      </p>
      {batchMode && (
        <p className="w-full pb-5 text-center md:w-96">
          确保处理的文件不包含PNG、JPG、JPEG和WEBP等不满足格式标准的图片。
        </p>
      )}
      <p className="text-sm">剪佳 </p>
    </>
  );
}

export default RightPaneInfo;
