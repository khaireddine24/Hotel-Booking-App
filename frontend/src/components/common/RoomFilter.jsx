import React from 'react';

const RoomFilter = ({ rooms, selectedRoomType, onFilterChange }) => {
  const roomTypes = ["", ...new Set(rooms.map(room => room.roomType))];

  return (
    <div className="mb-6 flex items-center gap-4">
      <label className="text-md font-medium text-gray-700">
        Filter by room type:
      </label>
      <select
        value={selectedRoomType}
        onChange={(e) => onFilterChange(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">All Room Types</option>
        {roomTypes.filter(type => type).map((roomType, index) => (
          <option key={index} value={roomType}>
            {roomType}
          </option>
        ))}
      </select>
      {selectedRoomType && (
        <button
          onClick={() => onFilterChange("")}
          className="rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200"
        >
          Clear Filter
        </button>
      )}
    </div>
  );
};

export default RoomFilter;
