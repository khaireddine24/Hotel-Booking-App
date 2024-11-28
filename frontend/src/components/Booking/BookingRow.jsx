import React from 'react';
import { format } from 'date-fns';

const BookingRow = ({ booking, onCancel }) => {
  // Fonction pour formater un tableau de date en date JavaScript
  const formatDateFromArray = (dateArray) => {
    // Soustraire 1 du mois car en JS, les mois sont indexés de 0 à 11
    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    return format(date, 'dd/MM/yyyy');
  };

  return (
    <tr className="hover:bg-gray-50 transition duration-150">
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900">{booking.bookingConfirmationCode}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900">{booking.guestFullName}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {formatDateFromArray(booking.checkInDate)}
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {formatDateFromArray(booking.checkOutDate)}
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
          <span
            aria-hidden
            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
          ></span>
          <span className="relative">{booking.room.roomType}</span>
        </span>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <button
          onClick={() => onCancel(booking)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
        >
          Annuler
        </button>
      </td>
    </tr>
  );
};

export default BookingRow;