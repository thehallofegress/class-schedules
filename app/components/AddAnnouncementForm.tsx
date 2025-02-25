"use client";
import React, { useState, useEffect } from 'react';
import { useAnnouncements } from '@/app/hooks/useAnnouncements';
import { Announcement } from './types';

interface AddAnnouncementFormProps {
  existingAnnouncement?: Announcement | null;
  onSuccess?: () => void;
}

const AddAnnouncementForm: React.FC<AddAnnouncementFormProps> = ({ 
  existingAnnouncement = null,
  onSuccess 
}) => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const [expiresInDays, setExpiresInDays] = useState('7');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addAnnouncement, updateAnnouncement } = useAnnouncements();

  // Set form values when editing an existing announcement
  useEffect(() => {
    if (existingAnnouncement) {
      setMessage(existingAnnouncement.message);
      setType(existingAnnouncement.type as 'info' | 'success' | 'warning' | 'error');
      
      // Calculate days remaining for expiration
      const now = new Date();
      const expiryDate = new Date(existingAnnouncement.expires_at);
      const diffTime = expiryDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setExpiresInDays(diffDays > 0 ? String(diffDays) : '7');
    } else {
      // Reset form when not editing
      setMessage('');
      setType('info');
      setExpiresInDays('7');
    }
  }, [existingAnnouncement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || expiresInDays.trim() === '') return;
    
    try {
      setIsSubmitting(true);
      const days = parseInt(expiresInDays);
      const validDays = isNaN(days) ? 7 : days;

      if (existingAnnouncement) {
        // Update existing announcement

        await updateAnnouncement(
          existingAnnouncement.id,
          message,
          type,
          validDays
        );
      } else {
        // Add new announcement
        await addAnnouncement(message, type, validDays);
      }
      
      // Reset form
      setMessage('');
      setType('info');
      setExpiresInDays('7');
      
      // Call success callback if provided
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to save announcement:', error);
      alert('保存通知失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

    // Form is valid if message is not empty and days is not empty
const isFormValid = message.trim() !== '' && expiresInDays.trim() !== '';
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          通知信息
        </label>
        <textarea
          id="message"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            类型
          </label>
          <select
            id="type"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={type}
            onChange={(e) => setType(e.target.value as 'info' | 'success' | 'warning' | 'error')}
          >
            <option value="info">信息 (Information)</option>
            <option value="success">成功 (Success)</option>
            <option value="warning">警告 (Warning)</option>
            <option value="error">错误 (Error)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
            有效期 (天)
          </label>
          <input
            id="expiry"
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={1}
            max={365}
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(e.target.value)}
          />
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        disabled={isSubmitting || !isFormValid}
      >
        {isSubmitting ? '提交中...' : existingAnnouncement ? '更新通知' : '添加通知'}
      </button>
    </form>
  );
};

export default AddAnnouncementForm;
