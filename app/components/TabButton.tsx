"use client";
import React from "react";

export enum TabEnum {
  Schedule = "schedule",
  Contact = "contact",
  Pricing = "pricing",
  Locations = "locations",
  Announcement = "announcement"
}

interface TabButtonProps {
  id: TabEnum;
  label: string;
  icon?: React.ReactNode;
  activeTab: TabEnum;
  setActiveTab: (tab: TabEnum) => void;
}

export const TabButton: React.FC<TabButtonProps> = ({ id, label, icon, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
      activeTab === id ? "bg-blue-600 text-white" : "hover:bg-gray-100"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);
 
export default TabButton;
