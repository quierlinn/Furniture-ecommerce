package com.store.controller;

import com.store.entity.SupportMessage;
import com.store.entity.SupportTicket;
import com.store.repository.SupportTicketRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
public class PublicSupportController {

    private final SupportTicketRepository supportTicketRepository;

    public PublicSupportController(SupportTicketRepository supportTicketRepository) {
        this.supportTicketRepository = supportTicketRepository;
    }

    @PostMapping("/public")
    public ResponseEntity<?> createPublicTicket(@RequestBody Map<String, String> request) {
        try {
            String name = request.getOrDefault("name", "Посетитель сайта");
            String messageText = request.get("message");

            if (messageText == null || messageText.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Сообщение не может быть пустым"));
            }

            // 1. Создаём тикет
            SupportTicket ticket = new SupportTicket();
            ticket.setTelegramChatId(-1L); // -1 означает, что это веб-чат, а не Telegram
            ticket.setTelegramName(name);  // Имя из формы сохраняем сюда
            ticket.setStatus(SupportTicket.Status.OPEN);
            ticket.setSubject("Сообщение с сайта");
            // createdAt уже установлен по умолчанию в LocalDateTime.now()
            ticket.setUpdatedAt(LocalDateTime.now());

            // 2. Создаём первое сообщение и привязываем к тикету
            SupportMessage firstMessage = new SupportMessage();

            // ⚠️ ВАЖНО: проверь в SupportMessage.java, как называется поле текста.
            // Если там "message", замени setText на setMessage.
            firstMessage.setText(messageText);
            // createdAt уже установлен по умолчанию
            firstMessage.setTicket(ticket);

            ticket.getMessages().add(firstMessage);

            // 3. Сохраняем (CascadeType.ALL сохранит и сообщение тоже)
            supportTicketRepository.save(ticket);

            return ResponseEntity.ok(Map.of("success", true, "message", "Сообщение успешно отправлено"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Внутренняя ошибка: " + e.getMessage()));
        }
    }
}
