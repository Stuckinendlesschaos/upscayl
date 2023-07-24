import { useState, useEffect, useCallback } from 'react'
import { useAtom } from 'jotai'
import commands from '../../../electron/commands'
import { batchModeAtom, scaleAtom } from '../../atoms/userSettingsAtom'
import {
  imagePathAtom,
  upscaledImagePathAtom,
  removeBgImagePathAtom,
  outputPathAtom,
  batchFolderPathAtom,
  upscaledBatchFolderPathAtom,
  videoPathAtom,
  upscaledVideoPathAtom,
  isVideoAtom,
  progressAtom,
  dimensionsAtom
} from '../../atoms/filePathAtom'

import { allowedFileTypes, allowedVideoFileTypes } from '../../const/allowedTypes'
import ProgressBar from '../ProgressBar'
import RightPaneInfo from '../RightPaneInfo'
import ImageOptions from '../ImageOptions'
import { ReactCompareSlider } from 'react-compare-slider'

const RightPane = () => {
  const [batchMode, setBatchMode] = useAtom(batchModeAtom)
  const [scale] = useAtom(scaleAtom)

  const [imagePath, setImagePath] = useAtom(imagePathAtom)
  const [upscaledImagePath, setUpscaledImagePath] = useAtom(upscaledImagePathAtom)
  const [removeBgImagePath, setRemoveBgImagePath] = useAtom(removeBgImagePathAtom)
  const [outputPath, setOutputPath] = useAtom(outputPathAtom)
  const [batchFolderPath, setBatchFolderPath] = useAtom(batchFolderPathAtom)
  const [upscaledBatchFolderPath, setUpscaledBatchFolderPath] = useAtom(upscaledBatchFolderPathAtom)
  const [videoPath, setVideoPath] = useAtom(videoPathAtom)
  const [upscaledVideoPath, setUpscaledVideoPath] = useAtom(upscaledVideoPathAtom)
  const [isVideo] = useAtom(isVideoAtom)
  const [progress, setProgress] = useAtom(progressAtom)
  const [dimensions, setDimensions] = useAtom(dimensionsAtom)

  const [doubleUpscaylCounter, setDoubleUpscaylCounter] = useState(0)
  const [zoomAmount, setZoomAmount] = useState('100%')
  const [backgroundPosition, setBackgroundPosition] = useState('0% 0%')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)

    const handleErrors = (data: string) => {
      if (data.includes('invalid gpu')) {
        alert(
          'Error. Please make sure you have a Vulkan compatible GPU (Most modern GPUs support Vulkan). Upscayl does not work with CPU or iGPU sadly.'
        )
        resetImagePaths()
      } else if (data.includes('failed')) {
        if (batchMode) return
        alert(
          data.includes('encode')
            ? 'ENCODING ERROR => '
            : 'DECODING ERROR => ' +
                "This image is possibly corrupt or not supported by Upscayl, or your GPU drivers are acting funny (Did you check if your GPU is compatible and drivers are alright?). You could try converting the image into another format and upscaling again. Also make sure that the output path is correct and you have the proper write permissions for the directory. If not, then unfortuantely there's not much we can do to help, sorry."
        )
        resetImagePaths()
      } else if (data.includes('uncaughtException')) {
        alert(
          "Upscayl encountered an error. Possibly, the upscayl binary failed to execute the commands properly. Try checking the logs to see if you get any information. You can post an issue on Upscayl's GitHub repository for more help."
        )
        resetImagePaths()
      }
    }

    // BACKGROUND REMOVING DONE
    window.electron.on(commands.REMMOVEBG_DONE, (_, data: string) => {
      setProgress('')
      setRemoveBgImagePath(data)
      // addToLog(data);
    })

    window.electron.on(commands.ADD_BG_DONE, (_, data: string) => {
      setProgress('')
      setRemoveBgImagePath(data)
      // addToLog(data);
    })

    // 批处理背景移除并且下载完成 重新指定文件目录（移除背景后的rmbg目录）
    window.electron.on(commands.REMMOVEBATCHBG_DONE, (_, data: string) => {
      setProgress('')
      setBatchFolderPath(data)
      setOutputPath(data + 'Plus')
      // addToLog(data);
    })

    // UPSCAYL PROGRESS
    window.electron.on(commands.UPSCAYL_PROGRESS, (_, data: string) => {
      if (data.length > 0 && data.length < 10) {
        setProgress(data)
      }
      handleErrors(data)
    })

    // FOLDER UPSCAYL PROGRESS
    window.electron.on(commands.FOLDER_UPSCAYL_PROGRESS, (_, data: string) => {
      if (data.length > 0 && data.length < 10) {
        setProgress(data)
      }
      handleErrors(data)
    })

    // DOUBLE UPSCAYL PROGRESS
    window.electron.on(commands.DOUBLE_UPSCAYL_PROGRESS, (_, data: string) => {
      if (data.length > 0 && data.length < 10) {
        if (data === '0.00%') {
          setDoubleUpscaylCounter(doubleUpscaylCounter + 1)
        }
        setProgress(data)
      }
      handleErrors(data)
    })

    // VIDEO UPSCAYL PROGRESS
    window.electron.on(commands.UPSCAYL_VIDEO_PROGRESS, (_, data: string) => {
      if (data.length > 0 && data.length < 10) {
        setProgress(data)
      }
      handleErrors(data)
    })

    // UPSCAYL DONE
    window.electron.on(commands.UPSCAYL_DONE, (_, data: string) => {
      setProgress('')
      setUpscaledImagePath(data)
    })

    // FOLDER UPSCAYL DONE
    window.electron.on(commands.FOLDER_UPSCAYL_DONE, (_, data: string) => {
      setProgress('')
      setUpscaledBatchFolderPath(data)
    })

    // DOUBLE UPSCAYL DONE
    window.electron.on(commands.DOUBLE_UPSCAYL_DONE, (_, data: string) => {
      setProgress('')
      setDoubleUpscaylCounter(0)
      setUpscaledImagePath(data)
    })

    // VIDEO UPSCAYL DONE
    window.electron.on(commands.UPSCAYL_VIDEO_DONE, (_, data: string) => {
      setProgress('')
      setUpscaledVideoPath(data)
    })

    // CUSTOM FOLDER LISTENER
    window.electron.on(commands.CUSTOM_MODEL_FILES_LIST, (_, data: string[]) => {
      const newModelOptions = data.map((model) => {
        return {
          value: model,
          label: model
        }
      })

      // Add newModelsList to modelOptions and remove duplicates == todo
      // const combinedModelOptions = [...modelOptions, ...newModelOptions]
      // const uniqueModelOptions = combinedModelOptions.filter(
      //   (model, index, array) => array.findIndex((t) => t.value === model.value) === index
      // )
      // setModelOptions(uniqueModelOptions)
    })
  }, [])

  useEffect(() => {
    const customModelsPath = JSON.parse(localStorage.getItem('customModelsPath'))

    if (customModelsPath !== null) {
      window.electron.send(commands.GET_MODELS_LIST, customModelsPath)
    }
  }, [])

  useEffect(() => {
    const rememberOutputFolder = localStorage.getItem('rememberOutputFolder')
    const lastOutputFolderPath = localStorage.getItem('lastOutputFolderPath')

    if (rememberOutputFolder === 'true') {
      setOutputPath(lastOutputFolderPath)
    } else {
      setOutputPath('')
      localStorage.removeItem('lastOutputFolderPath')
    }
  }, [])

  useEffect(() => {
    setProgress('')
  }, [batchMode])

  useEffect(() => {
    if (imagePath.length > 0 && !isVideo) {
      const extension = imagePath.toLocaleLowerCase().split('.').pop()

      if (!allowedFileTypes.includes(extension.toLowerCase())) {
        alert('Please select an image')
        resetImagePaths()
      }
    } else if (videoPath.length > 0 && isVideo) {
      const filePath = videoPath

      const extension = videoPath.toLocaleLowerCase().split('.').pop()

      if (!allowedVideoFileTypes.includes(extension.toLowerCase())) {
        alert('Please select an MP4, WebM or MKV video')
        resetImagePaths()
      }
    } else {
      resetImagePaths()
    }
  }, [imagePath, videoPath])

  const handleDrop = (e) => {
    e.preventDefault()
    resetImagePaths()

    if (e.dataTransfer.items.length === 0 || e.dataTransfer.files.length === 0) {
      alert('Please drag and drop an image')
      return
    }
    const type = e.dataTransfer.items[0].type
    const filePath = e.dataTransfer.files[0].path
    const extension = e.dataTransfer.files[0].name.split('.').at(-1)
    if (
      (!type.includes('image') && !type.includes('video')) ||
      (!allowedFileTypes.includes(extension.toLowerCase()) &&
        !allowedVideoFileTypes.includes(extension.toLowerCase()))
    ) {
      alert('Please drag and drop an image')
    } else {
      if (isVideo) {
        setVideoPath(filePath)
      } else {
        setImagePath(filePath)
      }
      var dirname = filePath.match(/(.*)[\/\\]/)[1] || ''
      setOutputPath(dirname)
    }
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    console.log('drag enter')
  }
  const handleDragLeave = (e) => {
    e.preventDefault()
    console.log('drag leave')
  }
  const handleDragOver = (e) => {
    e.preventDefault()
    console.log('drag over')
  }
  const stopHandler = () => {
    window.electron.send(commands.STOP)
    resetImagePaths()
  }

  const handlePaste = (e) => {
    resetImagePaths()
    e.preventDefault()
    const type = e.clipboardData.items[0].type
    const filePath = e.clipboardData.files[0].path
    const extension = e.clipboardData.files[0].name.split('.').at(-1)
    if (!type.includes('image') && !allowedFileTypes.includes(extension.toLowerCase())) {
      alert('Please drag and drop an image')
    } else {
      setImagePath(filePath)
      var dirname = filePath.match(/(.*)[\/\\]/)[1] || ''
      setOutputPath(dirname)
    }
  }

  const openFolderHandler = (e) => {
    window.electron.send(commands.OPEN_FOLDER, upscaledBatchFolderPath)
  }

  const handleMouseMove = useCallback((e: any) => {
    const { left, top, width, height } = e.target.getBoundingClientRect()
    const x = ((e.pageX - left) / width) * 100
    const y = ((e.pageY - top) / height) * 100
    setBackgroundPosition(`${x}% ${y}%`)
  }, [])

  const resetImagePaths = () => {
    setDimensions({
      width: null,
      height: null
    })
    setProgress('')
    setImagePath('')
    setRemoveBgImagePath('')
    setUpscaledImagePath('')
    setBatchFolderPath('')
    setUpscaledBatchFolderPath('')
    setVideoPath('')
    setUpscaledVideoPath('')
  }

  return (
    <div
      className="relative flex h-screen w-full flex-col items-center justify-center"
      onDrop={(e) => handleDrop(e)}
      onDragOver={(e) => handleDragOver(e)}
      onDragEnter={(e) => handleDragEnter(e)}
      onDragLeave={(e) => handleDragLeave(e)}
      onPaste={(e) => handlePaste(e)}
    >
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
        removeBgImagePath.length === 0 &&
        upscaledImagePath.length === 0) ||
        (!isVideo &&
          batchMode &&
          batchFolderPath.length === 0 &&
          upscaledBatchFolderPath.length === 0) ||
        (isVideo && videoPath.length === 0 && upscaledVideoPath.length === 0)) && (
        <RightPaneInfo batchMode={batchMode} isVideo={isVideo} />
      )}

      {/* SHOW SELECTED IMAGE */}
      {!batchMode &&
        !isVideo &&
        removeBgImagePath.length === 0 &&
        upscaledImagePath.length === 0 &&
        imagePath.length > 0 && (
          <>
            <ImageOptions
              zoomAmount={zoomAmount}
              setZoomAmount={setZoomAmount}
              resetImagePaths={resetImagePaths}
              hideZoomOptions={true}
            />
            <img
              // src={
              //   "file://" +
              //   `${
              //     upscaledImagePath
              //       ? formatPath(upscaledImagePath)
              //       : formatPath(imagePath)
              //   }`
              // }
              src={'file://' + `${upscaledImagePath ? upscaledImagePath : imagePath}`}
              onLoad={(e: any) => {
                setDimensions({
                  width: e.target.naturalWidth,
                  height: e.target.naturalHeight
                })
              }}
              draggable="false"
              alt=""
              className={`h-full w-full bg-[#1d1c23] object-contain`}
            />
          </>
        )}

      {/* BATCH UPSCALE SHOW SELECTED FOLDER */}
      {batchMode && upscaledBatchFolderPath.length === 0 && batchFolderPath.length > 0 && (
        <p className="select-none font-bold text-neutral-50">Selected folder: {batchFolderPath}</p>
      )}

      {/* BATCH UPSCALE DONE INFO */}
      {batchMode && upscaledBatchFolderPath.length > 0 && (
        <>
          <p className="select-none py-4 font-bold text-neutral-50">All done!</p>
          <button
            className="bg-gradient-blue rounded-lg p-3 font-medium text-white/90 transition-colors"
            onClick={openFolderHandler}
          >
            Open Upscayled Folder
          </button>
        </>
      )}

      {/* COMPARISON SLIDER */}
      {!batchMode && !isVideo && imagePath.length > 0 && upscaledImagePath.length > 0 && (
        <>
          <ImageOptions
            zoomAmount={zoomAmount}
            setZoomAmount={setZoomAmount}
            resetImagePaths={resetImagePaths}
          />
          <ReactCompareSlider
            itemOne={
              <>
                <p className="absolute bottom-1 left-1 rounded-md bg-black p-1 text-sm font-medium text-white opacity-30">
                  Original
                </p>

                <img
                  src={'file://' + `${removeBgImagePath ? removeBgImagePath : imagePath}`}
                  // src={"file:///" + formatPath(imagePath)}
                  alt="Original"
                  onMouseMove={handleMouseMove}
                  style={{
                    objectFit: 'contain',
                    backgroundPosition: '0% 0%',
                    transformOrigin: backgroundPosition
                  }}
                  className={`h-full w-full bg-[#1d1c23] transition-transform group-hover:scale-[${zoomAmount}]`}
                />
              </>
            }
            itemTwo={
              <>
                <p className="absolute bottom-1 right-1 rounded-md bg-black p-1 text-sm font-medium text-white opacity-30">
                  Upscayled
                </p>
                <img
                  // src={"file://" + formatPath(upscaledImagePath)}
                  src={'file://' + upscaledImagePath}
                  alt="Upscayl"
                  style={{
                    objectFit: 'contain',
                    backgroundPosition: '0% 0%',
                    transformOrigin: backgroundPosition
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

      {/* COMPARISON SLIDER */}
      {!batchMode &&
        !isVideo &&
        imagePath.length > 0 &&
        removeBgImagePath.length > 0 &&
        upscaledImagePath.length === 0 && (
          <>
            <ImageOptions
              zoomAmount={zoomAmount}
              setZoomAmount={setZoomAmount}
              resetImagePaths={resetImagePaths}
            />
            <ReactCompareSlider
              itemOne={
                <>
                  <p className="absolute bottom-1 left-1 rounded-md bg-black p-1 text-sm font-medium text-white opacity-30">
                    Original
                  </p>

                  <img
                    src={'file://' + imagePath}
                    alt="Original"
                    onMouseMove={handleMouseMove}
                    style={{
                      objectFit: 'contain',
                      backgroundPosition: '0% 0%',
                      transformOrigin: backgroundPosition
                    }}
                    className={`h-full w-full bg-[#1d1c23] transition-transform group-hover:scale-[${zoomAmount}]`}
                  />
                </>
              }
              itemTwo={
                <>
                  <p className="absolute bottom-1 right-1 rounded-md bg-black p-1 text-sm font-medium text-white opacity-30">
                    BgRemoved
                  </p>
                  <img
                    src={'file://' + removeBgImagePath}
                    alt="BgRemoved"
                    style={{
                      objectFit: 'contain',
                      backgroundPosition: '0% 0%',
                      transformOrigin: backgroundPosition
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
          <source src={'file://' + videoPath} type="video/mp4" />
        </video>
      )}
    </div>
  )
}

export default RightPane
