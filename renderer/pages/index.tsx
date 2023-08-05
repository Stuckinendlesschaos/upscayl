import { useState, useEffect, useCallback } from "react";
import commands from "../../electron/commands";
import { ReactCompareSlider } from "react-compare-slider";
import Header from "../components/block/Header";
import Footer from "../components/block/Footer";
import ProgressBar from "../components/block/ProgressBar";
import RightPaneInfo from "../components/display/RightPaneInfo";
import ImageOptions from "../components/display/ImageOptions";
import PromptOptions from "../components/display/PromptOptions";
import LeftPaneImageSteps from "../components/menu/LeftPaneImageSteps";
import LeftPaneGenerativeImageSteps from "../components/menu/LeftPaneGenerativeImageSteps";
import Tabs from "../components/tabs/Tabs";
import SettingsTab from "../components/menu/SettingsTab";
import { useAtom } from "jotai";
import { logAtom } from "../atoms/logAtom";
import { modelsListAtom } from "../atoms/modelsListAtom";
import { batchModeAtom, promptModeAtom, scaleAtom } from "../atoms/userSettingsAtom";
import useLog from "../components/hooks/useLog";

const Home = () => {
  // STATES
  const [imagePath, SetImagePath] = useState("");
  const [upscaledImagePath, setUpscaledImagePath] = useState("");
  const [removebgOfImagePath,setRemoveBgOfImagePath] = useState("");   
  const [generativeImagePath,setGenerativeImagePath] = useState("");
  const [remove] = useState("");                  
  const [outputPath, setOutputPath] = useState("");
  const [scaleFactor] = useState(4);
  const [progress, setProgress] = useState("");
  const [model, setModel] = useState("realesrgan-x4plus");
  const [loaded, setLoaded] = useState(false);
  const [version, setVersion] = useState("");
  const [batchMode, setBatchMode] = useAtom(batchModeAtom);
  const [promptMode, setPromptMode] = useAtom(promptModeAtom);
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [seedSwitch, setRandomSeedSwitch] = useState(false);
  const [segaConcept1, setSEGAConcept1] = useState("");
  const [segaConcept2, setSEGAConcept2] = useState("");
  const [classifiedType1, setClassifiedType1] = useState("");
  const [classifiedType2, setClassifiedType2] = useState("");
  const [segaConceptEffect1, setSegaConceptEffect1] = useState(false);
  const [segaConceptEffect2, setSegaConceptEffect2] = useState(false);
  const [concept, setConcept] = useState("");
  const [typeofInput, setTypeofInput] = useState("");
  const [batchFolderPath, setBatchFolderPath] = useState("");
  const [rmbgBatchFolderPath, setRmbgBatchFolderPath] = useState("");
  const [upscaledBatchFolderPath, setUpscaledBatchFolderPath] = useState("");
  const [doubleUpscayl, setDoubleUpscayl] = useState(false);
  const [isVideo] = useState(false);
  const [videoPath, setVideoPath] = useState("");
  const [upscaledVideoPath, setUpscaledVideoPath] = useState("");
  const [RemovebgOfVideoPath,setRemovebgOfVideoPath]= useState("");
  const [doubleUpscaylCounter, setDoubleUpscaylCounter] = useState(0);
  const [gpuId, setGpuId] = useState("");
  const [saveImageAs, setSaveImageAs] = useState("png");
  const [zoomAmount, setZoomAmount] = useState("100%");
  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");
  const [dimensions, setDimensions] = useState({
    width: null,
    height: null,
  });
  const [selectedTab, setSelectedTab] = useState(0);
  const [logData, setLogData] = useAtom(logAtom);
  const [modelOptions, setModelOptions] = useAtom(modelsListAtom);
  const [scale] = useAtom(scaleAtom);

  const { logit } = useLog();

  // EFFECTS
  useEffect(() => {
    setLoaded(true);

    setVersion(navigator?.userAgent?.match(/剪佳\/([\d\.]+\d+)/)[1]);

    const handleErrors = (data: string) => {
      if (data.includes("invalid gpu")) {
        alert(
          "Error. Please make sure you have a Vulkan compatible GPU (Most modern GPUs support Vulkan). Upscayl does not work with CPU or iGPU sadly."
        );
        resetImagePaths();
      } else if (data.includes("failed")) {
        if (batchMode) return;
        alert(
          data.includes("encode")
            ? "ENCODING ERROR => "
            : "DECODING ERROR => " +
                "This image is possibly corrupt or not supported by Upscayl, or your GPU drivers are acting funny (Did you check if your GPU is compatible and drivers are alright?). You could try converting the image into another format and upscaling again. Also make sure that the output path is correct and you have the proper write permissions for the directory. If not, then unfortuantely there's not much we can do to help, sorry."
        );
        resetImagePaths();
      } else if (data.includes("uncaughtException")) {
        alert(
          "Upscayl encountered an error. Possibly, the upscayl binary failed to execute the commands properly. Try checking the logs to see if you get any information. You can post an issue on Upscayl's GitHub repository for more help."
        );
        resetImagePaths();
      }
    };

    // BACKGROUND REMOVING DONE
    window.electron.on(commands.REMMOVEBG_DONE, (_, data: string) => {
      setProgress("");
      setRemoveBgOfImagePath(data);
      // addToLog(data);
    });

    // 批处理背景移除并且下载完成 重新指定文件目录（移除背景后的rmbg目录）
    window.electron.on(commands.REMMOVEBATCHBG_DONE, (_, data: string) => {
      setProgress("");
      setBatchFolderPath(data);
    });

    window.electron.on(commands.GENERATIVE_IMAGE_BACKGROUND_DONE, (_, data: string) => {
      setProgress("");
      setGenerativeImagePath(data);
      // 创建新的文件夹存放
      // setOutputPath(data + "_generativeBG");
      // addToLog(data);
    });

    // UPSCAYL PROGRESS
    window.electron.on(commands.UPSCAYL_PROGRESS, (_, data: string) => {
      if (data.length > 0 && data.length < 10) {
        setProgress(data);
      }
      handleErrors(data);
      logit(`📢 UPSCAYL_PROGRESS: `, data);
    });

    // FOLDER UPSCAYL PROGRESS
    window.electron.on(commands.FOLDER_UPSCAYL_PROGRESS, (_, data: string) => {
      if (data.length > 0 && data.length < 10) {
        setProgress(data);
      }
      handleErrors(data);
      logit(`📢 FOLDER_UPSCAYL_PROGRESS: `, data);
    });

    // DOUBLE UPSCAYL PROGRESS
    window.electron.on(commands.DOUBLE_UPSCAYL_PROGRESS, (_, data: string) => {
      if (data.length > 0 && data.length < 10) {
        if (data === "0.00%") {
          setDoubleUpscaylCounter(doubleUpscaylCounter + 1);
        }
        setProgress(data);
      }
      handleErrors(data);
      logit(`📢 DOUBLE_UPSCAYL_PROGRESS: `, data);
    });

    // VIDEO UPSCAYL PROGRESS
    window.electron.on(commands.UPSCAYL_VIDEO_PROGRESS, (_, data: string) => {
      if (data.length > 0 && data.length < 10) {
        setProgress(data);
      }
      handleErrors(data);
      logit(`📢 UPSCAYL_VIDEO_PROGRESS: `, data);
    });

    // UPSCAYL DONE
    window.electron.on(commands.UPSCAYL_DONE, (_, data: string) => { 
      setProgress("");
      setUpscaledImagePath(data);
      logit("upscaledImagePath: ", upscaledImagePath);
      logit(`📢 UPSCAYL_DONE: `, data);
    });

    // FOLDER UPSCAYL DONE
    window.electron.on(commands.FOLDER_UPSCAYL_DONE, (_, data: string) => {
      setProgress("");
      setUpscaledBatchFolderPath(data);
      logit(`📢 FOLDER_UPSCAYL_DONE: `, data);
    });

    // DOUBLE UPSCAYL DONE
    window.electron.on(commands.DOUBLE_UPSCAYL_DONE, (_, data: string) => {
      setProgress("");
      setDoubleUpscaylCounter(0);
      setUpscaledImagePath(data);
      logit(`📢 DOUBLE_UPSCAYL_DONE: `, data);
    });

    // VIDEO UPSCAYL DONE
    window.electron.on(commands.UPSCAYL_VIDEO_DONE, (_, data: string) => {
      setProgress("");
      setUpscaledVideoPath(data);
      logit(`📢 UPSCAYL_VIDEO_DONE: `, data);
    });

    // CUSTOM FOLDER LISTENER
    window.electron.on(
      commands.CUSTOM_MODEL_FILES_LIST,
      (_, data: string[]) => {
        logit(`📢 CUSTOM_MODEL_FILES_LIST: `, data);
        const newModelOptions = data.map((model) => {
          return {
            value: model,
            label: model,
          };
        });

        // Add newModelsList to modelOptions and remove duplicates
        const combinedModelOptions = [...modelOptions, ...newModelOptions];
        const uniqueModelOptions = combinedModelOptions.filter(
          // Check if any model in the array appears more than once
          (model, index, array) =>
            array.findIndex((t) => t.value === model.value) === index
        );
        setModelOptions(uniqueModelOptions);
      }
    );

  //   // CLOSE WINDOW EVENTS LISTENER
  //   window.electron.on(commands.CLOSE_ALL_WINDOWS, (_, data: string) => {
  //     logit("READY TO EXIT AND RESET ALL COMPONENTS", data);
  //     resetImagePaths();
  //     resetSelectedComponentStatus();

  //   });
  }, []);

  useEffect(() => {
    const customModelsPath = JSON.parse(
      localStorage.getItem("customModelsPath")
    );

    if (customModelsPath !== null) {
      window.electron.send(commands.GET_MODELS_LIST, customModelsPath);
      logit("📢 GET_MODELS_LIST: ", customModelsPath);
    }
  }, []);

  useEffect(() => {
    const rememberOutputFolder = localStorage.getItem("rememberOutputFolder");
    const lastOutputFolderPath = localStorage.getItem("lastOutputFolderPath");

    if (rememberOutputFolder === "true") {
      setOutputPath(lastOutputFolderPath);
    } else {
      setOutputPath("");
      localStorage.removeItem("lastOutputFolderPath");
    }
  }, []);

  useEffect(() => {
    setProgress("");
  }, [batchMode]);

  useEffect(() => {
    if (imagePath.length > 0 && !isVideo) {
      logit("📢 imagePath: ", imagePath);

      const extension = imagePath.toLocaleLowerCase().split(".").pop();
      logit("📢 Extension: ", extension);

      if (!allowedFileTypes.includes(extension.toLowerCase())) {
        alert("Please select an image");
        resetImagePaths();
      }
    } else if (videoPath.length > 0 && isVideo) {
      const filePath = videoPath;

      const extension = videoPath.toLocaleLowerCase().split(".").pop();

      if (!allowedVideoFileTypes.includes(extension.toLowerCase())) {
        alert("Please select an MP4, WebM or MKV video");
        resetImagePaths();
      }
    } else {
      resetImagePaths();
    }
  }, [imagePath, videoPath]);

  const resetImagePaths = () => {
    logit("📢 Resetting image paths");

    setDimensions({
      width: null,
      height: null,
    });

    setProgress("");

    SetImagePath("");
    setRemoveBgOfImagePath("");
    setUpscaledImagePath("");

    setBatchFolderPath("");
    setUpscaledBatchFolderPath("");

    setVideoPath("");
    setUpscaledVideoPath("");
  };

  // const resetSelectedComponentStatus = () => {
  //   logit("退出窗口APP总是批处理关闭");
  //   setBatchMode(false);
  // }

  // HANDLERS
  const handleMouseMove = useCallback((e: any) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  }, []);

  // const selectVideoHandler = async () => {
  //   resetImagePaths();

  //   var path = await window.electron.invoke(commands.SELECT_FILE);

  //   if (path !== "cancelled") {
  //     setVideoPath(path);
  //     var dirname = path.match(/(.*)[\/\\]/)[1] || "";
  //     setOutputPath(dirname);
  //   }
  // };

  const selectImageHandler = async () => {
    resetImagePaths();

    var path = await window.electron.invoke(commands.SELECT_FILE);

    if (path !== null) {
      logit("📢 Selected Image Path: ", path);
      SetImagePath(path);
      var dirname = path.match(/(.*)[\/\\]/)[1] || "";
      logit("📢 Selected Image Directory: ", dirname);
      // 在选择Image素材后设置好存储的目录
      setOutputPath(dirname);
    }
  };

  const selectFolderHandler = async () => {
    resetImagePaths();

    var path = await window.electron.invoke(commands.SELECT_FOLDER);

    if (path !== null) {
      logit("📢 Selected Folder Path: ", path);
      setBatchFolderPath(path);
      setOutputPath(path + "_output");
    } else {
      logit("📢 Folder selection cancelled");
      setBatchFolderPath("");
      setOutputPath("");
    }
  };

  // ? What's this for
  // const imageLoadHandler = ({ target: img }) => {
  //   const image = img;
  //   console.log("imageLoadHandler", {
  //     image,
  //   });
  // };

  const handleModelChange = (e: any) => {
    setModel(e.value);
    logit("📢 Model changed: ", e.value);
    localStorage.setItem(
      "model",
      JSON.stringify({ label: e.label, value: e.value })
    );
  };

  // DRAG AND DROP HANDLERS
  const handleDragEnter = (e) => {
    e.preventDefault();
    console.log("drag enter");
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    console.log("drag leave");
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    console.log("drag over");
  };

  const openFolderHandler = (e) => {
    logit("📢 OPEN_FOLDER: ", upscaledBatchFolderPath);
    window.electron.send(commands.OPEN_FOLDER, upscaledBatchFolderPath);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    resetImagePaths();

    if (
      e.dataTransfer.items.length === 0 ||
      e.dataTransfer.files.length === 0
    ) {
      logit("📢 No valid files dropped");
      alert("Please drag and drop an image");
      return;
    }

    const type = e.dataTransfer.items[0].type;
    const filePath = e.dataTransfer.files[0].path;
    const extension = e.dataTransfer.files[0].name.split(".").at(-1);
    logit("📢 Dropped file: ", JSON.stringify({ type, filePath, extension }));

    if (
      (!type.includes("image") && !type.includes("video")) ||
      (!allowedFileTypes.includes(extension.toLowerCase()) &&
        !allowedVideoFileTypes.includes(extension.toLowerCase()))
    ) {
      logit("📢 Invalid file dropped");
      alert("Please drag and drop an image");
    } else {
      if (isVideo) {
        setVideoPath(filePath);
      } else {
        logit("📢 Setting image path: ", filePath);
        SetImagePath(filePath);
      }

      var dirname = filePath.match(/(.*)[\/\\]/)[1] || "";
      logit("📢 Setting output path: ", dirname);
      setOutputPath(dirname);
    }
  };

  //处理粘贴事件
  const handlePaste = (e) => {
    resetImagePaths();
    e.preventDefault();

    console.log("e.clipboardData: ",e.clipboardData);

    const type = e.clipboardData.items[0].type;
    const filePath = e.clipboardData.files[0].path;
    const extension = e.clipboardData.files[0].name.split(".").at(-1);

    logit("📋 Pasted file: ", JSON.stringify({ type, filePath, extension }));

    if (
      !type.includes("image") &&
      !allowedFileTypes.includes(extension.toLowerCase())
    ) {
      alert("Please drag and drop an image");
    } else {
      SetImagePath(filePath);
      var dirname = filePath.match(/(.*)[\/\\]/)[1] || "";
      logit("🗂 Setting output path: ", dirname);
      setOutputPath(dirname);
    }
  };

  const outputHandler = async () => {
    var path = await window.electron.invoke(commands.SELECT_FOLDER);
    if (path !== null) {
      logit("📢 Setting Output Path: ", path);
      setOutputPath(path);

      const rememberOutputFolder = localStorage.getItem("rememberOutputFolder");

      if (rememberOutputFolder) {
        logit("📢 Remembering Output Folder: ", path);
        localStorage.setItem("lastOutputFolderPath", path);
      }
    } else {
      setOutputPath("");
    }
  };

  const bgRemoveHandler = async () => {
    if (isVideo) {
      setRemovebgOfVideoPath("");
    } else {
      setRemoveBgOfImagePath("");
    }

    if (!isVideo && (imagePath !== "" || batchFolderPath !== "")) {
      setProgress("Waiting a minute....");
      //在处理过程中传递的逻辑
      if(batchMode){
        window.electron.send(commands.FOLDER_REMOVE_BACKGROUND, {
          batchFolderPath,
          outputPath,
          saveImageAs,
        });
      } else{
        window.electron.send(commands.REMOVE_BACKGROUND, {
          imagePath,
          outputPath,
          saveImageAs,
        });
      }
    } else{
      logit(`📢 No valid material to process`);
      alert(`Please select ${isVideo ? "a video" : "an image"} to rm Bg`);
    }
  };

  const upscaylHandler = async () => {
    if (isVideo) {
      setUpscaledVideoPath("");
    } else {
      logit("📢 Resetting Upscaled Image Path");
      setUpscaledImagePath("");
    }

    if (!isVideo && (imagePath !== "" || removebgOfImagePath !== "" || batchFolderPath !== "")) {
      setProgress("Hold on...");

      if (doubleUpscayl) {
        window.electron.send(commands.DOUBLE_UPSCAYL, {
          imagePath: removebgOfImagePath.length > 0 ? removebgOfImagePath : imagePath,
          outputPath,
          model,
          gpuId: gpuId.length === 0 ? null : gpuId,
          saveImageAs,
          scale,
        });
        logit("📢 DOUBLE_UPSCAYL");
      } else if (batchMode) {
        setDoubleUpscayl(false);
        window.electron.send(commands.FOLDER_UPSCAYL, {
          scaleFactor,
          batchFolderPath,
          outputPath,
          model,
          gpuId: gpuId.length === 0 ? null : gpuId,
          saveImageAs,
          scale,
        });
        logit("📢 FOLDER_UPSCAYL");
      } else {
        window.electron.send(commands.UPSCAYL, {
          scaleFactor,
          imagePath: removebgOfImagePath.length > 0 ? removebgOfImagePath : imagePath,
          outputPath,
          model,
          gpuId: gpuId.length === 0 ? null : gpuId,
          saveImageAs,
          scale,
        });
        logit("📢 UPSCAYL");
      }
    }
    // else if (isVideo && videoPath !== "") {
    // window.electron.send(commands.UPSCAYL_VIDEO, {
    //   scaleFactor,
    //   videoPath,
    //   outputPath,
    //   model,
    //   gpuId: gpuId.length === 0 ? null : gpuId,
    //   saveImageAs,
    // });
    // }
    else {
      alert(`Please select ${isVideo ? "a video" : "an image"} to upscale`);
      logit("📢 No valid image selected");
    }
  };

