import { useAtom, useAtomValue } from "jotai";
import React, { useEffect, useState } from "react";
import Select from "react-select";
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
  // 局部生成变量
  seedSwitch: boolean;
  setRandomSeedSwitch: React.Dispatch<React.SetStateAction<boolean>>;
  segaConcept1: string;
  segaConcept2: string;
  setSEGAConcept1: React.Dispatch<React.SetStateAction<string>>;
  setSEGAConcept2: React.Dispatch<React.SetStateAction<string>>;
  // sega的分类类别
  classifiedType1: string;
  setClassifiedType1: React.Dispatch<React.SetStateAction<string>>;
  classifiedType2: string;
  setClassifiedType2: React.Dispatch<React.SetStateAction<string>>;
  //移除还是添加
  segaConceptEffect1: boolean;
  setSegaConceptEffect1: React.Dispatch<React.SetStateAction<boolean>>;
  segaConceptEffect2: boolean;
  setSegaConceptEffect2: React.Dispatch<React.SetStateAction<boolean>>;
  // setPrompt: (value: string) => string;
  // setNegativePrompt: (value: string) => string;
  // setSaveImageAs: React.Dispatch<React.SetStateAction<string>>;
}

function LeftPaneGenerativeImageSteps({
  progress,
  generativeBgImageHandler,
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
  generativePartialImageHandler,
  seedSwitch,
  setRandomSeedSwitch,
  segaConcept1,
  segaConcept2,
  setSEGAConcept1,
  setSEGAConcept2,
  classifiedType1,
  classifiedType2,
  setClassifiedType1,
  setClassifiedType2,
  segaConceptEffect1,
  segaConceptEffect2,
  setSegaConceptEffect1,
  setSegaConceptEffect2,

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
        
        {(segaConcept1.length > 0 || segaConcept2.length > 0) && (<div className="text-sm font-medium step-heading">
            关键词： 
          {segaConcept1.length > 0 && (
            <div className="mt-4 flex items-center gap-1">
              {/* 给一个叉号用于清除错误 */}
              <input
                  type="radio"
                  className="radio"
                  style={{width:11,height:11}}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSEGAConcept1("")
                    }
                  }}
              />
              <p className="cursor-pointer text-sm font-bold">
                {segaConcept1}
              </p>
            </div>
          )}

          {/* negativePrompt 关键词显示 */}
          {segaConcept2.length > 0 && (
           <div className="mt-4 flex items-center gap-1">
            {/* 给一个叉号用于清除错误 */}
            <input
                type="radio"
                className="radio"
                style={{width:11,height:11}}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSEGAConcept2("")
                  }
                }}
            />
            <p className="cursor-pointer text-sm font-bold">
              {segaConcept2}
            </p>
          </div>
         )}
      </div>
      )}

          <div className="flex flex-col items-start gap-2">
            <button
              className="btn-accent btn"
              onClick={generativePartialImageHandler}
              disabled={progress.length === 29}>
              {progress.length === 29 ? "局部生成中⏳" : "局部生成"}
            </button>
          </div>

          {/* 启动随机种子选项 */}
          <div className="mt-4 flex items-center gap-1">
            <input
              type="checkbox"
              className="checkbox"
              checked={seedSwitch}
              onChange={(e) => {
                if (e.target.checked) {
                  setRandomSeedSwitch(true);
                } else {
                  setRandomSeedSwitch(false);
                }
              }}
            />
            <p
              className="cursor-pointer text-sm"
              onClick={(e) => {
                setRandomSeedSwitch(!seedSwitch);
              }}>
              随机种子
            </p>
            <button
              className="badge-info badge cursor-help"
              data-tip="Enable this option to enable random seed capacity">
              i
            </button>
          </div>
      </div>
  
    </div>

      
  );
}


export default LeftPaneGenerativeImageSteps;
