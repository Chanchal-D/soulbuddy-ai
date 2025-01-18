import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FormData {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: string;
  state: string;
  district: string;
}

const initialFormData: FormData = {
  name: '',
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate(),
  hour: new Date().getHours(),
  minute: new Date().getMinutes(),
  gender: '',
  state: '',
  district: ''
};

interface FormContextType {
  formData: FormData;
  updateFormData: (data: FormData) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateFormData = (data: FormData) => {
    setFormData(data);
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
} 