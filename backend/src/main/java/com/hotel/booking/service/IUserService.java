package com.hotel.booking.service;

import java.util.List;

import com.hotel.booking.model.User;

public interface IUserService {
	User registerUser(User user);
    List<User> getUsers();
    void deleteUser(String email);
    User getUser(String email);
}
