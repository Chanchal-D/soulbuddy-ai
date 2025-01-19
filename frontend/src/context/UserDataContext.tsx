import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserData {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  city: string;
  country: string;
  gender: string;
}

interface UserDataContextType {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}; 