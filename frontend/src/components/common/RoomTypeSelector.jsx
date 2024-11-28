import React, { useEffect, useState } from 'react';
import { getRoomTypes } from '../utils/api';

const RoomTypeSelector = ({ value, onChange }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [showNewRoomTypeInput, setShowNewRoomTypeInput] = useState(false);
  const [newRoomType, setNewRoomType] = useState('');

  useEffect(() => {
    getRoomTypes().then((data) => {
      setRoomTypes(data);
    });
  }, []);

  const handleNewRoomTypeInputChange = (e) => {
    setNewRoomType(e.target.value);
  };

  const handleAddNewRoomType = () => {
    if (newRoomType) {
      onChange(newRoomType);
      setRoomTypes([...roomTypes, newRoomType]);
      setNewRoomType('');
      setShowNewRoomTypeInput(false);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="roomType" className="block font-medium mb-2">
        Room Type
      </label>
      <div className="relative">
        <select
          id="roomType"
          name="roomType"
          value={value}
          onChange={(e) => {
            if (e.target.value === 'Add New') {
              setShowNewRoomTypeInput(true);
            } else {
              onChange(e.target.value);
            }
          }}
          className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
        >
          <option value="">Select a room type</option>
          <option value="Add New">Add New</option>
          {roomTypes.map((roomType, index) => (
            <option key={index} value={roomType}>
              {roomType}
            </option>
          ))}
        </select>
        {showNewRoomTypeInput && (
          <div className="mt-2">
            <input
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              type="text"
              placeholder="Enter a new room type"
              value={newRoomType}
              onChange={handleNewRoomTypeInputChange}
            />
            <button
              type="button"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded mt-2"
              onClick={handleAddNewRoomType}
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomTypeSelector;