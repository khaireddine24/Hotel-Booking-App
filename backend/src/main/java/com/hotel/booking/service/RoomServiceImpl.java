package com.hotel.booking.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hotel.booking.exception.InternalServerException;
import com.hotel.booking.exception.ResourceNotFoundException;
import com.hotel.booking.model.Room;
import com.hotel.booking.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import javax.sql.rowset.serial.SerialBlob;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements IRoomService {
    private final RoomRepository roomRepository;

    public Room addNewRoom(MultipartFile file, String roomType, Double roomPrice) throws SQLException {
        Room room = new Room();
        room.setRoomType(roomType);
        room.setRoomPrice(roomPrice);

        if (!file.isEmpty()) {
            try {
                byte[] photoBytes = file.getBytes();
                Blob photoBlob = new SerialBlob(photoBytes);
                room.setPhoto(photoBlob);
            } catch (Exception e) {
                e.printStackTrace();
                throw new SQLException("Failed to convert MultipartFile to Blob", e);
            }
        }

        return roomRepository.save(room);
    }
    
 
    public List<String> getAllRoomTypes(){
    	return roomRepository.findDistinctRoomTypes();
    }


	public List<Room> getAllRooms() {
		return roomRepository.findAll();
	}


	public byte[] getRoomPhotoByRoomId(Long roomId) throws ResourceNotFoundException, SQLException {
		Optional<Room> theRoom=roomRepository.findById(roomId);
		if(theRoom.isEmpty()) {
			throw new ResourceNotFoundException("Room not found");
		}
		Blob photoBlob=theRoom.get().getPhoto();
		if(photoBlob!=null) {
			return photoBlob.getBytes(1,(int) photoBlob.length());
			
		}
		return null;
	}
	
	@Override
	public Optional<Room> getRoomById(Long roomId) {
		return Optional.of(roomRepository.findById(roomId).get());
	}


	public void deleteRoom(Long roomId) {
		Optional<Room> RoomtoDelete=roomRepository.findById(roomId);
		if(RoomtoDelete.isPresent()) {
			roomRepository.deleteById(roomId);
		}
		
		
	}


	@Override
	public Room updateRoom(Long roomId, String roomType, Double roomPrice, byte[] photoBytes) throws ResourceNotFoundException {
		Room room=roomRepository.findById(roomId)
				.orElseThrow(()->new ResourceNotFoundException("Room not found"));
		if(roomType!=null) room.setRoomType(roomType);
		if(roomPrice!=null) room.setRoomPrice(roomPrice);
		if(photoBytes!=null && photoBytes.length>0) {
			try {
				room.setPhoto(new SerialBlob(photoBytes));
			}catch(SQLException e) {
				throw new InternalServerException("Error updating Room");
			}
		}
		return roomRepository.save(room);
	}


	
}
