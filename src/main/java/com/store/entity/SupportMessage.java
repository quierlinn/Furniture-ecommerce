package com.store.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_messages")
public class SupportMessage {

    public enum Sender { USER, ADMIN, SYSTEM }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ticket_id", nullable = false)
    private SupportTicket ticket;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Sender sender = Sender.USER;

    @Column(nullable = false, columnDefinition = "text")
    private String text;

    @Column(name = "telegram_message_id")
    private Long telegramMessageId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // getters/setters
    public Long getId() { return id; }
    public SupportTicket getTicket() { return ticket; }
    public void setTicket(SupportTicket t) { this.ticket = t; }
    public Sender getSender() { return sender; }
    public void setSender(Sender s) { this.sender = s; }
    public String getText() { return text; }
    public void setText(String t) { this.text = t; }
    public Long getTelegramMessageId() { return telegramMessageId; }
    public void setTelegramMessageId(Long id) { this.telegramMessageId = id; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
