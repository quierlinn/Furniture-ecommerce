package com.store.controller;

import com.store.dto.OrderDto;
import com.store.entity.User;
import com.store.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@RequestBody OrderDto orderDto, Authentication authentication) {
        // Get user from authentication
        User user = (User) authentication.getPrincipal();
        
        OrderDto createdOrder = orderService.createOrder(orderDto, user);
        return ResponseEntity.ok(createdOrder);
    }

    @GetMapping("/user")
    public ResponseEntity<List<OrderDto>> getUserOrders(Authentication authentication) {
        // Get user from authentication
        User user = (User) authentication.getPrincipal();
        
        List<OrderDto> orders = orderService.getOrdersByUser(user);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id, Authentication authentication) {
        // Check if user is authorized to view this order
        User user = (User) authentication.getPrincipal();
        
        return (ResponseEntity<OrderDto>) orderService.getOrderById(id)
                .map(order -> {
                    if (order.getUserId().equals(user.getId()) || user.getRole().toString().equals("ADMIN")) {
                        return ResponseEntity.ok(order);
                    } else {
                        return ResponseEntity.status(403).build();
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
        OrderDto updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }
}
