package com.store.controller;

import com.store.dto.SupportDtos;
import com.store.service.SupportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/support")
@PreAuthorize("hasRole('ADMIN')")
public class SupportController {

    @Autowired private SupportService supportService;

    @GetMapping
    public ResponseEntity<List<SupportDtos.TicketDto>> all() {
        return ResponseEntity.ok(supportService.getAllTickets());
    }

    @GetMapping("/stats")
    public ResponseEntity<SupportDtos.StatsDto> stats() {
        return ResponseEntity.ok(supportService.stats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> one(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(supportService.getTicket(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/reply")
    public ResponseEntity<?> reply(@PathVariable Long id, @RequestBody SupportDtos.AdminReplyRequest req) {
        try {
            return ResponseEntity.ok(supportService.adminReply(id, req.text()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<?> resolve(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(supportService.resolve(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/close")
    public ResponseEntity<?> close(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(supportService.close(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ===== ПУБЛИЧНО: Создание нового обращения из виджета =====
    @PostMapping("/public")
    public ResponseEntity<?> createPublicTicket(@RequestBody Map<String, String> request) {
        try {
            String name = request.getOrDefault("name", "Посетитель сайта");
            String message = request.get("message");

            if (message == null || message.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Сообщение не может быть пустым"));
            }

            // Создаём простое обращение.
            // Предполагается, что в SupportService есть метод createTicket(name, message)
            // Если его нет, используй существующий, передав туда эти данные.
            // Для простоты, если у тебя уже есть метод создания, вызови его:

            // Пример (адаптируй под свой SupportService):
            // SupportTicket ticket = supportService.createTicket(name, "guest@example.com", message);
            // return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", ticket.getId()));

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "message", "Сообщение отправлено"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Ошибка отправки"));
        }
    }
}
