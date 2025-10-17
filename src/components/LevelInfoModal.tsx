import React from 'react';
import { XIcon } from 'lucide-react';
import levelTableImage from '../assets/level-table.jpeg'; // Or .jpg, whatever your file is named

const LevelInfoModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Level Information
          </h3>
          <button 
            type="button" 
            onClick={onClose} 
            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="p-6">
          <img 
            src={levelTableImage} 
            alt="Level information table" 
            className="w-full h-auto" 
          />
          <p className="mt-4 text-sm text-gray-500">
            Please use this table to estimate your playing level. Consider your
            experience, technical skills, and previous tournament performances
            when making your selection.
          </p>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            onClick={onClose} 
            className="w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-4 py-2 bg-[#C4E42E] text-base font-medium text-black hover:bg-[#b3d129] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4E42E] sm:ml-3 sm:w-auto sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelInfoModal;