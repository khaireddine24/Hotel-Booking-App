import React from 'react';
import { XCircle } from 'lucide-react';

const ViewModal = ({ room, isOpen, onClose }) => {
  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative z-50 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Room Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Room Image */}
          {room.photo ? (
            <div className="flex justify-center">
              <img
                src={`data:image/png;base64,${room.photo}`}
                alt="Room"
                className="h-48 w-full rounded-lg object-cover"
              />
            </div>
          ) : (
            <p className="text-center text-gray-500">No image available</p>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-700">Room Type</h3>
            <p className="text-lg text-gray-900">{room.roomType}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700">Room Price</h3>
            <p className="text-lg text-gray-900">{room.roomPrice} TND</p>
          </div>

          {room.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">Description</h3>
              <p className="text-gray-600">{room.description}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
