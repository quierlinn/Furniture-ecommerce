package com.store.controller;

import com.store.dto.SubcategoryDto;
import com.store.service.SubcategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class SubcategoryController {

    @Autowired
    private SubcategoryService subcategoryService;

    // ===== ПУБЛИЧНО =====
    @GetMapping("/api/subcategories")
    public ResponseEntity<List<SubcategoryDto>> getAll() {
        return ResponseEntity.ok(subcategoryService.getAll());
    }

    @GetMapping("/api/subcategories/category/{categoryId}")
    public ResponseEntity<List<SubcategoryDto>> getByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(subcategoryService.getByCategory(categoryId));
    }

    // ===== АДМИН =====
    @PostMapping("/api/admin/subcategories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> create(@RequestParam Long categoryId, @RequestParam String name) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(subcategoryService.create(categoryId, name));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/api/admin/subcategories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestParam Long categoryId,
                                    @RequestParam String name) {
        try {
            return ResponseEntity.ok(subcategoryService.update(id, categoryId, name));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/api/admin/subcategories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            subcategoryService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
