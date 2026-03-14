package com.store.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {
    private Long id;
    private Long userId;
    private List<OrderItemDto> items;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ✅ КОНТАКТНЫЕ ДАННЫЕ ЗАКАЗЧИКА
    private String customerFirstName;
    private String customerLastName;
    private String customerEmail;
    private String customerPhone;
    private String deliveryAddress;

    // Constructors
    public OrderDto() {}

    public OrderDto(Long id, Long userId, List<OrderItemDto> items,
                    BigDecimal totalAmount, String status,
                    LocalDateTime createdAt, LocalDateTime updatedAt,
                    String customerFirstName, String customerLastName,
                    String customerEmail, String customerPhone, String deliveryAddress) {
        this.id = id;
        this.userId = userId;
        this.items = items;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.customerFirstName = customerFirstName;
        this.customerLastName = customerLastName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.deliveryAddress = deliveryAddress;
    }

    // ===== Getters and Setters =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<OrderItemDto> getItems() { return items; }
    public void setItems(List<OrderItemDto> items) { this.items = items; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // ✅ Геттеры/сеттеры для контактных данных
    public String getCustomerFirstName() { return customerFirstName; }
    public void setCustomerFirstName(String customerFirstName) { this.customerFirstName = customerFirstName; }

    public String getCustomerLastName() { return customerLastName; }
    public void setCustomerLastName(String customerLastName) { this.customerLastName = customerLastName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
}
