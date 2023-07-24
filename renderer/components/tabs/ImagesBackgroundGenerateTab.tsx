import { useState, useEffect, useCallback } from 'react'
import commands from '../../../electron/commands'

interface IProps {
  imagePath: string
  selectImageHandler: () => Promise<void>
  addBackgroundHandler: (promptInfo) => Promise<void>
}

const ImagesBackgroundGenerateTab = ({
  imagePath,
  selectImageHandler,
  addBackgroundHandler
}: IProps) => {
  const [promptInfo, setPromptInfo] = useState({
    prompt: 'A beautiful sunset',
    negativePrompt: 'No palm trees',
    seed: 789645120
  })

  const onPromptChange = (e) => {
    const prompt = e.target.value
    setPromptInfo({ ...promptInfo, prompt })
  }

  const onNegativePromptChange = (e) => {
    const negativePrompt = e.target.value
    setPromptInfo({ ...promptInfo, negativePrompt })
  }

  const generateBackground = async () => {
    console.log('generateBackground ', promptInfo)
    addBackgroundHandler(promptInfo)
  }

  return (
    <div className="animate-step-in animate flex h-screen flex-col gap-7 overflow-y-auto overflow-x-hidden p-5">
      <div>
        <button className="mgr-10 btn btn-primary" onClick={selectImageHandler}>
          选择图片
        </button>
      </div>
      {
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">提示词:</p>
            <textarea
              value={promptInfo.prompt}
              className="input input-bordered w-full max-w-xs"
              onChange={onPromptChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">否定提示词:</p>
            <textarea
              value={promptInfo.negativePrompt}
              className="input input-bordered w-full max-w-xs"
              onChange={onNegativePromptChange}
            />
          </div>
        </div>
      }
      {
        <button
          className="btn btn-primary"
          onClick={generateBackground}
          disabled={imagePath == '' || promptInfo.prompt == ''}
        >
          生成背景
        </button>
      }
    </div>
  )
}

export default ImagesBackgroundGenerateTab
