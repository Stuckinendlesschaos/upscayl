import React from "react";

type TabsProps = {
  selectedTab: number;
  setSelectedTab: (tab: number) => void;
};

const Tabs = ({ selectedTab, setSelectedTab }: TabsProps) => {
  return (
    <div className="tabs tabs-boxed mx-auto mb-2">
      <a
        className={`tab ${selectedTab === 0 && "tab-active"}`}
        onClick={() => {
          setSelectedTab(0);
        }}>
        创建
      </a>
      <a
        className={`tab ${selectedTab === 1 && "tab-active"}`}
        onClick={() => {
          setSelectedTab(1);
        }}>
        设置
      </a>
      <a
        className={`tab ${selectedTab === 2 && "tab-active"}`}
        onClick={() => {
          setSelectedTab(2);
        }}>
        图片编辑
      </a>
    </div>
  );
};

export default Tabs;
