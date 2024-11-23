import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Alert } from 'react-native';

interface AlertContextProps {
  showAlert: (title: string, message: string, onConfirm: () => void) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const showAlert = (title: string, message: string, onConfirm: () => void) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        { 
          text: 'OK',
          onPress: onConfirm
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};