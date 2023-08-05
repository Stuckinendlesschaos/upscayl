import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { promptModeAtom } from "../../atoms/userSettingsAtom";
// 使用开源的ant-design react组件
import {Space, Button, Select, Input} from "antd";
// ant-sedign 图标库
import { UpOutlined, DownOutlined } from '@ant-design/icons';

const PromptOptions = ({
  promptMode,
  concept,
  typeofInput,
  setPromptMode,
  setConcept,
  addConcept,
  removeConcept,
}: {
  promptMode: boolean;
  concept: string;
  typeofInput: string;
  setPromptMode: React.Dispatch<React.SetStateAction<boolean>>;
  setConcept: React.Dispatch<React.SetStateAction<string>>;
  setTypeofInput: React.Dispatch<React.SetStateAction<string>>;
  addConcept: () => void;
  removeConcept: () => void;
  hideZoomOptions?: boolean;
}) => {
    const [tempPromptMode, tempSetPromptMode] = useAtom(promptModeAtom);
    promptMode = tempPromptMode;
    setPromptMode = tempSetPromptMode;
    
    useEffect(() => {
        // if (!localStorage.getItem("zoomAmount")) {
        //   localStorage.setItem("zoomAmount", zoomAmount);
        // } else {
        //   setZoomAmount(localStorage.getItem("zoomAmount"));
        // }
    }, []);

    //处理Concept响应的函数
    const handleConceptChange = (e) => {
      setConcept(e.target.value);
      localStorage.setItem("concept", e.target.value);
    };

    // 处理TypeofInput响应的函数
    const handleTypeOfInputChange = (value: string) => {
      typeofInput = value;
      localStorage.setItem("typeofInput", value);
    }


  // checkbox 打开提示词时才能输入关键词   
  if(promptMode) {
    return (
      <div className="absolute bottom-1 rounded-btn collapse fixed bottom-1 z-50 m-2 backdrop-blur-lg">
        <Space.Compact block>
              {/* TYPEOFINPUT INPUT */}
              <Select
                style={{ width: 180 }} 
                defaultValue="自定义"
                options={
                  availableTypeOf.map((typeOfConcept) => ({
                    value: typeOfConcept.value,
                    label: typeOfConcept.label,
                  })
                )}
                onSelect={handleTypeOfInputChange}
              />
              {/* CONCEPT INPUT */}
              <Input placeholder="输入关键词" allowClear value={concept} onChange={handleConceptChange} />
                <Button type="primary" icon={<UpOutlined />} onClick={addConcept} ghost>
                    添加 
                    </Button>
                <Button type="primary" icon={<DownOutlined />} onClick={removeConcept} ghost>
                    移除
                    </Button>
          </Space.Compact>
          
          </div>
    );
  }
};


const availableTypeOf = [
    { label: "自定义", value: "custom" },
    { label: "风格", value: "style" },
    { label: "物体", value: "object" },
    { label: "脸", value: "faces" },
    
  ];

export default PromptOptions;
