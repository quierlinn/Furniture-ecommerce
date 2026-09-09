package com.store.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "support_tickets")
public class SupportTicket {

    public enum Status { OPEN, IN_PROGRESS, RESOLVED, CLOSED }
    public static final Status[] ACTIVE = { Status.OPEN, Status.IN_PROGRESS };

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "telegram_chat_id", nullable = false)
    private Long telegramChatId;

    @Column(name = "telegram_username")
    private String telegramUsername;

    @Column(name = "telegram_name")
    private String telegramName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.OPEN;

    @Column(length = 500)
    private String subject;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt ASC")
    private List<SupportMessage> messages = new ArrayList<>();

    // getters/setters
    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Long getTelegramChatId() { return telegramChatId; }
    public void setTelegramChatId(Long id) { this.telegramChatId = id; }
    public String getTelegramUsername() { return telegramUsername; }
    public void setTelegramUsername(String u) { this.telegramUsername = u; }
    public String getTelegramName() { return telegramName; }
    public void setTelegramName(String n) { this.telegramName = n; }
    public Status getStatus() { return status; }
    public void setStatus(Status s) { this.status = s; }
    public String getSubject() { return subject; }
    public void setSubject(String s) { this.subject = s; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime u) { this.updatedAt = u; }
    public List<SupportMessage> getMessages() { return messages; }
    public void setMessages(List<SupportMessage> m) { this.messages = m; }
}
