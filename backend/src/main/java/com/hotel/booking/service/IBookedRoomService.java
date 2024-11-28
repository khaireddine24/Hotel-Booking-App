package com.hotel.booking.service;

import java.util.List;

import com.hotel.booking.model.BookedRoom;

public interface IBookedRoomService {
	List<BookedRoom> getAllBookingsByRoomId(Long roomId);
	void cancelBooking(Long bookingId);
	String saveBooking(Long roomId,BookedRoom bookingRequest);
	BookedRoom findByBookingConfirmationCode(String confirmationCode);
	List<BookedRoom> getAllBookings();
	List<BookedRoom> getBookingsByUserEmail(String email);

}
