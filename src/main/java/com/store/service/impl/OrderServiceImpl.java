// src/main/java/com/store/service/impl/OrderServiceImpl.java

package com.store.service.impl;

import com.store.dto.OrderDto;
import com.store.dto.OrderItemDto;
import com.store.entity.*;
import com.store.repository.OrderRepository;
import com.store.repository.ProductRepository;
import com.store.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public OrderDto createOrder(OrderDto orderDto, User user) {
        if (orderDto.getItems() == null || orderDto.getItems().isEmpty()) {
            throw new RuntimeException("Order must contain at least one item");
        }

        Order order = new Order(user);
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        // ✅ Сохраняем контактные данные из DTO
        order.setCustomerFirstName(orderDto.getCustomerFirstName());
        order.setCustomerLastName(orderDto.getCustomerLastName());
        order.setCustomerEmail(orderDto.getCustomerEmail());
        order.setCustomerPhone(orderDto.getCustomerPhone());
        order.setDeliveryAddress(orderDto.getDeliveryAddress());

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemDto itemDto : orderDto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemDto.getProductId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(itemDto.getPrice());

            totalAmount = totalAmount.add(itemDto.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity())));
            orderItems.add(orderItem);
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        Order saved = orderRepository.save(order);
        return convertToDto(saved);
    }

    @Override
    public List<OrderDto> getOrdersByUser(User user) {
        return orderRepository.findByUser_IdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public java.util.Optional<OrderDto> getOrderById(Long id) {
        return orderRepository.findById(id).map(this::convertToDto);
    }

    @Override
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderDto updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));

        try {
            order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid order status: " + status);
        }

        order.setUpdatedAt(LocalDateTime.now());
        Order updated = orderRepository.save(order);
        return convertToDto(updated);
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found: " + id);
        }
        orderRepository.deleteById(id);
    }

    // ✅ Helper method для конвертации Entity → DTO
    private OrderDto convertToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setUserId(order.getUserId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus() != null ? order.getStatus().name() : null);
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        // ✅ Контактные данные
        dto.setCustomerFirstName(order.getCustomerFirstName());
        dto.setCustomerLastName(order.getCustomerLastName());
        dto.setCustomerEmail(order.getCustomerEmail());
        dto.setCustomerPhone(order.getCustomerPhone());
        dto.setDeliveryAddress(order.getDeliveryAddress());

        // ✅ Товары
        if (order.getOrderItems() != null) {
            List<OrderItemDto> itemDtos = new ArrayList<>();
            for (OrderItem item : order.getOrderItems()) {
                OrderItemDto itemDto = new OrderItemDto();
                itemDto.setProductId(item.getProduct() != null ? item.getProduct().getId() : null);
                itemDto.setProductName(item.getProductName());
                itemDto.setQuantity(item.getQuantity());
                itemDto.setPrice(item.getPrice());
                itemDtos.add(itemDto);
            }
            dto.setItems(itemDtos);
        }

        return dto;
    }
}
