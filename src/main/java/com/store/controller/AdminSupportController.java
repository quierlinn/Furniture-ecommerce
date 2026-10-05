package com.store.controller;

import com.store.dto.SupportDtos.AdminReplyRequest;
import com.store.dto.SupportDtos.StatsDto;
import com.store.dto.SupportDtos.TicketDto;
import com.store.service.SupportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/support")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSupportController {

    @Autowired
    private SupportService supportService;

    @GetMapping
    public ResponseEntity<List<TicketDto>> getAllTickets() {
        return ResponseEntity.ok(supportService.getAllTickets());
    }

    @GetMapping("/stats")
    public ResponseEntity<StatsDto> getStats() {
        return ResponseEntity.ok(supportService.stats());
    }

    @PostMapping("/{id}/reply")
    public ResponseEntity<TicketDto> reply(@PathVariable Long id, @RequestBody AdminReplyRequest request) {
        return ResponseEntity.ok(supportService.adminReply(id, request.text()));
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<TicketDto> resolve(@PathVariable Long id) {
        return ResponseEntity.ok(supportService.resolve(id));
    }

    @PostMapping("/{id}/close")
    public ResponseEntity<TicketDto> close(@PathVariable Long id) {
        return ResponseEntity.ok(supportService.close(id));
    }
}
