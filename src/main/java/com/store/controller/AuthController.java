package com.store.controller;

import com.store.dto.UserDto;
import com.store.security.JwtUtil;
import com.store.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto) {
        try {
            if (userService.existsByEmail(userDto.getEmail())) {
                return ResponseEntity.badRequest().body("Error: Email is already taken!");
            }

            // ✅ ИСПРАВЛЕНО: используем registerUser вместо createUser
            UserDto newUser = userService.registerUser(userDto);
            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody UserDto userDto) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            userDto.getEmail(),
                            userDto.getPassword()
                    )
            );

            final UserDetails userDetails = userDetailsService.loadUserByUsername(userDto.getEmail());
            final String token = jwtUtil.generateToken(userDetails);

            UserDto user = userService.getUserByEmail(userDto.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("token", token);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid credentials: " + e.getMessage());
        }
    }
}
