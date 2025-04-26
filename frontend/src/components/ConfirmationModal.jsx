import React from 'react';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, type = 'default' }) => {
  if (!isOpen) return null;

  const getButtonColor = () => {
    switch (type) {
      case 'delete':
        return 'bg-red-500 hover:bg-red-600';
      case 'remove':
        return 'bg-orange-500 hover:bg-orange-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <span
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
          >
            Cancel
          </span>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded ${getButtonColor()}`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;