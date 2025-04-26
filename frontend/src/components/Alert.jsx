import React from 'react';

const typeStyles = {
  success: {
    bg: 'bg-green-500 hover:bg-green-600',
    title: 'Success',
  },
  warning: {
    bg: 'bg-yellow-500 hover:bg-yellow-600',
    title: 'Warning',
  },
  error: {
    bg: 'bg-red-500 hover:bg-red-600',
    title: 'Error',
  },
  info: {
    bg: 'bg-blue-500 hover:bg-blue-600',
    title: 'Info',
  },
};

const Alert = ({ isOpen, type = 'info', title, message, onClose }) => {
  if (!isOpen) return null;

  const styles = typeStyles[type] || typeStyles.info;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4 text-gray-900">{title || styles.title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-white rounded ${styles.bg}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
