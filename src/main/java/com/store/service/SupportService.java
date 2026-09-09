package com.store.service;

import com.store.dto.SupportDtos.*;
import com.store.entity.SupportMessage;
import com.store.entity.SupportTicket;
import com.store.repository.SupportMessageRepository;
import com.store.repository.SupportTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class SupportService {

    @Autowired private SupportTicketRepository ticketRepo;
    @Autowired private SupportMessageRepository messageRepo;
    @Autowired private TelegramNotifier notifier;

    public List<TicketDto> getAllTickets() {
        return ticketRepo.findAllByOrderByUpdatedAtDesc().stream().map(this::toDto).toList();
    }

    public TicketDto getTicket(Long id) {
        return ticketRepo.findById(id).map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Тикет не найден"));
    }

    public StatsDto stats() {
        return new StatsDto(
                ticketRepo.countByStatus(SupportTicket.Status.OPEN),
                ticketRepo.countByStatus(SupportTicket.Status.IN_PROGRESS),
                ticketRepo.countByStatus(SupportTicket.Status.RESOLVED),
                ticketRepo.count());
    }

    // ===== Админ отвечает =====
    @Transactional
    public TicketDto adminReply(Long id, String text) {
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Сообщение не может быть пустым");
        }
        SupportTicket t = ticketRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Тикет не найден"));

        SupportMessage m = new SupportMessage();
        m.setTicket(t);
        m.setSender(SupportMessage.Sender.ADMIN);
        m.setText(text.trim());
        messageRepo.save(m);

        if (t.getStatus() == SupportTicket.Status.OPEN || t.getStatus() == SupportTicket.Status.RESOLVED) {
            t.setStatus(SupportTicket.Status.IN_PROGRESS);
        }
        t.setUpdatedAt(LocalDateTime.now());
        ticketRepo.save(t);

        String greeting = t.getTelegramName() != null ? t.getTelegramName() + ", " : "";
        notifier.sendToUser(t.getTelegramChatId(),
                greeting + "ответ от поддержки Riff:\n\n" + text.trim());

        return toDto(t);
    }

    // ===== Админ помечает "исправлено" =====
    @Transactional
    public TicketDto resolve(Long id) {
        SupportTicket t = ticketRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Тикет не найден"));
        t.setStatus(SupportTicket.Status.RESOLVED);
        t.setUpdatedAt(LocalDateTime.now());
        ticketRepo.save(t);

        String greeting = t.getTelegramName() != null ? t.getTelegramName() + ", " : "";
        notifier.sendToUser(t.getTelegramChatId(),
                greeting + "ваш вопрос отмечен как решённый ✅\n" +
                        "Если что-то ещё понадобится — просто напишите сюда.");
        return toDto(t);
    }

    @Transactional
    public TicketDto close(Long id) {
        SupportTicket t = ticketRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Тикет не найден"));
        t.setStatus(SupportTicket.Status.CLOSED);
        t.setUpdatedAt(LocalDateTime.now());
        ticketRepo.save(t);
        return toDto(t);
    }

    private TicketDto toDto(SupportTicket t) {
        var msgs = t.getMessages().stream().map(m -> new MessageDto(
                m.getId(), m.getSender(), m.getText(), m.getCreatedAt()
        )).toList();

        String last = msgs.isEmpty() ? null : msgs.get(msgs.size() - 1).text();

        // "непрочитанных" для админа — количество USER-сообщений после последнего ADMIN
        int unread = 0;
        for (int i = msgs.size() - 1; i >= 0; i--) {
            if (msgs.get(i).sender() == SupportMessage.Sender.ADMIN) break;
            if (msgs.get(i).sender() == SupportMessage.Sender.USER) unread++;
        }

        return new TicketDto(
                t.getId(),
                t.getTelegramChatId(),
                t.getTelegramUsername(),
                t.getTelegramName(),
                t.getStatus(),
                t.getSubject(),
                last,
                t.getCreatedAt(),
                t.getUpdatedAt(),
                unread,
                msgs
        );
    }
}
