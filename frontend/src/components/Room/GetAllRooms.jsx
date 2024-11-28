import React, { useEffect, useState } from 'react';
import { EyeIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { deleteRoom, getAllRooms } from '../utils/api';
import RoomFilter from '../common/RoomFilter';
import RoomPagination from '../common/RoomPaginator';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditRoom from './EditRoom';
import ViewModal from './ViewRoom';
import AddRoom from './AddRoom';
import ConfirmationDialog from '../common/ConfirmationDialog';
import Spinner from '../common/Spinner';

const GetAllRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(8);
  const [isLoading, setLoading] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  const handleViewClick = (room) => {
    setSelectedRoom(room);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedRoom(null);
  };

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

  const handleRoomUpdate = (updatedRoom) => {
    const updatedRooms = rooms.map(room => 
      room.id === updatedRoom.id ? updatedRoom : room
    );
    setRooms(updatedRooms);
    setFilteredRooms(
      selectedRoomType === "" 
        ? updatedRooms 
        : updatedRooms.filter(room => 
            room.roomType.toLowerCase() === selectedRoomType.toLowerCase()
          )
    );
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

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const handleDeleteClick = (room) => {
    setRoomToDelete(room);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteRoom(roomToDelete.id);
      if (!res) {
        toast.success("Room was deleted");
        fetchRooms();
      } else {
        toast.error("Failed to delete room");
      }
    } catch (err) {
      toast.error("An error occurred while deleting the room");
    } finally {
      setIsDeleteDialogOpen(false);
      setRoomToDelete(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 mt-20">
      <ToastContainer />
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Room Management</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Total Rooms: {filteredRooms.length}
          </span>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <PlusIcon className="h-5 w-5" />
            Add Room
          </button>
        </div>
      </div>

      <AddRoom 
        isOpen={isAddModalOpen} 
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => {
          setAddModalOpen(false);
          fetchRooms();
        }} 
      />

      <RoomFilter
        rooms={rooms}
        selectedRoomType={selectedRoomType}
        onFilterChange={handleFilterChange}
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Room ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Room Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {room.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {room.roomType}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {room.roomPrice}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button 
                          className="rounded bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                          onClick={() => handleViewClick(room)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <ViewModal 
                          room={selectedRoom} 
                          isOpen={isViewModalOpen} 
                          onClose={closeViewModal} 
                        />

                        <EditRoom room={room} onUpdate={handleRoomUpdate} />
                        <button 
                          className="rounded bg-red-50 p-2 text-red-600 hover:bg-red-100"
                          onClick={() => handleDeleteClick(room)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                        <ConfirmationDialog
                          isOpen={isDeleteDialogOpen}
                          onClose={() => setIsDeleteDialogOpen(false)}
                          onConfirm={handleConfirmDelete}
                          title="Confirm delete"
                          message="Are you sure you want to delete this room?"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <RoomPagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default GetAllRooms;