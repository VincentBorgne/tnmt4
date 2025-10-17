import React from 'react';
import { XIcon } from 'lucide-react';
import jerseyImage from '../assets/Tmodels.jpeg'; // Update with your actual filename

const TshirtModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Tournament Jersey Design
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
            src={jerseyImage} 
            alt="Tournament jersey design" 
            className="w-full h-auto rounded-md" 
          />
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Material:</span> 100% Polyester,
              moisture-wicking fabric
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Features:</span> Breathable,
              quick-dry technology, tournament logo on front
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Sizing:</span> Standard unisex
              sizing. If between sizes, we recommend sizing up.
            </p>
          </div>
          <div className="mt-4 bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              Each participant receives one jersey included with registration.
              Additional jerseys can be purchased for RM 60 each.
            </p>
          </div>
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

export default TshirtModal;