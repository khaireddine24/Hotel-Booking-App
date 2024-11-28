package com.hotel.booking.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hotel.booking.model.User;

public interface UserRepository extends JpaRepository<User,Long> {
	boolean existsByEmail(String email);
    void deleteByEmail(String email);
    Optional<User> findByEmail(String email);
}
