package com.hotel.booking.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hotel.booking.exception.InvalidBookingRequestException;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.model.BookedRoom;
import com.hotel.booking.model.Room;
import com.hotel.booking.repository.BookedRoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookedRoomServiceImpl implements IBookedRoomService {
	
	private final BookedRoomRepository bookingRepository;
	private final IRoomService roomService;

	public List<BookedRoom> getAllBookingsByRoomId(Long roomId) {
		return bookingRepository.findByRoomId(roomId);
	}

	@Override
	public void cancelBooking(Long bookingId) {
		bookingRepository.deleteById(bookingId);
		
	}

	@Override
	public String saveBooking(Long roomId, BookedRoom bookingRequest) {
		if(bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())) {
			throw new InvalidBookingRequestException("checkIn date must come before checkOut date");
		}
		Room room=roomService.getRoomById(roomId).get();
		List<BookedRoom> existingBookings=room.getBookings();
		boolean roomIsAvailable=roomIsAvailable(bookingRequest,existingBookings);
		if(roomIsAvailable) {
			room.addBooking(bookingRequest);
			bookingRepository.save(bookingRequest);
		}
		else {
			throw new InvalidBookingRequestException("Sorry,this Room is not available for the selected dates");
		}
		return bookingRequest.getBookingConfirmationCode();
	}

	private boolean roomIsAvailable(BookedRoom bookingRequest, List<BookedRoom> existingBookings) {
	    return existingBookings.stream()
	            .noneMatch(existingBooking ->
	                    !bookingRequest.getCheckOutDate().isBefore(existingBooking.getCheckInDate()) &&
	                    !bookingRequest.getCheckInDate().isAfter(existingBooking.getCheckOutDate())
	            );
	}


	@Override
	public BookedRoom findByBookingConfirmationCode(String confirmationCode) {
		return 
		bookingRepository.findByBookingConfirmationCode(confirmationCode)
				.orElseThrow(()->new ResourceNotFoundException("No Booking found with booking code :"+confirmationCode));
	}

	@Override
	public List<BookedRoom> getAllBookings() {
		return bookingRepository.findAll();
	}

}
