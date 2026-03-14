package com.store.service.impl;

import com.store.dto.UserDto;
import com.store.entity.User;
import com.store.entity.Role;
import com.store.mapper.UserMapper;
import com.store.repository.UserRepository;
import com.store.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserDto registerUser(UserDto userDto) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email already registered: " + userDto.getEmail());
        }

        User user = UserMapper.INSTANCE.toEntity(userDto);

        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        user.setRole(Role.USER);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        return UserMapper.INSTANCE.toDto(saved);
    }

    @Override
    public UserDto loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return UserMapper.INSTANCE.toDto(user);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Optional<UserDto> getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(UserMapper.INSTANCE::toDto);
    }

    @Override
    public Optional<UserDto> getUserById(Long id) {
        return userRepository.findById(id)
                .map(UserMapper.INSTANCE::toDto);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional
    public UserDto createUser(UserDto userDto) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email already registered: " + userDto.getEmail());
        }

        User user = UserMapper.INSTANCE.toEntity(userDto);

        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        user.setRole(Role.USER);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        return UserMapper.INSTANCE.toDto(saved);
    }

    @Override
    @Transactional
    public UserDto updateUser(Long id, UserDto userDto) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));

        existing.setEmail(userDto.getEmail());
        existing.setFirstName(userDto.getFirstName());
        existing.setLastName(userDto.getLastName());
        if (userDto.getRole() != null) {
            existing.setRole(userDto.getRole());
        }
        existing.setUpdatedAt(java.time.LocalDateTime.now());

        User updated = userRepository.save(existing);
        return UserMapper.INSTANCE.toDto(updated);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found: " + id);
        }
        userRepository.deleteById(id);
    }
}
