// BookingForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';
import BookingSummary from './BookingSummary';
import { Calendar, Mail, User, Users } from 'lucide-react';
import { getRoomById,bookRoom } from '../utils/api';

const BookingForm = () => {
  const [isValidated, setIsValidated] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [roomPrice, setRoomPrice] = useState(0);
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState({
    guestFullName: "",
    guestEmail: "",
    checkInDate: "",
    checkOutDate: "",
    NumAdults: "",
    children: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
  };

  const getRoomPriceById = async (roomId) => {
    try {
      const res = await getRoomById(roomId);
      setRoomPrice(res.roomPrice);
    } catch (err) {
      toast.error("Error fetching room price");
    }
  };

  useEffect(() => {
    getRoomPriceById(roomId);
  }, [roomId]);

  const calculate_Payment = () => {
    const checkInDate = moment(booking.checkInDate);
    const checkOutDate = moment(booking.checkOutDate);
    const diffInDays = checkOutDate.diff(checkInDate, 'days');
    const price = roomPrice ? roomPrice : 0;
    return diffInDays * price;
  };

  const isGuestValid = () => {
    const adultCount = parseInt(booking.NumAdults);
    const childCount = parseInt(booking.children);
    const totalGuests = adultCount + childCount;
    return totalGuests >= 1 && adultCount >= 1;
  };

  const isCheckOutDateValid = () => {
    if (!moment(booking.checkOutDate).isSameOrAfter(moment(booking.checkInDate))) {
      toast.error("Check-out date must be after check-in date");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isGuestValid() || !isCheckOutDateValid()) {
      e.stopPropagation();
      toast.error("Please fill out all required fields correctly.");
    } else {
      setIsSubmit(true);
    }
    setIsValidated(true);
  };
  

  const handleBooking = async () => {
    try {
      console.log(booking);
      const confirmationCode = await bookRoom(roomId, booking);
      setIsSubmit(true);
      navigate("/booking-success", { 
        state: { message: confirmationCode },
        replace: true 
      });
    } catch (err) {
      toast.error("Booking failed. Please try again.");
    }
  };

  const inputClass = "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h4 className="text-2xl font-bold text-gray-900 mb-8 text-center">Reserve Room</h4>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-2">
                    <User size={16} />
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  name="guestFullName"
                  className={inputClass}
                  placeholder="Enter your full name"
                  value={booking.guestFullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  name="guestEmail"
                  className={inputClass}
                  placeholder="Enter your email"
                  value={booking.guestEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-2">
                    <Calendar size={16} />
                    Check-in Date
                  </span>
                </label>
                <input
                  type="date"
                  name="checkInDate"
                  className={inputClass}
                  value={booking.checkInDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-2">
                    <Calendar size={16} />
                    Check-out Date
                  </span>
                </label>
                <input
                  type="date"
                  name="checkOutDate"
                  className={inputClass}
                  value={booking.checkOutDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-2">
                    <Users size={16} />
                    Adults
                  </span>
                </label>
                <input
                  type="number"
                  name="NumAdults"
                  className={inputClass}
                  min={1}
                  value={booking.NumAdults}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-2">
                    <Users size={16} />
                    Children
                  </span>
                </label>
                <input
                  type="number"
                  name="children"
                  className={inputClass}
                  min={0}
                  value={booking.children}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Continue to Book
              </button>
            </div>
          </form>
        </div>

        {isSubmit && isValidated && (
          <div className="mt-8">
            <BookingSummary
              booking={booking}
              payment={calculate_Payment()}
              isFormValid={isValidated}
              onConfirm={handleBooking}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;