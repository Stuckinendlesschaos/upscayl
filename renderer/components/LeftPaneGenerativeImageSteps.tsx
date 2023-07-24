import { useAtom, useAtomValue } from "jotai";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import ReactTooltip from "react-tooltip";
import { themeChange } from "theme-change";
import { modelsListAtom } from "../atoms/modelsListAtom";
import useLog from "./hooks/useLog";
// TODO：生成批量素材
import batchMode from "./LeftPaneImageSteps";

interface IProps {
  progress: string;
  generativeBgImageHandler: () => Promise<void>;
  imagePath: string;
  outputPath: string;
  dimensions: {
    width: number | null;
    height: number | null;
  };
  promptMode: boolean;
  setPromptMode: React.Dispatch<React.SetStateAction<boolean>>;
//   setSaveImageAs: React.Dispatch<React.SetStateAction<string>>;
}

function LeftPaneGenerativeImageSteps({
  progress,
  generativeBgImageHandler,
  imagePath,
  outputPath,
  dimensions,
  promptMode,
  setPromptMode,
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
      

      {/* STEP 1 */}
      <div data-tip={imagePath}>
      <div className="flex flex-row gap-1">
        <p className="step-heading">选项卡 1</p>
        <p className="badge-primary badge text-[10px] font-medium">
            测试中
        </p>
        </div>
        <button
          className="btn-primary btn"
          onClick={generativeBgImageHandler}
          disabled={progress.length === 20}>
          {progress.length === 20 ? "生成背景中⏳" : "生成背景"}
        </button>
      </div>
    
    </div>

      
  );
}


export default LeftPaneGenerativeImageSteps;
