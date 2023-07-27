import { useAtom, useAtomValue } from "jotai";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { themeChange } from "theme-change";
import { modelsListAtom } from "../../atoms/modelsListAtom";
import useLog from "../hooks/useLog";
// TODO：生成批量素材
import batchMode from "./LeftPaneImageSteps";

interface IProps {
  progress: string;
  generativeBgImageHandler: () => Promise<void>;
  generativePartialImageHandler: () => Promise<void>;
  imagePath: string;
  outputPath: string;
  dimensions: {
    width: number | null;
    height: number | null;
  };
  promptMode: boolean;
  prompt: string;
  negativePrompt: string;
  setPromptMode: React.Dispatch<React.SetStateAction<boolean>>;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  setNegativePrompt: React.Dispatch<React.SetStateAction<string>>;
  setRandomizeSeed: () => number;
  // setPrompt: (value: string) => string;
  // setNegativePrompt: (value: string) => string;
//   setSaveImageAs: React.Dispatch<React.SetStateAction<string>>;
}

function LeftPaneGenerativeImageSteps({
  progress,
  generativeBgImageHandler,
  generativePartialImageHandler,
  imagePath,
  outputPath,
  dimensions,
  promptMode,
  prompt,
  negativePrompt,
  setPromptMode,
  setPrompt,
  setNegativePrompt,
  setRandomizeSeed,
}: IProps) {
  // 日志打印 
  const { logit } = useLog();


  useEffect(() => {}, [imagePath]);

  return (
    <div className="animate-step-in animate flex h-screen flex-col gap-7 overflow-y-auto p-5 overflow-x-hidden">

      <div className="flex flex-row items-center gap-2">
        <input
          type="checkbox"
          className="toggle"
          defaultChecked={promptMode}
          onClick={() => setPromptMode((oldValue) => !oldValue)}></input>
        <p
          className="mr-1 inline-block  cursor-help text-sm"
          data-tip="激活关键词用于生成式素材">
          打开关键词
        </p>
      </div>
      
      {/* 选项卡 1 */}
      <div data-tip={imagePath}>
      <div className="flex flex-row gap-1">
        <p className="step-heading">选项卡 1</p>
        <p className="badge-primary badge text-[10px] font-medium">
            测试中
        </p>
        </div>
        
        {/* prompt 关键词显示 */}
        {prompt.length > 0 && (
        <div className="flex flex-col">
          <p className="text-sm font-medium step-heading">正向关键词： </p>
          <p className="mb-2 text-sm"> {prompt} </p>
          </div>)}

        {/* negativePrompt 关键词显示 */}
        {negativePrompt.length > 0 && (
        <div className="flex flex-col">
          <p className="text-sm font-medium step-heading">反向关键词： </p>
          <p className="mb-2 text-sm"> {negativePrompt} </p>
          </div>)}
        <div className="flex flex-col items-start gap-2">
        <button
          className="btn-accent btn"
          onClick={generativeBgImageHandler}
          disabled={progress.length === 23}>
          {progress.length === 23 ? "生成背景中⏳" : "生成背景"}
        </button>
        </div>
      </div>

      {/* 选项卡 2 */}
      <div data-tip={imagePath}>
      <div className="flex flex-row gap-1">
        <p className="step-heading">选项卡 2</p>
        <p className="badge-primary badge text-[10px] font-medium">
            测试中
        </p>
        </div>
          <button
            className="btn-accent btn"
            onClick={generativePartialImageHandler}
            disabled={progress.length === 29}>
            {progress.length === 29 ? "局部生成中⏳" : "局部生成"}
          </button>
      </div>
  
    </div>

      
  );
}


export default LeftPaneGenerativeImageSteps;
