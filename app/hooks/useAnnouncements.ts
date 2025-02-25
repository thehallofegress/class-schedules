"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Announcement } from '../components/types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [hiddenAnnouncementIds, setHiddenAnnouncementIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get visible announcements by filtering out hidden ones
  const visibleAnnouncements = useMemo(() => {
    return announcements.filter(announcement => !hiddenAnnouncementIds.has(announcement.id));
  }, [announcements, hiddenAnnouncementIds]);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const now = new Date().toISOString();
      
      // Fetch active announcements that haven't expired
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .gte('expires_at', now)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to load announcements');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hideAnnouncement = useCallback((id: string) => {
    // Update the set of hidden announcement IDs
    setHiddenAnnouncementIds(prev => new Set([...prev, id]));
    
    // Optionally, save this preference to localStorage to persist across sessions
    const existingHidden = JSON.parse(localStorage.getItem('hiddenAnnouncements') || '[]');
    localStorage.setItem('hiddenAnnouncements', JSON.stringify([...existingHidden, id]));
  }, []);

  const addAnnouncement = useCallback(async (
    message: string, 
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    expiresInDays: number = 7
  ) => {
    try {
      // Ensure expiresInDays is a valid number
      const safeDays = isNaN(expiresInDays) ? 7 : expiresInDays;
      
      const now = new Date();
      const expiryDate = new Date();
      expiryDate.setDate(now.getDate() + safeDays);

      const newAnnouncement = {
        message,
        type,
        expires_at: expiryDate.toISOString(),
        is_active: true
      };

      const { data, error } = await supabase
        .from('announcements')
        .insert(newAnnouncement)
        .select();

      if (error) throw error;
      
      // Refresh the announcements list
      fetchAnnouncements();
      
      return data;
    } catch (err) {
      console.error('Error adding announcement:', err);
      throw err;
    }
  }, [fetchAnnouncements]);

  const updateAnnouncement = useCallback(async (
    id: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    expiresInDays: number = 7
  ) => {
    try {
      // Ensure expiresInDays is a valid number
      const safeDays = isNaN(expiresInDays) ? 7 : expiresInDays;
      
      const now = new Date();
      const expiryDate = new Date();
      expiryDate.setDate(now.getDate() + safeDays);

      const updatedAnnouncement = {
        message,
        type,
        expires_at: expiryDate.toISOString(),
      };

      const { error } = await supabase
        .from('announcements')
        .update(updatedAnnouncement)
        .eq('id', id);

      if (error) throw error;
      
      // Refresh the announcements list
      fetchAnnouncements();
    } catch (err) {
      console.error('Error updating announcement:', err);
      throw err;
    }
  }, [fetchAnnouncements]);

  // For admin functionalities - soft deletion
  const deleteAnnouncement = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      
      // Refresh the announcements list
      fetchAnnouncements();
      
      // Also remove from hidden announcements if it was there
      setHiddenAnnouncementIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (err) {
      console.error('Error deleting announcement:', err);
      throw err;
    }
  }, [fetchAnnouncements]);

  // Load hidden announcements from localStorage on initial mount
  useEffect(() => {
    const loadHiddenAnnouncements = () => {
      try {
        const hiddenIds = JSON.parse(localStorage.getItem('hiddenAnnouncements') || '[]');
        setHiddenAnnouncementIds(new Set(hiddenIds));
      } catch (err) {
        console.error('Error loading hidden announcements:', err);
        // If there's an error, reset the localStorage
        localStorage.setItem('hiddenAnnouncements', '[]');
      }
    };
    
    loadHiddenAnnouncements();
  }, []);

  // Fetch announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return {
    announcements: visibleAnnouncements, // Return only visible announcements
    isLoading,
    error,
    fetchAnnouncements,
    hideAnnouncement, // Use this instead of deleteAnnouncement for user-facing UI
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement // Keep this for admin functionality
  };
};

export default useAnnouncements;
