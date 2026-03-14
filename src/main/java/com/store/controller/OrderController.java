package com.store.controller;

import com.store.dto.OrderDto;
import com.store.entity.User;
import com.store.service.OrderService;
import com.store.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@RequestBody OrderDto orderDto, Authentication authentication) {
        String email = authentication.getName();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        OrderDto createdOrder = orderService.createOrder(orderDto, user);
        return ResponseEntity.ok(createdOrder);
    }

    @GetMapping("/user")
    public ResponseEntity<List<OrderDto>> getUserOrders(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        List<OrderDto> orders = orderService.getOrdersByUser(user);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        return orderService.getOrderById(id)
                .map(order -> {
                    if (order.getUserId().equals(currentUser.getId()) || currentUser.getRole() == com.store.entity.Role.ADMIN) {
                        return ResponseEntity.ok(order);
                    } else {
                        return ResponseEntity.status(403).<OrderDto>build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        List<OrderDto> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }


    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDto> updateOrderStatus(@PathVariable Long id, @RequestBody String status) {
        String cleanStatus = status.replace("\"", "").trim();
        OrderDto updatedOrder = orderService.updateOrderStatus(id, cleanStatus);
        return ResponseEntity.ok(updatedOrder);
    }
}
