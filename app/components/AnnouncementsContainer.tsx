"use client"; 
import React from 'react';
import AnnouncementBar from './AnnouncementBar';
import { useAnnouncements } from '@/app/hooks/useAnnouncements';

const AnnouncementsContainer: React.FC = () => {
  const { announcements, isLoading, error, deleteAnnouncement } = useAnnouncements();

  if (isLoading) return null;
  if (error) return null;
  if (announcements.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="space-y-2">
        {announcements.map((announcement) => (
          <AnnouncementBar
            key={announcement.id}
            announcement={announcement}
            onClose={deleteAnnouncement}
          />
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsContainer;
