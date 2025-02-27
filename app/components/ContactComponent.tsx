// ContactComponent.tsx
"use client";
import React, { useState } from 'react';
import { PencilIcon, CheckIcon, XIcon } from 'lucide-react';
import { useEdit } from './EditContext';
import { ContactInfo } from './types';
import Image from "next/image";

interface ContactComponentProps {
  initialData: ContactInfo;
  onSave: (data: ContactInfo) => Promise<void>;
}

const ContactComponent: React.FC<ContactComponentProps> = ({ initialData, onSave }) => {
  const { isEditMode } = useEdit();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(initialData);

  const handleSave = async () => {
    try {
      await onSave(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving contact info:', error);
    }
  };

  if (isEditing && isEditMode) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">💬 联系方式</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
            >
              <XIcon size={20} />
            </button>
            <button
              onClick={handleSave}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
            >
              <CheckIcon size={20} />
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded">
            <input
              className="font-medium mb-2 w-full p-2 rounded border"
              value={editData.zoomInfo.title}
              onChange={(e) => setEditData({
                ...editData,
                zoomInfo: { ...editData.zoomInfo, title: e.target.value }
              })}
            />
            <div className="flex gap-2 items-center">
              <strong>Zoom 号:</strong>
              <input
                className="flex-1 p-2 rounded border"
                value={editData.zoomInfo.zoomId}
                onChange={(e) => setEditData({
                  ...editData,
                  zoomInfo: { ...editData.zoomInfo, zoomId: e.target.value }
                })}
              />
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded">
            <input
              className="font-medium mb-2 w-full p-2 rounded border"
              value={editData.teacherInfo.title}
              onChange={(e) => setEditData({
                ...editData,
                teacherInfo: { ...editData.teacherInfo, title: e.target.value }
              })}
            />
            <div className="flex gap-2 items-center">
              <input
                className="flex-1 p-2 rounded border"
                value={editData.teacherInfo.name}
                onChange={(e) => setEditData({
                  ...editData,
                  teacherInfo: { ...editData.teacherInfo, name: e.target.value }
                })}
              />
              <span>WeChat ID:</span>
              <input
                className="flex-1 p-2 rounded border"
                value={editData.teacherInfo.wechatId}
                onChange={(e) => setEditData({
                  ...editData,
                  teacherInfo: { ...editData.teacherInfo, wechatId: e.target.value }
                })}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow relative">
      <h2 className="text-xl font-bold mb-4">💬 联系方式</h2>
      {isEditMode && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-4 right-4 p-2 text-gray-600 hover:text-blue-600"
        >
          <PencilIcon size={16} />
        </button>
      )}
      <div className="space-y-4">
        {/* WeChat Info */}
        <div className="p-4 bg-green-50 rounded">
          <h3 className="font-medium mb-2">{editData.teacherInfo.title}</h3>
          {/* Image and Text on the Same Line */}
          <div className="flex items-center gap-2">
            <Image src="/wechat-logo.svg" alt="WeChat Logo" width={18} height={18} />
            <p><strong>微信号:</strong>{editData.teacherInfo.wechatId}</p>
          </div>
        </div>
        {/* Zoom Info */}
        <div className="p-4 bg-blue-50 rounded">
          <h3 className="font-medium mb-2">{editData.zoomInfo.title}</h3>

          {/* Image and Text on the Same Line */}
          <div className="flex items-center gap-2">
            <Image src="/zoom-logo.svg" alt="Zoom Logo" width={18} height={18} />
            <p>
              <strong>Zoom 号:</strong>
              <a href={editData.zoomInfo.zoomLink} className="text-blue-600 underline">
                {editData.zoomInfo.zoomId}
              </a>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ContactComponent;
