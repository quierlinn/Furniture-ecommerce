package com.store.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "product_name", nullable = false)
    private String productName;  // ✅ Сохраняем название на момент заказа

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;  // ✅ BigDecimal, не Double!

    // Constructors
    public OrderItem() {}

    public OrderItem(Order order, Product product, String productName, Integer quantity, BigDecimal price) {
        this.order = order;
        this.product = product;
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
    }

    // ===== Getters and Setters =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    // ✅ Геттер для subtotal (quantity * price)
    public BigDecimal getSubtotal() {
        return price != null && quantity != null ? price.multiply(BigDecimal.valueOf(quantity)) : BigDecimal.ZERO;
    }
}
