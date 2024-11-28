package com.hotel.booking.controller;

import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.sql.rowset.serial.SerialBlob;

import java.util.Base64;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hotel.booking.exception.PhotoRetrievalException;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.model.BookedRoom;
import com.hotel.booking.model.Room;
import com.hotel.booking.response.RoomResponse;
import com.hotel.booking.response.BookingResponse;
import com.hotel.booking.service.BookedRoomServiceImpl;
import com.hotel.booking.service.RoomServiceImpl;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rooms")
public class RoomController {
	private final RoomServiceImpl roomService;
	private final BookedRoomServiceImpl bookingService;
	
	@CrossOrigin(origins = "http://localhost:5173")
	/* Add a new Room */
	@PostMapping("/add/new-room")
	public ResponseEntity<RoomResponse> addNewRoom(
			@RequestParam("photo") MultipartFile photo,
			@RequestParam("roomType") String roomType,
			@RequestParam("roomPrice") Double roomPrice) throws SQLException{
		
			Room SavedRoom=roomService.addNewRoom(photo,roomType,roomPrice);
			RoomResponse response=new RoomResponse(SavedRoom.getId(),SavedRoom.getRoomType(),SavedRoom.getRoomPrice());
			return ResponseEntity.ok(response);
	}
	
	@PutMapping("/update/{roomId}")
	public ResponseEntity<RoomResponse> updateRoom(
			@PathVariable Long roomId,
			@RequestParam(required=false) String roomType,
			@RequestParam(required=false) Double roomPrice,
			@RequestParam(required=false) MultipartFile photo) throws IOException, ResourceNotFoundException, SQLException, PhotoRetrievalException{
		byte[] photoBytes=photo!=null && !photo.isEmpty() ?photo.getBytes():roomService.getRoomPhotoByRoomId(roomId);
		Blob photoBlob=photoBytes!=null && photoBytes.length>0 ? new SerialBlob(photoBytes):null;
		Room RoomUpdate=roomService.updateRoom(roomId,roomType,roomPrice,photoBytes);
		RoomUpdate.setPhoto(photoBlob);
		RoomResponse roomResponse=getRoomResponse(RoomUpdate);
		return ResponseEntity.ok(roomResponse);
	}
	
	
	/* Get all rooms type (distinct) */
	
	@GetMapping("/room/types")
	public List<String> getRoomTypes(){
		return roomService.getAllRoomTypes();
	}
	
	/* Get All rooms */
	@GetMapping("/all-rooms")
	public ResponseEntity<List<RoomResponse>> getAllRooms() throws ResourceNotFoundException, SQLException, PhotoRetrievalException {
	    List<Room> rooms = roomService.getAllRooms();
	    List<RoomResponse> roomResponses = new ArrayList<>();
	    
	    for (Room room : rooms) {
	        byte[] photoBytes = roomService.getRoomPhotoByRoomId(room.getId());
	        if (photoBytes != null && photoBytes.length > 0) {
	            String base64Photo = Base64.getEncoder().encodeToString(photoBytes);
	            RoomResponse roomResponse = getRoomResponse(room);
	            roomResponse.setPhoto(base64Photo);
	            roomResponses.add(roomResponse);
	        }
	    }
	    return ResponseEntity.ok(roomResponses);
	}
	
	@GetMapping("/room/{roomId}")
	public ResponseEntity<Optional<RoomResponse>> getRoomById(@PathVariable Long roomId) throws PhotoRetrievalException{
		Optional<Room> RoomInfo=roomService.getRoomById(roomId);
		return RoomInfo.map(room->{
			RoomResponse roomResponse = getRoomResponse(room);
			return ResponseEntity.ok(Optional.of(roomResponse));
		}).orElseThrow(()->new ResourceNotFoundException("Room not found"));
	}
	
	/* Delete a room */
	@DeleteMapping("/delete/room/{roomId}")
	public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId){
		roomService.deleteRoom(roomId);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
	
	private RoomResponse getRoomResponse(Room room) throws PhotoRetrievalException {
	    List<BookedRoom> bookings = getAllbookingsByRoomId(room.getId());
	    List<BookingResponse> bookingInfo = (bookings != null)
	        ? bookings.stream()
	                  .map(booking -> new BookingResponse(
	                      booking.getBookingId(),
	                      booking.getCheckInDate(),
	                      booking.getCheckOutDate(),
	                      booking.getBookingConfirmationCode()))
	                  .toList()
	        : new ArrayList<>();

	    byte[] photoBytes = null;
	    Blob photoBlob = room.getPhoto();
	    if (photoBlob != null) {
	        try {
	            photoBytes = photoBlob.getBytes(1, (int) photoBlob.length());
	        } catch (SQLException e) {
	            throw new PhotoRetrievalException("Error retrieving photo");
	        }
	    }

	    return new RoomResponse(
	        room.getId(),
	        room.getRoomType(),
	        room.getRoomPrice(),
	        room.isBooked(),
	        photoBytes,
	        bookingInfo
	    );
	}
	
	private List<BookedRoom> getAllbookingsByRoomId(Long roomId){
		return bookingService.getAllBookingsByRoomId(roomId);
	}
	
	
	
}
