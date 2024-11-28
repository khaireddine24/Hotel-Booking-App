import React, { useState } from 'react';
import { addRoom } from '../utils/api';
import RoomTypeSelector from '../common/RoomTypeSelector';
import { toast } from 'react-toastify';

const AddRoom = ({ isOpen, onClose, onSuccess }) => {
  const [newRoom, setNewRoom] = useState({
    photo: null,
    roomType: '',
    roomPrice: ''
  });
  const [imagePreview, setImagePreview] = useState('');

  const handleInputChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    
    if (name === 'roomPrice') {
      if (!isNaN(value)) {
        value = parseInt(value);
      } else {
        value = '';
      }
    }
    setNewRoom({ ...newRoom, [name]: value });
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    if (image) {
      setNewRoom({ ...newRoom, photo: image });
      setImagePreview(URL.createObjectURL(image));
    }
  };

  const resetForm = () => {
    setNewRoom({
      photo: null,
      roomType: '',
      roomPrice: ''
    });
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newRoom.photo || !newRoom.roomType || !newRoom.roomPrice) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const success = await addRoom(newRoom.photo, newRoom.roomType, newRoom.roomPrice);
      if (success) {
        resetForm();
        toast.success('Room added successfully')
      } else {
        toast.error('Failed to add room');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add room');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-auto bg-gray-200 rounded-lg shadow-xl m-4">
        <div className="sticky top-0 bg-white px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Add New Room</h3>
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <RoomTypeSelector
                value={newRoom.roomType}
                onChange={(value) => setNewRoom({ ...newRoom, roomType: value })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="roomPrice" className="block font-medium">Room Price</label>
              <input
                type="number"
                id="roomPrice"
                name="roomPrice"
                value={newRoom.roomPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter room price"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="photo" className="block font-medium">Room Photo</label>
              <div className="flex flex-col gap-4">
                <label htmlFor="photo" className="block cursor-pointer w-full px-4 py-2 border border-gray-300 rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {newRoom.photo ? newRoom.photo.name : 'Choose Photo'}
                </label>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Room preview"
                      className="max-w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;