import React, { useState } from "react";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { cancelBooking, getBookingByConfirmationCode } from "../utils/api";
import ConfirmationDialog from "../common/ConfirmationDialog";

const FindBooking = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({
    id: "",
    bookingConfirmationCode: "",
    room: { id: "", roomType: "" },
    roomNumber: "",
    checkInDate: "",
    checkOutDate: "",
    guestFullName: "",
    guestEmail: "",
  });

  const emptyBookingInfo = {
    id: "",
    bookingConfirmationCode: "",
    room: { id: "", roomType: "" },
    roomNumber: "",
    checkInDate: "",
    checkOutDate: "",
    guestFullName: "",
    guestEmail: "",
  };

  const [isDeleted, setIsDeleted] = useState(false);
  const formatDate = (dateArray) => {
    if (Array.isArray(dateArray) && dateArray.length === 3) {
      return moment([dateArray[0], dateArray[1] - 1, dateArray[2]]).format("MMM D, YYYY");
    }
    return moment(dateArray).format("MMM D, YYYY");
  };

  const handleInputChange = (event) => {
    setConfirmationCode(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const data = await getBookingByConfirmationCode(confirmationCode);
      setBookingInfo(data);
      toast.success("Booking found successfully!");
    } catch (error) {
      setBookingInfo(emptyBookingInfo);
      if (error.response && error.response.status === 404) {
        toast.error(error.response.data.message);
      } else {
        toast.error("This code not found.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingCancellation = async () => {
    try {
      await cancelBooking(bookingInfo.id);
      setIsDeleted(true);
      setBookingInfo(emptyBookingInfo);
      setConfirmationCode("");
      toast.success("Booking has been cancelled successfully!");
    } catch (error) {
      toast.error("Failed to cancel the booking.");
    }
    setIsDialogOpen(false);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Find My Booking</h2>
        
        <form onSubmit={handleFormSubmit} className="mb-4">
          <div className="flex">
            <input
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={confirmationCode}
              onChange={handleInputChange}
              placeholder="Enter booking confirmation code"
              required
            />
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition duration-300"
            >
              Find Booking
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="text-center text-gray-600 animate-pulse">
            Finding your booking...
          </div>
        )}

        {bookingInfo.bookingConfirmationCode && !isLoading && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h3>
            
            <div className="space-y-2 text-gray-700">
              <p><span className="font-medium">Confirmation Code:</span> {bookingInfo.bookingConfirmationCode}</p>
              <p><span className="font-medium">Room Number:</span> {bookingInfo.room.id}</p>
              <p><span className="font-medium">Room Type:</span> {bookingInfo.room.roomType}</p>
              <p><span className="font-medium">Check-in Date:</span> {formatDate(bookingInfo.checkInDate)}</p>
              <p><span className="font-medium">Check-out Date:</span> {formatDate(bookingInfo.checkOutDate)}</p>
              <p><span className="font-medium">Full Name:</span> {bookingInfo.guestFullName}</p>
              <p><span className="font-medium">Email:</span> {bookingInfo.guestEmail}</p>
            </div>

            {!isDeleted && (
              <button
                onClick={openDialog}
                className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Cancel Booking
              </button>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onConfirm={handleBookingCancellation}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
      />
    </div>
  );
};

export default FindBooking;