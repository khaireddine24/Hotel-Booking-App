import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RoomPagination from '../common/RoomPaginator';
import RoomFilter from '../common/RoomFilter';
import { getAllRooms } from '../utils/api';
import { Link } from 'react-router-dom';

const ListingRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(3);
  const [isLoading, setLoading] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await getAllRooms();
      setRooms(data);
      setFilteredRooms(data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (roomType) => {
    setSelectedRoomType(roomType);
    if (roomType === "") {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter(room => 
        room.roomType.toLowerCase() === roomType.toLowerCase()
      );
      setFilteredRooms(filtered);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  // Pagination logic
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const RoomCard = ({ room }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] mb-4">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3">
        <Link to={`/book-room/${room.id}`}>
          <img 
            src={`data:image/png;base64,${room.photo}` || "/api/placeholder/400/250"} 
            alt={room.roomType}
            className="w-full h-64 md:h-full object-cover"
          />
          </Link>
        </div>
        <div className="md:w-2/3 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-purple-600">
                {room.roomType}
              </h3>
              <div className="text-lg font-semibold text-amber-600">
                {room.roomPrice} TND / night
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              {room.description || "Some room information goes here for the guest to read"}
            </p>
          </div>
          <div className="flex justify-end">
            <Link to={`/book-room/${room.id}`} className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition-colors">
              View/Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
      <ToastContainer />
      
      <RoomFilter
        rooms={rooms}
        selectedRoomType={selectedRoomType}
        onFilterChange={handleFilterChange}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {currentRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>

          {totalPages > 0 && (
            <div className="mt-6">
              <RoomPagination
                pageCount={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListingRooms;