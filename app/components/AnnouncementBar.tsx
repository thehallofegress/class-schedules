import React from 'react';
import { X } from 'lucide-react';
import { Announcement } from './types';

interface AnnouncementBarProps {
  announcement: Announcement;
  onClose: (id: string) => void;
}

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ announcement, onClose }) => {
  const bgColorMap = {
    info: 'bg-blue-100 border-blue-500',
    success: 'bg-green-100 border-green-500',
    warning: 'bg-yellow-100 border-yellow-500',
    error: 'bg-red-100 border-red-500'
  };

  const textColorMap = {
    info: 'text-blue-800',
    success: 'text-green-800',
    warning: 'text-yellow-800',
    error: 'text-red-800'
  };

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`px-4 py-3 mb-4 rounded-lg border-l-4 ${bgColorMap[announcement.type]}`}
    >
      <div className="flex justify-between items-start">
        {/* Preserve whitespace and line breaks in announcement message */}
        <div className={`flex-1 font-medium ${textColorMap[announcement.type]} whitespace-pre-wrap`}>  
          {announcement.message}
        </div>
        <button
          onClick={() => onClose(announcement.id)}
          className={`${textColorMap[announcement.type]} hover:bg-opacity-20 hover:bg-gray-200 p-1 rounded-full`}
        >
          <X size={16} />
        </button>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        有效期至: {formatExpiryDate(announcement.expires_at)}
      </div>
    </div>
  );
};

export default AnnouncementBar;
