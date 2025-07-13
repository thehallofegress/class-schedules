"use client";
import React, { createContext, useContext, useState } from 'react';

interface EditContextType {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const EditContext = createContext<EditContextType>({
  isEditMode: false,
  setIsEditMode: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export const EditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <EditContext.Provider value={{ isEditMode, setIsEditMode, isAuthenticated, setIsAuthenticated }}>
      {children}
    </EditContext.Provider>
  );
};

export const useEdit = () => useContext(EditContext);
