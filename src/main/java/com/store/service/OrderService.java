package com.store.service;

import com.store.dto.OrderDto;
import com.store.entity.User;

import java.util.List;
import java.util.Optional;

public interface OrderService {

    OrderDto createOrder(OrderDto orderDto, User user);

    List<OrderDto> getOrdersByUser(User user);

    Optional<OrderDto> getOrderById(Long id);

    List<OrderDto> getAllOrders();

    OrderDto updateOrderStatus(Long id, String status);

    // ✅ Добавлен метод, которого не хватало:
    void deleteOrder(Long id);
}
