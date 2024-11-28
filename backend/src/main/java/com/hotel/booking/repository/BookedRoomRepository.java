package com.hotel.booking.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hotel.booking.model.BookedRoom;

public interface BookedRoomRepository extends JpaRepository<BookedRoom,Long> {
	Optional<BookedRoom> findByBookingConfirmationCode(String confirmationCode);
	List<BookedRoom> findByRoomId(Long roomId);
}
