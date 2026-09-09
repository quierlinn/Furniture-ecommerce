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
}
