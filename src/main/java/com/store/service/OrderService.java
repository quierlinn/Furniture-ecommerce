package com.store.service;

import com.store.dto.OrderDto;
import com.store.entity.User;

import java.util.List;
import java.util.Optional;

public interface OrderService {
    OrderDto createOrder(OrderDto orderDto, User user);
    Optional<OrderDto> getOrderById(Long id);
    List<OrderDto> getOrdersByUser(User user);
    List<OrderDto> getAllOrders();
    OrderDto updateOrderStatus(Long orderId, String status);
    void deleteOrder(Long id);
}
