import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Calendar, Mail, User, Users, Clock } from 'lucide-react';

const BookingSummary = ({ booking, payment, isFormValid, onConfirm }) => {
  const checkInDate = moment(booking.checkInDate);
  const checkOutDate = moment(booking.checkOutDate);
  const navigate = useNavigate();
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const validateDates = () => {
    if (!checkInDate.isValid() || !checkOutDate.isValid()) {
      return { isValid: false, message: "Invalid dates" };
    }

    const today = moment().startOf('day');
    const numOfDays = checkOutDate.diff(checkInDate, 'days');
    const maxStayDays = 30;

    if (checkInDate.isBefore(today)) {
      return { isValid: false, message: "Check-in date cannot be in the past" };
    }

    if (numOfDays <= 0) {
      return { isValid: false, message: "Check-out date must be after check-in date" };
    }

    if (numOfDays > maxStayDays) {
      return { isValid: false, message: `Stay cannot exceed ${maxStayDays} days` };
    }

    if (checkOutDate.year() - checkInDate.year() > 1) {
      return { isValid: false, message: "Booking cannot span more than one year" };
    }

    return { isValid: true, numOfDays };
  };

  const dateValidation = validateDates();

  const handleConfirmBooking = () => {
    if (!dateValidation.isValid) return;
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsBookingConfirmed(true);
      onConfirm();
    }, 3000);
  };

  useEffect(() => {
    if (isBookingConfirmed) {
      navigate("/booking-success");
    }
  }, [isBookingConfirmed, navigate]);


  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">Reservation Summary</h4>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <User size={18} />
            <span className="font-medium">Full Name:</span>
            <span>{booking.guestFullName}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Mail size={18} />
            <span className="font-medium">Email:</span>
            <span>{booking.guestEmail}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Calendar size={18} />
            <span className="font-medium">Check-in:</span>
            <span>{moment(booking.checkInDate).format("MMM Do YYYY")}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Calendar size={18} />
            <span className="font-medium">Check-out:</span>
            <span>{moment(booking.checkOutDate).format("MMM Do YYYY")}</span>
          </div>

          {dateValidation.isValid && (
            <div className="flex items-center gap-2 text-gray-700 col-span-2">
              <Clock size={18} />
              <span className="font-medium">Duration of Stay:</span>
              <span>{dateValidation.numOfDays} {dateValidation.numOfDays === 1 ? 'night' : 'nights'}</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <h5 className="text-lg font-semibold mb-3">Guest Information</h5>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span className="font-medium">
                Adult{booking.NumAdults > 1 ? "s" : ""}:
              </span>
              <span>{booking.NumAdults}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span className="font-medium">Children:</span>
              <span>{booking.children}</span>
            </div>
          </div>
        </div>

        {dateValidation.isValid && payment > 0 ? (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-lg font-semibold">Total Amount:</span>
                <p className="text-sm text-gray-600">
                  ({dateValidation.numOfDays} {dateValidation.numOfDays === 1 ? 'night' : 'nights'} × {payment / dateValidation.numOfDays} TND)
                </p>
              </div>
              <span className="text-2xl font-bold text-blue-600">{payment} TND</span>
            </div>

            {isFormValid && !isBookingConfirmed ? (
              <button
              onClick={handleConfirmBooking}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              disabled={!dateValidation.isValid || isProcessingPayment}
            >
              {isProcessingPayment ? "Processing..." : "Confirm Booking"}
            </button>
            
            ) : isBookingConfirmed ? (
              <div className="flex justify-center">
                <div className="w-8 h-8 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin" />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center">
              {dateValidation.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSummary;