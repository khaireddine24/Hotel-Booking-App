import React, { useState } from 'react';
import { PencilIcon, XCircle } from 'lucide-react';
import { updateRoom, getRoomById } from '../utils/api';
import { toast } from 'react-toastify';

const EditRoom = ({ room, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    photo: null,
    roomType: '',
    roomPrice: ''
  });
  const [imagePreview, setImagePreview] = useState('');

  const handleOpen = () => {
    setFormData({
      photo: null,
      roomType: room.roomType,
      roomPrice: room.roomPrice
    });
    setImagePreview(room.photo);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setFormData({ ...formData, photo: selectedImage });
    setImagePreview(URL.createObjectURL(`data:image/png;base64,${selectedImage}`));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateRoom(room.id, formData);
      if (response.status === 200) {
        toast.success("Room updated successfully");
        const updatedRoom = await getRoomById(room.id);
        onUpdate(updatedRoom);
        handleClose();
      } else {
        toast.error("Error updating room");
      }
    } catch (err) {
      toast.error("Failed to update room");
      console.error(err);
    }
  };

  if (!isOpen) {
    return (
      <button
        className="rounded bg-yellow-50 p-2 text-yellow-600 hover:bg-yellow-100"
        onClick={handleOpen}
      >
        <PencilIcon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Edit Room</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Room Photo
            </label>
            <div className="mt-1 flex items-center space-x-4">
              {imagePreview && (
                <img
                  src={`data:image/png;base64,${imagePreview}`}
                  alt="Room preview"
                  className="h-32 w-32 rounded-lg object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Room Type
            </label>
            <input
              type="text"
              name="roomType"
              value={formData.roomType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Room Price
            </label>
            <input
              type="number"
              name="roomPrice"
              value={formData.roomPrice}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoom;