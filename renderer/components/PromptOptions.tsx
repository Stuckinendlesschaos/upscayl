import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { promptModeAtom } from "../atoms/userSettingsAtom";

const PromptOptions = ({
  promptMode,
  concept,
  typeofInput,
  setPromptMode,
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


  // checkbox 打开提示词时才能输入关键词   
  if(promptMode) {
    return (
      <div className="absolute bottom-1 right-1 rounded-btn collapse fixed bottom-1 z-50 m-2 backdrop-blur-lg">
      <input type="checkbox" className="peer" />
      {/* <div className="peer-checked:outline-title-none collapse-title bg-opacity-25 text-center text-sm font-semibold uppercase backdrop-blur-2xl peer-checked:bg-base-300 peer-checked:text-base-content"> */}
        <div className="outline-title peer-checked:outline-title-none collapse-title text-center text-sm font-semibold uppercase text-black mix-blend-difference outline-2 peer-checked:bg-base-300 peer-checked:text-base-content">
            关键词设置
        </div>
        <div className="collapse-content bg-base-100 text-base-content">
        <div className="flex max-h-96 flex-col justify-center gap-5 overflow-auto p-5">
             {/* CONCEPT INPUT */}
            <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Concept</p>
            <input
                type="text"
                placeholder="Type here"
                className="input-bordered input w-full max-w-xs"
                value={concept}
            />
            </div>

            {/* TYPEOF INPUT */}
            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Typeof</p>
                <select data-choose-theme className="select-primary select">
                <option value="custom">Custom</option>
                {availableTypeOf.map((TypeOf) => {
                  return (
                    <option value={TypeOf.value} key={TypeOf.value}>
                        {TypeOf.label.toLocaleUpperCase()}
                    </option>
            );
          })}
        </select>
      </div>
            <div className="flex flex-row items-center gap-2">
                <button className="btn-primary btn" onClick={addConcept}>
                    添加
                    </button>
                <button className="btn-primary btn" onClick={removeConcept}>
                    移除
                    </button>
            </div>
            
            </div>
        </div>
        </div>
    );
  }
};


const availableTypeOf = [
    { label: "custom", value: "custom" },
    { label: "style", value: "style" },
    { label: "object", value: "object" },
    { label: "faces", value: "faces" },
    
  ];

export default PromptOptions;
