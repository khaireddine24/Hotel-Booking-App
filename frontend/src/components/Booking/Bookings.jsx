import React, { useState, useEffect, useMemo } from 'react';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { parseISO, isValid } from 'date-fns';
import BookingRow from './BookingRow';
import BookingFilters from './BookingFilters';
import { getAllBookings, cancelBooking } from '../utils/api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const fetchedBookings = await getAllBookings();
        setBookings(fetchedBookings);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Safely parse the date
      const checkInDate = (() => {
        try {
          // First, try parsing as ISO string
          const parsedDate = parseISO(booking.checkInDate);
          return isValid(parsedDate) ? parsedDate : null;
        } catch (error) {
          // If parsing fails, try creating a new Date
          const newDate = new Date(booking.checkInDate);
          return isValid(newDate) ? newDate : null;
        }
      })();

      // If no valid date, exclude the booking
      if (!checkInDate) return false;

      if (!startDate && !endDate) return true;

      const filterStart = startDate ? (() => {
        try {
          const parsed = parseISO(startDate);
          return isValid(parsed) ? parsed : null;
        } catch (error) {
          return new Date(startDate);
        }
      })() : null;

      const filterEnd = endDate ? (() => {
        try {
          const parsed = parseISO(endDate);
          return isValid(parsed) ? parsed : null;
        } catch (error) {
          return new Date(endDate);
        }
      })() : null;

      if (filterStart && filterEnd) {
        return checkInDate >= filterStart && checkInDate <= filterEnd;
      }
      if (filterStart) {
        return checkInDate >= filterStart;
      }
      if (filterEnd) {
        return checkInDate <= filterEnd;
      }

      return true;
    });
  }, [bookings, startDate, endDate]);

  const handleConfirmCancel = async () => {
    try {
      await cancelBooking(bookingToCancel.bookingId);
      setBookings((prev) => prev.filter((b) => b.bookingId !== bookingToCancel.bookingId));
      setIsDialogOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenDialog = (booking) => {
    setBookingToCancel(booking);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-6xl py-8 mt-32">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Bookings</h2>

      <BookingFilters
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-300 hover:bg-blue-400 text-gray-800 font-bold py-2 px-4 rounded"
          onClick={handleResetFilters}
        >
          Reset Filters
        </button>
      </div>

      <div className="shadow rounded-lg overflow-hidden">
        {filteredBookings.length > 0 ? (
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Confirmation Code
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Check-In
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Check-Out
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  RoomType
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <BookingRow key={booking.bookingId} booking={booking} onCancel={handleOpenDialog} />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p className="mt-3 text-sm font-medium">No bookings found</p>
            <p className="mt-1 text-xs text-gray-500">You haven't made any bookings yet.</p>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
      />
    </div>
  );
};

export default Bookings;