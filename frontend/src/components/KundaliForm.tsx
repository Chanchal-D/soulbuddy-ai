import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface KundaliFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const KundaliForm: React.FC<KundaliFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
    city: '',
    country: 'India',
    gender: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-black/20 backdrop-blur-lg rounded-3xl p-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gender Selection */}
          <div className="col-span-full">
            <label className="block text-white mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full p-3 bg-[#2a1f45] text-black rounded-xl border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            >
              <option value="" className="bg-black text-gray-400">Select Gender</option>
              <option value="M" className="bg-black text-white">Male</option>
              <option value="F" className="bg-black text-white">Female</option>
            </select>
          </div>

          {/* Date Fields */}
          <div>
            <label className="block text-white mb-2">Day</label>
            <input
              type="number"
              name="day"
              min="1"
              max="31"
              value={formData.day}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Month</label>
            <input
              type="number"
              name="month"
              min="1"
              max="12"
              value={formData.month}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Year</label>
            <input
              type="number"
              name="year"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.year}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Time Fields */}
          <div>
            <label className="block text-white mb-2">Hour (24-hour format)</label>
            <input
              type="number"
              name="hour"
              min="0"
              max="23"
              value={formData.hour}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Minute</label>
            <input
              type="number"
              name="minute"
              min="0"
              max="59"
              value={formData.minute}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Location Fields */}
          <div className="col-span-full">
            <label className="block text-white mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city of birth"
              className="input"
              required
            />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full md:w-auto"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="ml-2">Generating...</span>
              </div>
            ) : (
              'Generate Kundali'
            )}
          </button>
        </div>
      </div>
    </motion.form>
  );
};

export default KundaliForm; 