// ------------------------------生成式函数开关----------------------------------- 
 const addConcept = () => {
    logit("📢 Add concept to generate");

    // add concept的逻辑
    setPrompt(concept);
    localStorage.setItem("prompt", prompt);

    // 局部生成的词不接受','分隔符的输入，这与背景生成有很大的不同
    if(concept.indexOf(',') < 0 && (segaConcept1 === "" || segaConcept2 === "")){
      if(segaConcept1 === "")
        setSEGAConcept1(concept)
      else 
        setSEGAConcept2(concept)
    }
    
  };

  const removeConcept = () => {
    logit("📢 Remove concept to generate");

    //remove concept的逻辑
    setNegativePrompt(concept);
    localStorage.setItem("negativePrompt", negativePrompt);

     // 局部生成的词不接受','分隔符的输入，这与背景生成有很大的不同
     if(concept.indexOf(',') < 0 && (segaConcept1 === "" || segaConcept2 === "")){
      if(segaConcept1 === "")
        setSEGAConcept1(concept)
      else
        setSEGAConcept2(concept)
    }
  };

  const setRandomizeSeed = () => {
    const min = Math.ceil(0);
    const max = Math.floor(Math.pow(2, 32)/2);
    return Math.floor(Math.random() * (max - min)) + min;
  }


  const generativeBgImageHandler = async () => {

    //在处理过程中传递的逻辑 ... 
    if(removebgOfImagePath !== "" && (prompt !== "" || negativePrompt !== "")){
      setProgress("Generating The IMAGE...");

      if (!batchMode) {
        //生成随机种子
        const seed = setRandomizeSeed();
        window.electron.send(commands.GENERATIVE_IMAGE_BACKGROUND, {
          imagePath: removebgOfImagePath,
          outputPath,
          prompt,
          negativePrompt,
          seed,
          saveImageAs,
        });

      } else {
        logit("📢 暂不支持对目录批处理背景生成 ");
      }
    }
    else {
      alert(`选择透明图和关键词生成背景！`);
    }
  }

  //生成局部内容，主要用于微调，可以ADD/DEL/REPLACE etc
  const generativePartialImageHandler = async () => {

    logit("📢 Generating Patrtial Content For Image");

    //在处理过程中传递的逻辑 ... 
    if(imagePath !== "" || batchFolderPath !== ""){
      setProgress("Generating Pritial Content...");

      //开启随机种子的能力
      //TODO: 后期需要矫正逻辑
      const seedEnabled = true;

      if (!batchMode) {
        window.electron.send(commands.GENERATIVE_PARTIAL_CONTENT, {
          // scaleFactor,
          imagePath: removebgOfImagePath.length > 0 ? removebgOfImagePath : imagePath,
          outputPath,
          prompt,
          negativePrompt,
          seedEnabled,
          // model,
          // gpuId: gpuId.length === 0 ? null : gpuId,
          saveImageAs,
          // scale,
        });
        logit("📢 GENERATIVE Partial Content Done!");
      } else {
        logit("📢 暂不支持对目录批处理局部内容生成 ");
      }
    }
    else {
      logit("📢 No valid image to process");
      alert(`选择${isVideo ? "视频素材" : "图片素材"}生成局部内容`);
    }
  }

  const stopHandler = () => {
    window.electron.send(commands.STOP);
    logit("📢 Stopping Upscayl");
    resetImagePaths();
  };

  const formatPath = (path) => {
    //USE REGEX TO GET THE FILENAME AND ENCODE IT INTO PROPER FORM IN ORDER TO AVOID ERRORS DUE TO SPECIAL CHARACTERS
    logit("📢 Formatting path: ", path);
    let res = path.replace(
      /([^/\\]+)$/i,
      encodeURIComponent(path.match(/[^/\\]+$/i)[0])
    );
    console.log("formatPath return ", res);
    return res
  };

  const allowedFileTypes = ["png", "jpg", "jpeg", "webp"];
  const allowedVideoFileTypes = ["webm", "mp4", "mkv"];

  return (
    <div className="flex h-screen w-screen flex-row overflow-hidden bg-base-300">
      <div className="flex h-screen w-128 flex-col rounded-r-3xl bg-base-100">
        {/* HEADER */}
        <Header version={version} />
        {/* Tab组件的layout布局实现，广泛用于菜单栏 */}
        <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        {/* <div className="flex items-center justify-center gap-2 pb-4 font-medium">
          <p>Image</p>
          <input
            type="radio"
            name="radio-1"
            className="radio"
            checked={!isVideo}
            onChange={() => {
              setIsVideo(false);
              console.log("isImage");
            }}
          />
          <input
            type="radio"
            name="radio-1"
            className="radio"
            checked={isVideo}
            onChange={() => {
              setIsVideo(true);
              console.log("isVideo");
            }}
          />
          <p>Video</p>
        </div> */}
        {/* LEFT PANE */}
        {/* {isVideo ? (
          <LeftPaneVideoSteps
            progress={progress}
            selectVideoHandler={selectVideoHandler}
            handleModelChange={handleModelChange}
            handleDrop={handleDrop}
            outputHandler={outputHandler}
            upscaylHandler={upscaylHandler}
            outputPath={outputPath}
            videoPath={videoPath}
            model={model}
            isVideo={isVideo}
            setIsVideo={setIsVideo}
          />
        ) : ( */}
        {selectedTab === 0 && (
          <LeftPaneImageSteps
            progress={progress}
            selectImageHandler={selectImageHandler}
            selectFolderHandler={selectFolderHandler}
            handleModelChange={handleModelChange}
            outputHandler={outputHandler}
            bgRemoveHandler={bgRemoveHandler}
            upscaylHandler={upscaylHandler}
            batchMode={batchMode}
            setBatchMode={setBatchMode}
            imagePath={imagePath}
            outputPath={outputPath}
            doubleUpscayl={doubleUpscayl}
            setDoubleUpscayl={setDoubleUpscayl}
            dimensions={dimensions}
            setGpuId={setGpuId}
            setModel={setModel}
            setSaveImageAs={setSaveImageAs}
          />
        )}

        {selectedTab === 1 && (
          <LeftPaneGenerativeImageSteps
            progress={progress}
            promptMode={promptMode}
            prompt={prompt}
            negativePrompt={negativePrompt}
            setPromptMode={setPromptMode}
            setPrompt={setPrompt}
            setNegativePrompt={setNegativePrompt}
            setRandomizeSeed={setRandomizeSeed}
            generativeBgImageHandler={generativeBgImageHandler}
            generativePartialImageHandler={generativePartialImageHandler}
            imagePath={imagePath}
            outputPath={outputPath}
            dimensions={dimensions}
            setRandomSeedSwitch={setRandomSeedSwitch}
            seedSwitch={seedSwitch}
            setSEGAConcept1={setSEGAConcept1}
            setSEGAConcept2={setSEGAConcept2}
            segaConcept1={segaConcept1}
            segaConcept2={segaConcept2}
            setClassifiedType1={setClassifiedType1}
            setClassifiedType2={setClassifiedType2}
            classifiedType1={classifiedType1}
            classifiedType2={classifiedType2}
            setSegaConceptEffect1={setSegaConceptEffect1}
            setSegaConceptEffect2={setSegaConceptEffect2}
            segaConceptEffect1={segaConceptEffect1}
            segaConceptEffect2={segaConceptEffect2}
          />
        )}
        {selectedTab === 2 && (
          <SettingsTab
            progress={progress}
            selectImageHandler={selectImageHandler}
            selectFolderHandler={selectFolderHandler}
            handleModelChange={handleModelChange}
            handleDrop={handleDrop}
            outputHandler={outputHandler}
            upscaylHandler={upscaylHandler}
            batchMode={batchMode}
            setModel={setModel}
            gpuId={gpuId}
            setGpuId={setGpuId}
            saveImageAs={saveImageAs}
            setSaveImageAs={setSaveImageAs}
            logData={logData}
          />
        )}
        {/* )} */}
        <Footer />
      </div>

      {/* RIGHT PANE */}
      <div
        className="relative flex h-screen w-full flex-col items-center justify-center"
        onDrop={(e) => handleDrop(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDragEnter={(e) => handleDragEnter(e)}
        onDragLeave={(e) => handleDragLeave(e)}
        onPaste={(e) => handlePaste(e)}>
        {progress.length > 0 &&
        upscaledImagePath.length === 0 &&
        upscaledBatchFolderPath.length === 0 &&
        upscaledVideoPath.length === 0 ? (
          <ProgressBar
            progress={progress}
            doubleUpscaylCounter={doubleUpscaylCounter}
            stopHandler={stopHandler}
          />
        ) : null}

        {/* DEFAULT PANE INFO */}
        {((!isVideo &&
          !batchMode &&
          imagePath.length === 0 &&
          removebgOfImagePath.length === 0 &&
          upscaledImagePath.length === 0) ||
          (!isVideo &&
            batchMode &&
            batchFolderPath.length === 0 &&
            upscaledBatchFolderPath.length === 0) ||
          (isVideo &&
            videoPath.length === 0 &&
            upscaledVideoPath.length === 0)) && (
          <RightPaneInfo
            version={version}
            batchMode={batchMode}
            isVideo={isVideo}
          />
        )}

        {/* SHOW SELECTED IMAGE */}
        {!batchMode &&
          !isVideo &&
          removebgOfImagePath.length === 0 &&
          upscaledImagePath.length === 0 &&
          imagePath.length > 0 && (
            <>
              <ImageOptions
                zoomAmount={zoomAmount}
                setZoomAmount={setZoomAmount}
                resetImagePaths={resetImagePaths}
                hideZoomOptions={true}
              />
               <PromptOptions
                  promptMode={promptMode}
                  concept={concept}
                  typeofInput={typeofInput}
                  setPromptMode={setPromptMode}
                  setConcept={setConcept}
                  setTypeofInput={setTypeofInput}
                  addConcept={addConcept}
                  removeConcept={removeConcept}
                  hideZoomOptions={true}
              />
              <img
                src={
                  "file://" +
                  `${
                    upscaledImagePath
                      ? upscaledImagePath
                      : imagePath
                  }`
                }
                onLoad={(e: any) => {
                  setDimensions({
                    width: e.target.naturalWidth,
                    height: e.target.naturalHeight,
                  });
                }}
                draggable="false"
                alt=""
                className={`h-full w-full bg-[#1d1c23] object-contain`}
              />
            </>
          )}

        {/* BATCH UPSCALE SHOW SELECTED FOLDER */}
        {batchMode &&
          upscaledBatchFolderPath.length === 0 &&
          batchFolderPath.length > 0 && (
            <p className="select-none font-bold text-neutral-50">
              Selected folder: {batchFolderPath}
            </p>
          )}

        {/* BATCH UPSCALE DONE INFO */}
        {batchMode && upscaledBatchFolderPath.length > 0 && (
          <>
            <p className="select-none py-4 font-bold text-neutral-50">
              All done!
            </p>
            <button
              className="bg-gradient-blue rounded-lg p-3 font-medium text-white/90 transition-colors"
              onClick={openFolderHandler}>
              Open Upscayled Folder
            </button>
          </>
        )}

        {/* COMPARISON SLIDER FOR ORIGINAL OR BGREMOVE*/}
        {!batchMode &&
          !isVideo &&
          imagePath.length > 0 &&
          removebgOfImagePath.length > 0 &&
          generativeImagePath.length === 0 &&
          upscaledImagePath.length === 0 && (
            <>
              <ImageOptions
                zoomAmount={zoomAmount}
                setZoomAmount={setZoomAmount}
                resetImagePaths={resetImagePaths}
              />
               <PromptOptions
                  promptMode={promptMode}
                  concept={concept}
                  typeofInput={typeofInput}
                  // addConceptEvent={addConceptEvent}
                  setPromptMode={setPromptMode}
                  setConcept={setConcept}
                  setTypeofInput={setTypeofInput}
                  addConcept={addConcept}
                  removeConcept={removeConcept}
                  hideZoomOptions={true}
              />
              <ReactCompareSlider
                itemOne={
                  <>
                    <p className="absolute bottom-1 left-1 rounded-md bg-black p-1 text-sm font-medium text-white opacity-30">
                      Before
                    </p>

                    <img
                      src={"file://" + imagePath}
                      alt="Before"
                      onMouseMove={handleMouseMove}
                      style={{
                        objectFit: "contain",
                        backgroundPosition: "0% 0%",
                        transformOrigin: backgroundPosition,
                      }}
                      className={`h-full w-full bg-[#1d1c23] transition-transform group-hover:scale-[${zoomAmount}]`}
                    />
                  </>
                }
                itemTwo={
                  <>
                    <p className="absolute bottom-1 right-1 rounded-md bg-black p-1 text-sm font-medium text-white opacity-30">
                      After
                    </p>
                    <img
                      src={"file://" + removebgOfImagePath}
                      alt="After"
                      style={{
                        objectFit: "contain",
                        backgroundPosition: "0% 0%",
                        transformOrigin: backgroundPosition,
                      }}
                      onMouseMove={handleMouseMove}
                      className={`h-full w-full bg-[#1d1c23] transition-transform group-hover:scale-[${zoomAmount}]`}
                    />
                  </>
                }
                className="group h-screen"
              />
            </>
          )}

        {/* COMPARISON SLIDER FOR ORIGINAL AND GENERATIVE BG OF IMAGE*/}
        {!batchMode &&
          !isVideo &&
          removebgOfImagePath.length > 0 &&
          generativeImagePath.length > 0 && (
            <>
              <ImageOptions
                zoomAmount={zoomAmount}
                setZoomAmount={setZoomAmount}
                resetImagePaths={resetImagePaths}
              />
               <PromptOptions
                  promptMode={promptMode}
                  concept={concept}
                  typeofInput={typeofInput}
                  setPromptMode={setPromptMode}
                  setConcept={setConcept}
                  setTypeofInput={setTypeofInput}
                  addConcept={addConcept}
                  removeConcept={removeConcept}
                  hideZoomOptions={true}
              />
              <ReactCompareSlider
                itemOne={
                  <>
                    <p className="absolute bottom-1 left-1 rounded-md bg-black p-1 text-sm font-medium text-white opacity-30">
                      Before
                    </p>

                    <img
                      src={
                        "file://" + 
                        `${removebgOfImagePath ? removebgOfImagePath : imagePath}`
                      }
                      alt="Before"
                      onMouseMove={handleMouseMove}
                      style={{
                        objectFit: "contain",
                        backgroundPosition: "0% 0%",
                        transformOrigin: backgroundPosition,
                      }}
                      className={`h-full w-full bg-[#1d1c23] transition-transform group-hover:scale-[${zoomAmount}]`}
                    />
                  </>
                }
                itemTwo={
                  <>
                    <p className="absolute bottom-1 right-1 rounded-md bg-black p-1 text-sm font-medium text-white opacity-30">
                      After
                    </p>
                    <img
                      src={"file://" + generativeImagePath}
                      alt="After"
                      style={{
                        objectFit: "contain",
                        backgroundPosition: "0% 0%",
                        transformOrigin: backgroundPosition,
                      }}
                      onMouseMove={handleMouseMove}
                      className={`h-full w-full bg-[#1d1c23] transition-transform group-hover:scale-[${zoomAmount}]`}
                    />
                  </>
                }
                className="group h-screen"
              />
            </>
          )}

        {/* COMPARISON SLIDER FOR ORIGINAL AND UPSCAYL*/}
        {!batchMode &&
          !isVideo &&
          imagePath.length > 0 &&
          upscaledImagePath.length > 0 && (
            <>
              <ImageOptions
                zoomAmount={zoomAmount}
                setZoomAmount={setZoomAmount}
                resetImagePaths={resetImagePaths}
              />
               <PromptOptions
                  promptMode={promptMode}
                  concept={concept}
                  typeofInput={typeofInput}
                  setPromptMode={setPromptMode}
                  setConcept={setConcept}
                  setTypeofInput={setTypeofInput}
                  addConcept={addConcept}
                  removeConcept={removeConcept}
                  hideZoomOptions={true}
              />
              <ReactCompareSlider
                itemOne={
                  <>
                    <p className="absolute bottom-1 left-1 rounded-md bg-black p-1 text-sm font-medium text-white opacity-30">
                      Before
                    </p>

                    <img
                      src={
                        "file://" + 
                        `${removebgOfImagePath ? removebgOfImagePath : imagePath}`
                      }
                      alt="Before"
                      onMouseMove={handleMouseMove}
                      style={{
                        objectFit: "contain",
                        backgroundPosition: "0% 0%",
                        transformOrigin: backgroundPosition,
                      }}
                      className={`h-full w-full bg-[#1d1c23] transition-transform group-hover:scale-[${zoomAmount}]`}
                    />
                  </>
                }
                itemTwo={
                  <>
                    <p className="absolute bottom-1 right-1 rounded-md bg-black p-1 text-sm font-medium text-white opacity-30">
                      After
                    </p>
                    <img
                      src={"file://" + upscaledImagePath}
                      alt="After"
                      style={{
                        objectFit: "contain",
                        backgroundPosition: "0% 0%",
                        transformOrigin: backgroundPosition,
                      }}
                      onMouseMove={handleMouseMove}
                      className={`h-full w-full bg-[#1d1c23] transition-transform group-hover:scale-[${zoomAmount}]`}
                    />
                  </>
                }
                className="group h-screen"
              />
            </>
          )}

        {isVideo && videoPath.length > 0 && upscaledVideoPath.length === 0 && (
          <video autoPlay controls className="m-10 w-11/12 rounded-2xl">
            <source src={"file://" + videoPath} type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
};

export default Home;
