package com.hotel.booking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hotel.booking.model.Room;

public interface RoomRepository extends JpaRepository<Room,Long> {
	
	@Query("SELECT DISTINCT r.roomType from Room r")
	List<String> findDistinctRoomTypes();
}
