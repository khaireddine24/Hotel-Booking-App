package com.hotel.booking.response;

import java.util.Base64;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RoomResponse {
	private Long id;
	private String roomType;
	private Double roomPrice;
	private boolean isBooked;
	private String photo;
	private List<BookingResponse> bookings;
	
	public RoomResponse(Long id, String roomType, Double roomPrice) {
		this.id = id;
		this.roomType = roomType;
		this.roomPrice = roomPrice;
	}
	
	public RoomResponse(Long id, String roomType, Double roomPrice, boolean isBooked, 
			byte[] photoBytes,List<BookingResponse> bookings) {
		this.id = id;
		this.roomType = roomType;
		this.roomPrice = roomPrice;
		this.isBooked = isBooked;
		this.photo = photoBytes != null ? Base64.getEncoder().encodeToString(photoBytes) : null;
		this.bookings = bookings;
	}
	

}
