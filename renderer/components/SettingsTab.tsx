import React, { useEffect, useState } from "react";
import { themeChange } from "theme-change";
import commands from "../../electron/commands";
import { useAtom, useAtomValue } from "jotai";
import { customModelsPathAtom, scaleAtom } from "../atoms/userSettingsAtom";
import { modelsListAtom } from "../atoms/modelsListAtom";
import useLog from "./hooks/useLog";

interface IProps {
  progress: string;
  selectImageHandler: () => Promise<void>;
  selectFolderHandler: () => Promise<void>;
  handleModelChange: (e: any) => void;
  handleDrop: (e: any) => void;
  outputHandler: () => Promise<void>;
  bgRemoveHandler: () => Promise<void>;
  upscaylHandler: () => Promise<void>;
  batchMode: boolean;
  setModel: React.Dispatch<React.SetStateAction<string>>;
  saveImageAs: string;
  setSaveImageAs: React.Dispatch<React.SetStateAction<string>>;
  gpuId: string;
  setGpuId: React.Dispatch<React.SetStateAction<string>>;
  logData: string[];
}

function SettingsTab({
  progress,
  selectImageHandler,
  selectFolderHandler,
  handleModelChange,
  handleDrop,
  outputHandler,
  bgRemoveHandler,
  upscaylHandler,
  batchMode,
  setModel,
  gpuId,
  setGpuId,
  saveImageAs,
  setSaveImageAs,
  logData,
}: IProps) {
  // STATES
  const [currentModel, setCurrentModel] = useState<{
    label: string;
    value: string;
  }>({
    label: null,
    value: null,
  });
  const [rememberOutputFolder, setRememberOutputFolder] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [customModelsPath, setCustomModelsPath] = useAtom(customModelsPathAtom);
  const modelOptions = useAtomValue(modelsListAtom);
  const [scale, setScale] = useAtom(scaleAtom);

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

    if (!localStorage.getItem("rememberOutputFolder")) {
      logit("📢 Setting rememberOutputFolder to false");
      localStorage.setItem("rememberOutputFolder", "false");
    } else {
      const currentlySavedRememberOutputFolder = localStorage.getItem(
        "rememberOutputFolder"
      );
      logit(
        "📢 Getting rememberOutputFolder from localStorage",
        currentlySavedRememberOutputFolder
      );
      setRememberOutputFolder(
        currentlySavedRememberOutputFolder === "true" ? true : false
      );
    }
  }, []);

  // HANDLERS
  const setExportType = (format: string) => {
    setSaveImageAs(format);
    localStorage.setItem("saveImageAs", format);
  };

  const handleGpuIdChange = (e) => {
    setGpuId(e.target.value);
    localStorage.setItem("gpuId", e.target.value);
  };

  const copyOnClickHandler = () => {
    navigator.clipboard.writeText(logData.join("\n"));
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
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

  // const modelOptions = [
  //   { label: "通用素材 (Real-ESRGAN)", value: "realesrgan-x4plus" },
  //   { label: "通用素材 (Remacri)", value: "remacri" },
  //   { label: "通用素材 (Ultramix Balanced)", value: "ultramix_balanced" },
  //   { label: "通用素材 (Ultrasharp)", value: "ultrasharp" },
  //   { label: "Digital Art", value: "realesrgan-x4plus-anime" },
  // ];

  const availableThemes = [
    { label: "light", value: "light" },
    { label: "dark", value: "dark" },
    { label: "cupcake", value: "cupcake" },
    { label: "bumblebee", value: "bumblebee" },
    { label: "emerald", value: "emerald" },
    { label: "corporate", value: "corporate" },
    { label: "synthwave", value: "synthwave" },
    { label: "retro", value: "retro" },
    { label: "cyberpunk", value: "cyberpunk" },
    { label: "valentine", value: "valentine" },
    { label: "halloween", value: "halloween" },
    { label: "garden", value: "garden" },
    { label: "forest", value: "forest" },
    { label: "aqua", value: "aqua" },
    { label: "lofi", value: "lofi" },
    { label: "pastel", value: "pastel" },
    { label: "fantasy", value: "fantasy" },
    { label: "wireframe", value: "wireframe" },
    { label: "black", value: "black" },
    { label: "luxury", value: "luxury" },
    { label: "dracula", value: "dracula" },
    { label: "cmyk", value: "cmyk" },
    { label: "autumn", value: "autumn" },
    { label: "business", value: "business" },
    { label: "acid", value: "acid" },
    { label: "lemonade", value: "lemonade" },
    { label: "night", value: "night" },
    { label: "coffee", value: "coffee" },
    { label: "winter", value: "winter" },
  ];

  return (
    <div className="animate-step-in animate flex h-screen flex-col gap-7 overflow-y-auto p-5 overflow-x-hidden">
      {/* THEME SELECTOR */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">主题</p>
        <select data-choose-theme className="select-primary select">
          <option value="dark">Default</option>
          {availableThemes.map((theme) => {
            return (
              <option value={theme.value} key={theme.value}>
                {theme.label.toLocaleUpperCase()}
              </option>
            );
          })}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">SAVE OUTPUT FOLDER (PERMANENTLY)</p>
        <input
          type="checkbox"
          className="toggle-primary toggle"
          checked={rememberOutputFolder}
          onClick={() => {
            setRememberOutputFolder((oldValue) => {
              if (oldValue === true) {
                localStorage.removeItem("lastOutputFolderPath");
              }

              return !oldValue;
            });
            localStorage.setItem(
              "rememberOutputFolder",
              JSON.stringify(!rememberOutputFolder)
            );
          }}
        />
      </div>

      {/* GPU ID INPUT */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">GPU ID</p>
        <input
          type="text"
          placeholder="Type here"
          className="input-bordered input w-full max-w-xs"
          value={gpuId}
          onChange={handleGpuIdChange}
        />
      </div>

      {/* CUSTOM MODEL */}
      <div className="flex flex-col items-start gap-2">
        <p className="text-sm font-medium">自定义模型导入</p>
        <p className="text-sm text-base-content/60">{customModelsPath}</p>
        <button
          className="btn-primary btn"
          onClick={async () => {
            const customModelPath = await window.electron.invoke(
              commands.SELECT_CUSTOM_MODEL_FOLDER
            );

            if (customModelPath !== null) {
              setCustomModelsPath(customModelPath);
              window.electron.send(commands.GET_MODELS_LIST, customModelPath);
            } else {
              setCustomModelsPath("");
            }
          }}>
          Select Folder
        </button>
      </div>

      {/* IMAGE FORMAT BUTTONS */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-1">
          <p className="text-sm font-medium">另存入</p>
          <p className="badge-primary badge text-[10px] font-medium">
            测试中
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {batchMode && (
            <p className="text-xs text-base-content/70">
              Only PNG is supported in Batch Upscale
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {/* PNG */}
            <button
              className={`btn-primary btn ${
                saveImageAs === "png" && "btn-accent"
              }`}
              onClick={() => setExportType("png")}>
              PNG
            </button>
            {/* JPG */}
            <button
              className={`btn-primary btn ${
                saveImageAs === "jpg" && "btn-accent"
              }`}
              onClick={() => setExportType("jpg")}>
              JPG
            </button>
            {/* WEBP */}
            <button
              className={`btn-primary btn ${
                saveImageAs === "webp" && "btn-accent"
              }`}
              onClick={() => setExportType("webp")}>
              WEBP
            </button>
          </div>
        </div>
      </div>

      {/* IMAGE SCALE */}
      <div>
        <div className="flex flex-row gap-1">
          <p className="text-sm font-medium">图像比例</p>
          <p className="badge-primary badge text-[10px] font-medium">
            测试中
          </p>
        </div>
        <input
          type="range"
          min="2"
          max="4"
          value={scale}
          onChange={(e: any) => {
            setScale(e.target.value.toString());
          }}
          step="1"
          className="range range-primary mt-2"
        />
        <div className="flex w-full justify-between px-2 text-xs font-semibold text-base-content">
          <span>2x</span>
          <span>3x</span>
          <span>4x</span>
        </div>
      </div>

      <div className="relative flex flex-col gap-2">
        <button
          className="btn-primary btn-xs btn absolute right-2 top-10 z-10"
          onClick={copyOnClickHandler}>
          {isCopied ? <span>Copied 📋</span> : <span>Copy 📋</span>}
        </button>
        <p className="text-sm font-medium">日志：</p>
        <code className="rounded-btn relative flex h-52 max-h-52 flex-col gap-3 overflow-y-auto break-all bg-base-200 p-4 text-xs">
          {logData.length === 0 && (
            <p className="text-base-content/70">No logs to show</p>
          )}

          {logData.map((logLine) => {
            console.log(logData);
            return <p className="">{logLine}</p>;
          })}
        </code>
      </div>

      {/* DONATE BUTTON */}
      {/* <div className="mt-auto flex flex-col items-center justify-center gap-2 text-sm font-medium">
        <p>If you like what we do :)</p>
        <a href="https://buymeacoffee.com/fossisthefuture" target="_blank">
          <button className="btn-primary btn">Donate</button>
        </a>
      </div> */}
    </div>
  );
}

export default SettingsTab;
