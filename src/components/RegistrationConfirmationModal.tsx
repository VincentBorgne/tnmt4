import React from 'react';
import { CheckCircleIcon, XIcon } from 'lucide-react';
type RegistrationConfirmationModalProps = {
  onClose: () => void;
};
const RegistrationConfirmationModal = ({
  onClose
}: RegistrationConfirmationModalProps) => {
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-500">
          <XIcon className="h-5 w-5" />
        </button>
        <div className="flex items-center justify-center mb-4">
          <CheckCircleIcon className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
          Registration Submitted!
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-md border border-green-100">
            <p className="text-sm text-gray-700">
              Thanks for registering! You will receive an email with a payment
              link. Please proceed with payment as soon as possible.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-md border border-yellow-100">
            <p className="text-sm text-gray-700">
              Your registration is only valid when all payments are completed
              and both players are registered.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Note:</span> ScoreHub is collecting
              fees on behalf of the organizer.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <button onClick={onClose} className="w-full py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-black bg-[#C4E42E] hover:bg-[#b3d129] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4E42E]">
            Close
          </button>
        </div>
      </div>
    </div>;
};
export default RegistrationConfirmationModal;