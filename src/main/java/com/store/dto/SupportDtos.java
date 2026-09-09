package com.store.dto;

import com.store.entity.SupportMessage;
import com.store.entity.SupportTicket;

import java.time.LocalDateTime;
import java.util.List;

public class SupportDtos {

    public record MessageDto(
            Long id,
            SupportMessage.Sender sender,
            String text,
            LocalDateTime createdAt
    ) {}

    public record TicketDto(
            Long id,
            Long telegramChatId,
            String telegramUsername,
            String telegramName,
            SupportTicket.Status status,
            String subject,
            String lastMessage,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            Integer unreadByAdmin,
            List<MessageDto> messages
    ) {}

    public record AdminReplyRequest(String text) {}

    public record StatsDto(long open, long inProgress, long resolved, long total) {}
}
