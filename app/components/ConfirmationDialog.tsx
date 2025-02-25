"use client";
import React from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          confirmBg: 'bg-red-600 hover:bg-red-700',
          icon: '⚠️'
        };
      case 'warning':
        return {
          confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
          icon: '⚠️'
        };
      case 'info':
        return {
          confirmBg: 'bg-blue-600 hover:bg-blue-700',
          icon: 'ℹ️'
        };
      default:
        return {
          confirmBg: 'bg-red-600 hover:bg-red-700',
          icon: '⚠️'
        };
    }
  };

  const { confirmBg, icon } = getVariantStyles();

  // Close dialog when clicking outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{icon}</span>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-700 mb-4">{message}</p>
        </div>
        <div className="flex items-center px-6 py-3 bg-gray-50">
          <button
            className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 mr-2"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`px-4 py-2 rounded-md text-white ${confirmBg}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
