package com.hotel.booking.service;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.hotel.booking.model.Room;

public interface IRoomService {
	Room addNewRoom(MultipartFile photo,String roomType,Double roomPrice) throws SQLException,IOException;
	
	List<Room> getAllRooms();
	
	List<String> getAllRoomTypes();
	
	void deleteRoom(Long roomId);
	
	Room updateRoom(Long roomId,String roomType,Double roomPrice,byte[] photoBytes);
	
	Optional<Room> getRoomById(Long roomId);
	
}
