package com.store.controller;

import com.store.dto.SupportDtos.TicketDto;
import com.store.entity.SupportMessage;
import com.store.entity.SupportTicket;
import com.store.repository.SupportTicketRepository;
import com.store.service.SupportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
public class PublicSupportController {

    @Autowired
    private SupportTicketRepository supportTicketRepository;

    @Autowired
    private SupportService supportService;

    @PostMapping("/public")
    public ResponseEntity<?> handlePublicMessage(@RequestBody Map<String, Object> request) {
        try {
            String messageText = (String) request.get("message");
            Object ticketIdObj = request.get("ticketId");
            String name = (String) request.getOrDefault("name", "Посетитель сайта");

            if (messageText == null || messageText.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Сообщение не может быть пустым"));
            }

            // Если передан ticketId, добавляем сообщение в существующий тикет
            if (ticketIdObj != null) {
                Long ticketId = Long.valueOf(ticketIdObj.toString());
                SupportTicket ticket = supportTicketRepository.findById(ticketId)
                        .orElseThrow(() -> new IllegalArgumentException("Тикет не найден"));

                SupportMessage newMessage = new SupportMessage();
                newMessage.setTicket(ticket);
                newMessage.setSender(SupportMessage.Sender.USER);
                newMessage.setText(messageText.trim());
                // createdAt инициализируется автоматически в Entity, сеттер не нужен

                ticket.getMessages().add(newMessage);
                ticket.setUpdatedAt(LocalDateTime.now());

                // Если тикет был закрыт, открываем его снова
                if (ticket.getStatus() == SupportTicket.Status.CLOSED || ticket.getStatus() == SupportTicket.Status.RESOLVED) {
                    ticket.setStatus(SupportTicket.Status.OPEN);
                }

                supportTicketRepository.save(ticket);

                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "ticketId", ticket.getId(),
                        "message", "Сообщение добавлено"
                ));
            }
            // Иначе создаём новый тикет
            else {
                SupportTicket ticket = new SupportTicket();
                ticket.setTelegramChatId(-1L);
                ticket.setTelegramName(name);
                ticket.setStatus(SupportTicket.Status.OPEN);
                ticket.setSubject("Сообщение с сайта");
                ticket.setUpdatedAt(LocalDateTime.now());

                SupportMessage firstMessage = new SupportMessage();
                firstMessage.setText(messageText.trim());
                firstMessage.setSender(SupportMessage.Sender.USER);
                firstMessage.setTicket(ticket);

                ticket.getMessages().add(firstMessage);
                supportTicketRepository.save(ticket);

                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "ticketId", ticket.getId(),
                        "message", "Тикет создан"
                ));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Внутренняя ошибка: " + e.getMessage()));
        }
    }

    // Эндпоинт для загрузки истории переписки по ID тикета
    @GetMapping("/public/{id}")
    public ResponseEntity<?> getPublicTicket(@PathVariable Long id) {
        try {
            TicketDto ticket = supportService.getTicket(id);
            return ResponseEntity.ok(ticket);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Тикет не найден"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Ошибка сервера"));
        }
    }
}
