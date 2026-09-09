package com.store.controller;

import com.store.dto.PortfolioDtos;
import com.store.dto.PortfolioDtos.PortfolioWorkDto;
import com.store.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @GetMapping
    public ResponseEntity<List<PortfolioWorkDto>> getAll(@RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(portfolioService.getAll(categoryId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PortfolioWorkDto> getById(@PathVariable Long id) {
        return portfolioService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ===== ADMIN: создание =====
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> create(@RequestBody PortfolioDtos.PortfolioWorkRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(portfolioService.create(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ===== ADMIN: обновление =====
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody PortfolioDtos.PortfolioWorkRequest request) {
        try {
            return ResponseEntity.ok(portfolioService.update(id, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ===== ADMIN: удаление =====
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            portfolioService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
