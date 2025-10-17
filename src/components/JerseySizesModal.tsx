import React from 'react';
import { XIcon } from 'lucide-react';
const JerseySizesModal = ({
  onClose
}) => {
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Jersey Size Chart
          </h3>
          <button type="button" onClick={onClose} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chest (cm)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Length (cm)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  XS
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  86-91
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  66-69
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  S
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  91-96
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  69-71
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  M
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  96-101
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  71-74
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  L
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  101-106
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  74-76
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  XL
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  106-111
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  76-79
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  XXL
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  111-116
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  79-81
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Sizing Tips:</span> The jerseys have
              an athletic fit. If you prefer a looser fit or are between sizes,
              we recommend going up one size.
            </p>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" onClick={onClose} className="w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-4 py-2 bg-[#C4E42E] text-base font-medium text-black hover:bg-[#b3d129] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4E42E] sm:ml-3 sm:w-auto sm:text-sm">
            Close
          </button>
        </div>
      </div>
    </div>;
};
export default JerseySizesModal;