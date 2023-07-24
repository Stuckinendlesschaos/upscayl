import { useState, useEffect, useCallback } from 'react'
import { useAtom } from 'jotai'
import commands from '../../../electron/commands'
import { batchModeAtom, scaleAtom } from '../../atoms/userSettingsAtom'
import { logAtom } from '../../atoms/logAtom'
import {
  imagePathAtom,
  upscaledImagePathAtom,
  removeBgImagePathAtom,
  outputPathAtom,
  batchFolderPathAtom,
  upscaledBatchFolderPathAtom,
  videoPathAtom,
  upscaledVideoPathAtom,
  removeBgVideoPathAtom,
  isVideoAtom,
  progressAtom,
  dimensionsAtom
} from '../../atoms/filePathAtom'

import { allowedFileTypes, allowedVideoFileTypes } from '../../const/allowedTypes'

import Header from '../Header'
import Tabs from '../Tabs'
import LeftPaneImageSteps from '../LeftPaneImageSteps'
import SettingsTab from '../SettingsTab'
import ImagesEditTab from '../tabs/ImagesEditTab'
import ImagesBackgroundGenerateTab from '../tabs/ImagesBackgroundGenerateTab'
import Footer from '../Footer'

const LeftBar = () => {
  const [batchMode, setBatchMode] = useAtom(batchModeAtom)
  const [scale] = useAtom(scaleAtom)
  const [logData, setLogData] = useAtom(logAtom)
  const [imagePath, setImagePath] = useAtom(imagePathAtom)
  const [upscaledImagePath, setUpscaledImagePath] = useAtom(upscaledImagePathAtom)
  const [removeBgImagePath, setRemoveBgImagePath] = useAtom(removeBgImagePathAtom)
  const [outputPath, setOutputPath] = useAtom(outputPathAtom)
  const [batchFolderPath, setBatchFolderPath] = useAtom(batchFolderPathAtom)
  const [upscaledBatchFolderPath, setUpscaledBatchFolderPath] = useAtom(upscaledBatchFolderPathAtom)
  const [videoPath, setVideoPath] = useAtom(videoPathAtom)
  const [upscaledVideoPath, setUpscaledVideoPath] = useAtom(upscaledVideoPathAtom)
  const [removeBgVideoPath, setRemoveBgVideoPath] = useAtom(removeBgVideoPathAtom)
  const [isVideo] = useAtom(isVideoAtom)
  const [progress, setProgress] = useAtom(progressAtom)
  const [dimensions, setDimensions] = useAtom(dimensionsAtom)

  const [selectedTab, setSelectedTab] = useState(0)
  const [saveImageAs, setSaveImageAs] = useState('png')

  const [model, setModel] = useState('realesrgan-x4plus')
  const [gpuId, setGpuId] = useState('')
  const [doubleUpscayl, setDoubleUpscayl] = useState(false)
  const [scaleFactor] = useState(4)

  const selectImageHandler = async () => {
    resetImagePaths()
    var path = await window.electron.invoke(commands.SELECT_FILE)
    if (path !== null) {
      setImagePath(path)
      var dirname = path.match(/(.*)[\/\\]/)[1] || ''
      setOutputPath(dirname)
    }
  }

  const selectFolderHandler = async () => {
    resetImagePaths()
    var path = await window.electron.invoke(commands.SELECT_FOLDER)
    if (path !== null) {
      setBatchFolderPath(path)
      setOutputPath(path + 'Plus')
    } else {
      setBatchFolderPath('')
      setOutputPath('')
    }
  }

  const handleModelChange = (e: any) => {
    setModel(e.value)
    localStorage.setItem('model', JSON.stringify({ label: e.label, value: e.value }))
  }

  const outputHandler = async () => {
    var path = await window.electron.invoke(commands.SELECT_FOLDER)
    if (path !== null) {
      setOutputPath(path)
      const rememberOutputFolder = localStorage.getItem('rememberOutputFolder')
      if (rememberOutputFolder) {
        localStorage.setItem('lastOutputFolderPath', path)
      }
    } else {
      setOutputPath('')
    }
  }

  const bgRemoveHandler = async () => {
    if (isVideo) {
      setRemoveBgVideoPath('')
    } else {
      setRemoveBgImagePath('')
    }

    if (!isVideo && (imagePath !== '' || batchFolderPath !== '')) {
      setProgress('Waiting a minute....')
      //在处理过程中传递的逻辑
      if (batchMode) {
        await window.electron.send(commands.FOLDER_REMOVE_BACKGROUND, {
          batchFolderPath,
          outputPath,
          saveImageAs
        })
      } else {
        await window.electron.send(commands.REMOVE_BACKGROUND, {
          imagePath,
          outputPath,
          saveImageAs
        })
      }
    } else {
      alert(`Please select ${isVideo ? 'a video' : 'an image'} to rm Bg`)
    }
  }

  const addBackgroundHandler = async (promptInfo) => {
    setRemoveBgImagePath('')
    if (imagePath !== '') {
      setProgress('Waiting a minute....')
      await window.electron.send(commands.ADD_BG_DONE, {
        ...promptInfo,
        imagePath,
        outputPath,
        saveImageAs
      })
    } else {
      alert(`Please select ${isVideo ? 'a video' : 'an image'} to rm Bg`)
    }
  }

  const upscaylHandler = async () => {
    if (isVideo) {
      setUpscaledVideoPath('')
    } else {
      console.log(' Resetting Upscaled Image Path')
      setUpscaledImagePath('')
    }

    if (!isVideo && (imagePath !== '' || removeBgImagePath !== '' || batchFolderPath !== '')) {
      setProgress('Hold on...')

      if (doubleUpscayl) {
        await window.electron.send(commands.DOUBLE_UPSCAYL, {
          imagePath: removeBgImagePath.length > 0 ? removeBgImagePath : imagePath,
          outputPath,
          model,
          gpuId: gpuId.length === 0 ? null : gpuId,
          saveImageAs,
          scale
        })
        console.log('DOUBLE_UPSCAYL')
      } else if (batchMode) {
        setDoubleUpscayl(false)
        window.electron.send(commands.FOLDER_UPSCAYL, {
          scaleFactor,
          batchFolderPath,
          outputPath,
          model,
          gpuId: gpuId.length === 0 ? null : gpuId,
          saveImageAs,
          scale
        })
        console.log('FOLDER_UPSCAYL')
      } else {
        window.electron.send(commands.UPSCAYL, {
          scaleFactor,
          imagePath: removeBgImagePath.length > 0 ? removeBgImagePath : imagePath,
          outputPath,
          model,
          gpuId: gpuId.length === 0 ? null : gpuId,
          saveImageAs,
          scale
        })
        console.log('📢 UPSCAYL')
      }
    } else {
      alert(`Please select ${isVideo ? 'a video' : 'an image'} to upscale`)
    }
  }

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

  return (
    <div className="flex h-screen w-128 flex-col bg-base-100">
      <Header />
      <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

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
        <SettingsTab
          progress={progress}
          selectImageHandler={selectImageHandler}
          selectFolderHandler={selectFolderHandler}
          handleModelChange={handleModelChange}
          handleDrop={handleDrop}
          outputHandler={outputHandler}
          bgRemoveHandler={bgRemoveHandler}
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

      {selectedTab === 2 && (
        <ImagesEditTab
          selectImageHandler={selectImageHandler}
          imagePath={imagePath}
        ></ImagesEditTab>
      )}

      {selectedTab === 3 && (
        <ImagesBackgroundGenerateTab
          selectImageHandler={selectImageHandler}
          imagePath={imagePath}
          addBackgroundHandler={addBackgroundHandler}
        ></ImagesBackgroundGenerateTab>
      )}

      <Footer />
    </div>
  )
}

export default LeftBar
