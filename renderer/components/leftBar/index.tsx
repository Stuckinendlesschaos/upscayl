import { useState, useEffect, useCallback } from 'react'
import commands from '../../../electron/commands'
import Header from '../Header'
import Tabs from '../Tabs'
import LeftPaneImageSteps from '../LeftPaneImageSteps'
import SettingsTab from '../SettingsTab'
import ImagesEditTab from '../tabs/ImagesEditTab'
import ImagesBackgroundGenerateTab from '../tabs/ImagesBackgroundGenerateTab'
import Footer from '../Footer'

const LeftBar = () => {
  // const [version, setVersion] = useState('0.0.1')
  // const [selectedTab, setSelectedTab] = useState(0)
  // const [progress, setProgress] = useState('')
  // const [saveImageAs, setSaveImageAs] = useState('png')
  // const [dimensions, setDimensions] = useState({
  //   width: null,
  //   height: null
  // })
  // const [imagePath, SetImagePath] = useState('')
  // const [upscaledImagePath, setUpscaledImagePath] = useState('')
  // const [removebgOfImagePath, setremovebgOfImagePath] = useState('')
  // const [outputPath, setOutputPath] = useState('')
  // const [batchFolderPath, setBatchFolderPath] = useState('')
  // const [rmbgBatchFolderPath, setRmbgBatchFolderPath] = useState('')
  // const [upscaledBatchFolderPath, setUpscaledBatchFolderPath] = useState('')
  // const [isVideo] = useState(false)
  // const [videoPath, setVideoPath] = useState('')
  // const [upscaledVideoPath, setUpscaledVideoPath] = useState('')
  // const [RemovebgOfVideoPath, setRemovebgOfVideoPath] = useState('')

  // // 初始化副作用函数
  // useEffect(() => {
  //   setVersion(require('../../../package.json').version)
  // }, [])

  // const selectImageHandler = async () => {
  //   resetImagePaths()

  //   var path = await window.electron.invoke(commands.SELECT_FILE)
  //   if (path !== null) {
  //     //   logit('📢 Selected Image Path: ', path)
  //     SetImagePath(path)
  //     var dirname = path.match(/(.*)[\/\\]/)[1] || ''
  //     //   logit('📢 Selected Image Directory: ', dirname)
  //     setOutputPath(dirname)
  //   }
  // }

  // const selectFolderHandler = async () => {
  //   resetImagePaths()

  //   var path = await window.electron.invoke(commands.SELECT_FOLDER)

  //   if (path !== null) {
  //     //   logit('📢 Selected Folder Path: ', path)
  //     setBatchFolderPath(path)
  //     setOutputPath(path + 'Plus')
  //   } else {
  //     //   logit('📢 Folder selection cancelled')
  //     setBatchFolderPath('')
  //     setOutputPath('')
  //   }
  // }

  // const resetImagePaths = () => {
  //   // logit('📢 Resetting image paths')

  //   setDimensions({
  //     width: null,
  //     height: null
  //   })

  //   setProgress('')

  //   SetImagePath('')
  //   setremovebgOfImagePath('')
  //   setUpscaledImagePath('')

  //   setBatchFolderPath('')
  //   setUpscaledBatchFolderPath('')

  //   setVideoPath('')
  //   setUpscaledVideoPath('')
  // }

  return (
    // <div className="flex h-screen w-128 flex-col bg-base-100">
    //   <Header version={version} />
    //   <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

    //   {selectedTab === 0 && (
    //     <LeftPaneImageSteps
    //       progress={progress}
    //       selectImageHandler={selectImageHandler}
    //       selectFolderHandler={selectFolderHandler}
    //       handleModelChange={handleModelChange}
    //       outputHandler={outputHandler}
    //       bgRemoveHandler={bgRemoveHandler}
    //       upscaylHandler={upscaylHandler}
    //       batchMode={batchMode}
    //       setBatchMode={setBatchMode}
    //       imagePath={imagePath}
    //       outputPath={outputPath}
    //       doubleUpscayl={doubleUpscayl}
    //       setDoubleUpscayl={setDoubleUpscayl}
    //       dimensions={dimensions}
    //       setGpuId={setGpuId}
    //       setModel={setModel}
    //       setSaveImageAs={setSaveImageAs}
    //     />

    //   )}

    //   {selectedTab === 1 && (
    //     <SettingsTab
    //       progress={progress}
    //       selectImageHandler={selectImageHandler}
    //       selectFolderHandler={selectFolderHandler}
    //       handleModelChange={handleModelChange}
    //       handleDrop={handleDrop}
    //       outputHandler={outputHandler}
    //       bgRemoveHandler={bgRemoveHandler}
    //       upscaylHandler={upscaylHandler}
    //       batchMode={batchMode}
    //       setModel={setModel}
    //       gpuId={gpuId}
    //       setGpuId={setGpuId}
    //       saveImageAs={saveImageAs}
    //       setSaveImageAs={setSaveImageAs}
    //       logData={logData}
    //     />
    //   )}

    //   {selectedTab === 2 && (
    //     <ImagesEditTab
    //       selectImageHandler={selectImageHandler}
    //       imagePath={imagePath}
    //     ></ImagesEditTab>
    //   )}
    //   {selectedTab === 3 && (
    //     <ImagesBackgroundGenerateTab
    //       selectImageHandler={selectImageHandler}
    //       imagePath={imagePath}
    //     ></ImagesBackgroundGenerateTab>
    //   )}

    //   <Footer />
    // </div>
    <></>
  )
}

export default LeftBar
