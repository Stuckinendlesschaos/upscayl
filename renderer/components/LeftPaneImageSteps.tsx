import { useAtom, useAtomValue } from "jotai";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { themeChange } from "theme-change";
import { modelsListAtom } from "../atoms/modelsListAtom";
import useLog from "./hooks/useLog";

interface IProps {
  progress: string;
  selectImageHandler: () => Promise<void>;
  selectFolderHandler: () => Promise<void>;
  handleModelChange: (e: any) => void;
  outputHandler: () => Promise<void>;
  bgRemoveHandler: () => Promise<void>;
  upscaylHandler: () => Promise<void>;
  batchMode: boolean;
  setBatchMode: React.Dispatch<React.SetStateAction<boolean>>;
  imagePath: string;
  outputPath: string;
  doubleUpscayl: boolean;
  setDoubleUpscayl: React.Dispatch<React.SetStateAction<boolean>>;
  dimensions: {
    width: number | null;
    height: number | null;
  };
  setSaveImageAs: React.Dispatch<React.SetStateAction<string>>;
  setModel: React.Dispatch<React.SetStateAction<string>>;
  setGpuId: React.Dispatch<React.SetStateAction<string>>;
}

function LeftPaneImageSteps({
  progress,
  selectImageHandler,
  selectFolderHandler,
  handleModelChange,
  outputHandler,
  bgRemoveHandler,
  upscaylHandler,
  batchMode,
  setBatchMode,
  imagePath,
  outputPath,
  doubleUpscayl,
  setDoubleUpscayl,
  dimensions,
  setSaveImageAs,
  setModel,
  setGpuId,
}: IProps) {
  const [currentModel, setCurrentModel] = useState<{
    label: string;
    value: string;
  }>({
    label: null,
    value: null,
  });

  // 导入优化Model,目前模型放置在本地！！！ 
  const modelOptions = useAtomValue(modelsListAtom);

  const { logit } = useLog();

  useEffect(() => {
    themeChange(false);

    if (!localStorage.getItem("saveImageAs")) {
      logit("📢 Setting saveImageAs to png");
      localStorage.setItem("saveImageAs", "png");
    } else {
      const currentlySavedImageFormat = localStorage.getItem("saveImageAs");
      logit(
        "📢 Getting saveImageAs from localStorage",
        currentlySavedImageFormat
      );
      setSaveImageAs(currentlySavedImageFormat);
    }

    if (!localStorage.getItem("model")) {
      setCurrentModel(modelOptions[0]);
      setModel(modelOptions[0].value);
      localStorage.setItem("model", JSON.stringify(modelOptions[0]));
      logit("📢 Setting model to", modelOptions[0].value);
    } else {
      const currentlySavedModel = JSON.parse(
        localStorage.getItem("model")
      ) as (typeof modelOptions)[0];
      setCurrentModel(currentlySavedModel);
      setModel(currentlySavedModel.value);
      logit(
        "📢 Getting model from localStorage",
        JSON.stringify(currentlySavedModel)
      );
    }

    if (!localStorage.getItem("gpuId")) {
      localStorage.setItem("gpuId", "");
      logit("📢 Setting gpuId to empty string");
    } else {
      const currentlySavedGpuId = localStorage.getItem("gpuId");
      setGpuId(currentlySavedGpuId);
      logit("📢 Getting gpuId from localStorage", currentlySavedGpuId);
    }
  }, []);

  useEffect(() => {
    logit("📢 Setting model to", currentModel.value);
  }, [currentModel]);

  const setExportType = (format: string) => {
    setSaveImageAs(format);
    localStorage.setItem("saveImageAs", format);
  };

  const handleBatchMode = () => {
    setBatchMode((oldValue) => !oldValue);
  };

  const handleGpuIdChange = (e) => {
    setGpuId(e.target.value);
    localStorage.setItem("gpuId", e.target.value);
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: "1px dotted pink",
      color: state.isSelected ? "red" : "blue",
      padding: 20,
    }),
    control: () => ({
      // none of react-select's styles are passed to <Control />
      width: 200,
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = "opacity 300ms";

      return { ...provided, opacity, transition };
    },
  };

  useEffect(() => {}, [imagePath]);

  return (
    <div className="animate-step-in animate flex h-screen flex-col gap-7 overflow-y-auto p-5 overflow-x-hidden">
      {/* BATCH OPTION */}
      <div className="flex flex-row items-center gap-2">
        <input
          type="checkbox"
          className="toggle"
          defaultChecked={batchMode}
          onClick={() => setBatchMode((oldValue) => !oldValue)}></input>
        <p
          className="mr-1 inline-block  cursor-help text-sm"
          data-tip="批量处理一个文件夹的所有素材">
          批处理
        </p>
      </div>

      {/* STEP 1 */}
      <div data-tip={imagePath}>
        <p className="step-heading">步骤 1</p>
        <button
          className="btn-primary btn"
          onClick={!batchMode ? selectImageHandler : selectFolderHandler}>
          选择{batchMode ? "文件夹" : "图片"}
        </button>
      </div>

      {/* STEP 2 */}
      <div className="animate-step-in" data-tip={outputPath}>
        <p className="step-heading">步骤 2</p>
        <p className="mb-2 text-sm">
          默认{!batchMode ? "图片" : "文件夹"}路径：
        </p>
        <button className="btn-primary btn" onClick={outputHandler}>
         另存为
        </button>
      </div>

      {/* STEP 3 */}
      <div className="animate-step-in">
        <p className="step-heading">步骤 3</p>
        <button
          className="btn-accent btn"
          onClick={bgRemoveHandler}
          disabled={progress.length === 20}>
          {progress.length === 20 ? "移除中⏳" : "移除背景"}
        </button>
      </div>

      {/* STEP 4 */}
      <div className="animate-step-in flex flex-col gap-2">
        <p className="step-heading">步骤 4</p>
        <p className="mb-2 text-sm">优化画质类别</p>
        {/* TODO: 切换成主题色 */}
        <Select
          options={modelOptions}
          components={{
            IndicatorSeparator: () => null,
            DropdownIndicator: () => null,
          }}
          onChange={(e) => {
            handleModelChange(e);
            setCurrentModel({ label: e.label, value: e.value });
          }}
          className="select-primary select "
          // classNamePrefix="react-select"
          value={currentModel}
        />

        {!batchMode && (
          <div className="mt-4 flex items-center gap-1">
            <input
              type="checkbox"
              className="checkbox"
              checked={doubleUpscayl}
              onChange={(e) => {
                if (e.target.checked) {
                  setDoubleUpscayl(true);
                } else {
                  setDoubleUpscayl(false);
                }
              }}
            />
            <p
              className="cursor-pointer text-sm"
              onClick={(e) => {
                setDoubleUpscayl(!doubleUpscayl);
              }}>
              双倍优化
            </p>
            <button
              className="badge-info badge cursor-help"
              data-tip="Enable this option to get a 16x upscayl (we just run upscayl twice). Note that this may not always work properly with all images, for example, images with really large resolutions.">
              i
            </button>
          </div>
        )}
      </div>

      {/* STEP 5 */}
      <div className="animate-step-in">
        <p className="step-heading">步骤 5</p>
        {dimensions.width && dimensions.height && (
          <p className="mb-2 text-sm">
            优化分辨率{" "}
            <span className="font-bold">
              {dimensions.width}x{dimensions.height}
            </span>{" "}
            到{" "}
            <span className="font-bold">
              {doubleUpscayl ? dimensions.width * 16 : dimensions.width * 4}x
              {doubleUpscayl ? dimensions.height * 16 : dimensions.height * 4}
            </span>
          </p>
        )}
        <button
          className="btn-accent btn"
          onClick={upscaylHandler}
          disabled={progress.length === 10}>
          {progress.length === 10 ? "优化中⏳" : "优化"}
        </button>
      </div>

    </div>
  );
}

export default LeftPaneImageSteps;
