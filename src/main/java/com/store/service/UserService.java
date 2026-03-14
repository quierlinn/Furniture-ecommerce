package com.store.service;

import com.store.dto.UserDto;
import com.store.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    // ===== Auth =====
    UserDto registerUser(UserDto userDto);
    UserDto loginUser(String email, String password);

    // ===== Поиск пользователей =====
    Optional<User> findByEmail(String email);
    Optional<UserDto> getUserByEmail(String email);
    Optional<UserDto> getUserById(Long id);
    List<UserDto> getAllUsers();

    // ===== Проверки =====
    boolean existsByEmail(String email);

    // ===== CRUD (для админа) =====
    UserDto createUser(UserDto userDto);
    UserDto updateUser(Long id, UserDto userDto);
    void deleteUser(Long id);
}
