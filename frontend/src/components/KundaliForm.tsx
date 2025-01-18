import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import Select from 'react-select';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { indianStates } from '../data/indianLocations';
import { useFormContext } from '../context/FormContext';

interface KundaliFormData {
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

interface KundaliFormProps {
  onSubmit: (data: KundaliFormData) => void;
  isLoading?: boolean;
}

// Create a dark theme for MUI components
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const customSelectStyles = {
  control: (base: any) => ({
    ...base,
    background: 'rgba(0, 0, 0, 0.5)',
    borderColor: '#4B5563',
    '&:hover': {
      borderColor: '#6B7280'
    },
    boxShadow: 'none',
    padding: '4px'
  }),
  menu: (base: any) => ({
    ...base,
    background: 'rgba(0, 0, 0, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '1px solid #4B5563',
    maxHeight: '200px'
  }),
  menuList: (base: any) => ({
    ...base,
    maxHeight: '200px',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(139, 92, 246, 0.5)',
      borderRadius: '4px',
      '&:hover': {
        background: 'rgba(139, 92, 246, 0.7)'
      }
    }
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? 'rgba(139, 92, 246, 0.5)' : 'transparent',
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(139, 92, 246, 0.3)'
    }
  }),
  singleValue: (base: any) => ({
    ...base,
    color: 'white'
  }),
  input: (base: any) => ({
    ...base,
    color: 'white'
  }),
  placeholder: (base: any) => ({
    ...base,
    color: '#9CA3AF'
  })
};

const KundaliForm: React.FC<KundaliFormProps> = ({ onSubmit, isLoading = false }) => {
  const { formData: savedFormData, updateFormData } = useFormContext();
  const [formData, setFormData] = useState<KundaliFormData>(savedFormData);
  const [selectedState, setSelectedState] = useState<any>(
    savedFormData.state ? indianStates.find(s => s.value === savedFormData.state) : null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [availableDistricts, setAvailableDistricts] = useState<any[]>([]);

  // Load saved district when component mounts
  useEffect(() => {
    if (selectedState && savedFormData.district) {
      const state = indianStates.find(s => s.value === selectedState.value);
      const districts = state?.districts || [];
      setAvailableDistricts(districts);
      const savedDistrict = districts.find(d => d.value === savedFormData.district);
      if (savedDistrict) {
        setSelectedDistrict(savedDistrict);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedState) {
      const state = indianStates.find(s => s.value === selectedState.value);
      setAvailableDistricts(state?.districts || []);
      setSelectedDistrict(null);
      setFormData(prev => ({
        ...prev,
        state: selectedState.value,
        district: ''
      }));
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      setFormData(prev => ({
        ...prev,
        district: selectedDistrict.value
      }));
    }
  }, [selectedDistrict]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData(formData); // Update shared context
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    setFormData(newFormData);
    updateFormData(newFormData); // Update shared context on every change
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input bg-black/50"
            required
          />
        </div>

        {/* Date and Time Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="birthDate" className="block text-white text-sm font-medium mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    day: date.getDate()
                  }));
                }}
                className="input bg-black/50 pr-10"
                required
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label htmlFor="birthTime" className="block text-white text-sm font-medium mb-2">
              Time of Birth
            </label>
            <ThemeProvider theme={darkTheme}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  value={dayjs().hour(formData.hour).minute(formData.minute)}
                  onChange={(newValue) => {
                    if (newValue) {
                      setFormData(prev => ({
                        ...prev,
                        hour: newValue.hour(),
                        minute: newValue.minute()
                      }));
                    }
                  }}
                  className="w-full"
                  slotProps={{
                    textField: {
                      className: 'input bg-black/50 w-full'
                    }
                  }}
                />
              </LocalizationProvider>
            </ThemeProvider>
          </div>
        </div>

        {/* Gender Field */}
        <div>
          <label htmlFor="gender" className="block text-white text-sm font-medium mb-2">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="input bg-black/50"
            required
          >
            <option value="">Select gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              State
            </label>
            <Select
              value={selectedState}
              onChange={setSelectedState}
              options={indianStates}
              styles={customSelectStyles}
              placeholder="Select state"
              className="text-black"
              isSearchable
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              District
            </label>
            <Select
              value={selectedDistrict}
              onChange={setSelectedDistrict}
              options={availableDistricts}
              styles={customSelectStyles}
              placeholder="Select district"
              className="text-black"
              isSearchable
              isDisabled={!selectedState}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn btn-primary flex items-center justify-center space-x-2"
        >
          <span className="text-lg">Discover Your Spiritual Journey</span>
          {isLoading && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          )}
        </button>
      </form>
    </div>
  );
};

export default KundaliForm; 