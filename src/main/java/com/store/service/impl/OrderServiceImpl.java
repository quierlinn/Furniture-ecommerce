package com.store.service.impl;

import com.store.dto.OrderDto;
import com.store.dto.OrderItemDto;
import com.store.entity.Order;
import com.store.entity.OrderItem;
import com.store.entity.Product;
import com.store.entity.User;
import com.store.mapper.OrderMapper;
import com.store.repository.OrderRepository;
import com.store.repository.ProductRepository;
import com.store.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public OrderDto createOrder(OrderDto orderDto, User user) {
        // Create new order entity
        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        // Calculate total amount
        BigDecimal totalAmount = orderDto.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalPrice(totalAmount);

        // Create order items
        for (OrderItemDto itemDto : orderDto.getItems()) {
            OrderItem orderItem = new OrderItem();
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + itemDto.getProductId()));

            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(itemDto.getPrice());

            order.getOrderItems().add(orderItem);
        }

        // Save and return DTO
        Order savedOrder = orderRepository.save(order);
        return OrderMapper.INSTANCE.toDto(savedOrder);
    }

    @Override
    public Optional<OrderDto> getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(OrderMapper.INSTANCE::toDto);
    }

    @Override
    public List<OrderDto> getOrdersByUser(User user) {
        return orderRepository.findByUser(user)
                .stream()
                .map(OrderMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(OrderMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrderDto updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        // Convert string status to enum
        Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
        order.setStatus(orderStatus);

        Order updatedOrder = orderRepository.save(order);
        return OrderMapper.INSTANCE.toDto(updatedOrder);
    }

    @Override
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
    }
}
