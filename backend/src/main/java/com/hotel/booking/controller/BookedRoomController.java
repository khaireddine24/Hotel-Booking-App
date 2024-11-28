package com.hotel.booking.controller;

import com.hotel.booking.service.IBookedRoomService;
import com.hotel.booking.service.IRoomService;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.booking.exception.InvalidBookingRequestException;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.model.BookedRoom;
import com.hotel.booking.model.Room;
import com.hotel.booking.response.BookingResponse;
import com.hotel.booking.response.RoomResponse;

@RequiredArgsConstructor
@RestController
@RequestMapping("/bookings")
public class BookedRoomController {
	private final IBookedRoomService bookingService;
	private final IRoomService roomService;
	
	@CrossOrigin(origins = "http://localhost:5173")
	
	@GetMapping("all-bookings")
	public ResponseEntity<List<BookingResponse>> getAllBookings(){
		List<BookedRoom> bookings=bookingService.getAllBookings();
		List<BookingResponse> bookingResponses=new ArrayList<>();
		for(BookedRoom booking:bookings) {
			BookingResponse bookingResponse=getBookingResponse(booking);
			bookingResponses.add(bookingResponse);
		}
		return ResponseEntity.ok(bookingResponses);
	}
	
	@GetMapping("/confirmation/{confirmationCode}")
	public ResponseEntity<?> getBookingByConfirmationCode(@PathVariable String confirmationCode){
		try {
			BookedRoom booking=bookingService.findByBookingConfirmationCode(confirmationCode);
			BookingResponse bookingResponse=getBookingResponse(booking);
			return ResponseEntity.ok(bookingResponse);
		}catch(ResourceNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		}
	}
	
	private BookingResponse getBookingResponse(BookedRoom booking) {
		Room theRoom=roomService.getRoomById(booking.getRoom().getId()).get();
		RoomResponse room=new RoomResponse(
				theRoom.getId(),
				theRoom.getRoomType(),
				theRoom.getRoomPrice()
	    );
		return new BookingResponse(booking.getBookingId(),booking.getCheckInDate(),booking.getCheckOutDate(),
				booking.getGuestFullName(),booking.getGuestEmail(),booking.getNumAdults(),booking.getNumChildren(),
				booking.getTotalNumGuest(),booking.getBookingConfirmationCode(),room
				);
	}

	@DeleteMapping("/booking/{bookingId}/delete")
	public void cancelBooking(@PathVariable Long bookingId) {
		bookingService.cancelBooking(bookingId);
	}
	
	@PostMapping("/room/{roomId}/booking")
	public ResponseEntity<?> saveBooking(@PathVariable Long roomId,@RequestBody BookedRoom bookingRequest){
		try {
			String confirmationCode=bookingService.saveBooking(roomId,bookingRequest);
			return ResponseEntity.ok("Room booked successfully, your booking confirmation code is :"+confirmationCode);
		}catch(InvalidBookingRequestException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@GetMapping("/users/{email}/bookings")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserEmail(@PathVariable String email) {
        List<BookedRoom> bookings = bookingService.getBookingsByUserEmail(email);
        List<BookingResponse> bookingResponses = new ArrayList<>();
        for (BookedRoom booking : bookings) {
            BookingResponse bookingResponse = getBookingResponse(booking);
            bookingResponses.add(bookingResponse);
        }
        return ResponseEntity.ok(bookingResponses);
    }
	
	

}
