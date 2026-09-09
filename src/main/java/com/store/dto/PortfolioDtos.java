package com.store.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PortfolioDtos {

    public record PortfolioReviewDto(Long id, String authorName, String text, Integer rating, LocalDateTime createdAt) {
    }

    public record PortfolioWorkDto(
            Long id,
            String title,
            String description,
            Long categoryId,
            String categoryName,
            List<String> images,
            LocalDateTime createdAt,
            List<PortfolioReviewDto> reviews
    ) {
    }
    public record PortfolioWorkRequest(
            String title,
            String description,
            Long categoryId,
            List<String> images
    ) {}
}
