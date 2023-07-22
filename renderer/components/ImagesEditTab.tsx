import { useState, useEffect, useCallback } from 'react'
import commands from '../../electron/commands'

interface IProps {
  imagePath: string
  selectImageHandler: () => Promise<void>
}

function ImagesEditTab({ imagePath, selectImageHandler }: IProps) {
  const [imageInfo, setImageInfo] = useState('')
  const handleImageInfoChange = (e) => {
    const v = e.target.value
    setImageInfo(v)
    console.log('imageInfo >>> ', imageInfo)
  }

  const [conceptList, setConceptList] = useState([
    {
      value: '',
      type: 'custom'
    }
  ])
  const addConcept = async () => {
    setConceptList([...conceptList, { value: '', type: 'style' }])
    console.log('conceptList ', conceptList)
  }
  const delConcept = (index) => {
    const list = conceptList.filter((item, i) => i !== index)
    setConceptList(list)
  }

  function handleSelectChange(event, index) {
    const type = event.target.value
    const list = conceptList.map((item, i) => {
      if (index == i) {
        return { value: '', type: type }
      } else {
        return item
      }
    })
    setConceptList(list)
  }

  return (
    <div className="animate-step-in animate flex h-screen flex-col gap-7 overflow-y-auto p-5 overflow-x-hidden">
      <div>
        <button className="mgr-10 btn-primary btn" onClick={selectImageHandler}>
          选择图片
        </button>
        {imagePath && (
          <button
            className=" btn-primary btn"
            onClick={addConcept}
            disabled={conceptList.length == 3}
          >
            增加想法
          </button>
        )}
      </div>
      {imagePath && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">图片信息:</p>
          <textarea
            value={imageInfo}
            onChange={handleImageInfoChange}
            className="input-bordered input w-full max-w-xs"
          />
        </div>
      )}
      <div>
        {conceptList.map((item, index) => {
          return (
            <div className="flex flex-col gap-2" key={index}>
              <div className="text-sm font-medium">
                <p className="text-sm font-medium">类型：</p>
                <select
                  name=""
                  id=""
                  onChange={(event) => handleSelectChange(event, index)}
                  className="select-primary select"
                >
                  <option value="custom">custom</option>
                  <option value="style">style</option>
                  <option value="object">object</option>
                  <option value="faces">faces</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium"> 想法：</p>
                <input
                  type="text"
                  placeholder="增加想法"
                  itemID="item.value"
                  className="input-bordered input w-full max-w-xs"
                />
              </div>
              <div>
                <button className="mgr-10 btn-danger btn" onClick={() => delConcept(index)}>
                  删除想法
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ImagesEditTab
