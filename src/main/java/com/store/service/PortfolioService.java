package com.store.service;

import com.store.dto.PortfolioDtos.PortfolioReviewDto;
import com.store.dto.PortfolioDtos.PortfolioWorkDto;
import com.store.dto.PortfolioDtos.PortfolioWorkRequest;
import com.store.entity.Category;
import com.store.entity.PortfolioReview;
import com.store.entity.PortfolioWork;
import com.store.repository.CategoryRepository;
import com.store.repository.PortfolioWorkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class PortfolioService {

    @Autowired
    private PortfolioWorkRepository workRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<PortfolioWorkDto> getAll(Long categoryId) {
        List<PortfolioWork> works = (categoryId != null)
                ? workRepository.findByCategoryIdOrderByCreatedAtDesc(categoryId)
                : workRepository.findAllByOrderByCreatedAtDesc();
        return works.stream().map(this::toDto).toList();
    }

    public Optional<PortfolioWorkDto> getById(Long id) {
        return workRepository.findById(id).map(this::toDto);
    }

    private PortfolioWorkDto toDto(PortfolioWork w) {
        List<PortfolioReviewDto> reviews = w.getReviews().stream()
                .sorted(Comparator.comparing(PortfolioReview::getCreatedAt).reversed())
                .map(r -> new PortfolioReviewDto(
                        r.getId(),
                        r.getAuthorName(),
                        r.getText(),
                        r.getRating(),
                        r.getCreatedAt()
                ))
                .toList();

        return new PortfolioWorkDto(
                w.getId(),
                w.getTitle(),
                w.getDescription(),
                w.getCategory() != null ? w.getCategory().getId() : null,
                w.getCategory() != null ? w.getCategory().getName() : null,
                w.getImages(),
                w.getCreatedAt(),
                reviews
        );
    }

    // ===== CREATE =====
    @Transactional
    public PortfolioWorkDto create(PortfolioWorkRequest req) {
        validate(req);
        PortfolioWork work = new PortfolioWork();
        apply(work, req);
        return toDto(workRepository.save(work));
    }

    // ===== UPDATE =====
    @Transactional
    public PortfolioWorkDto update(Long id, PortfolioWorkRequest req) {
        validate(req);
        PortfolioWork work = workRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Работа не найдена"));
        apply(work, req);
        return toDto(workRepository.save(work));
    }

    // ===== DELETE (отзывы удалятся каскадно) =====
    @Transactional
    public void delete(Long id) {
        if (!workRepository.existsById(id)) {
            throw new IllegalArgumentException("Работа не найдена");
        }
        workRepository.deleteById(id);
    }

    private void validate(PortfolioWorkRequest req) {
        if (req.title() == null || req.title().trim().isEmpty()) {
            throw new IllegalArgumentException("Укажите название работы");
        }
        if (req.description() == null || req.description().trim().isEmpty()) {
            throw new IllegalArgumentException("Добавьте описание работы");
        }
    }

    private void apply(PortfolioWork work, PortfolioWorkRequest req) {
        work.setTitle(req.title().trim());
        work.setDescription(req.description().trim());

        if (req.categoryId() != null) {
            Category category = categoryRepository.findById(req.categoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Категория не найдена"));
            work.setCategory(category);
        } else {
            work.setCategory(null);
        }

        work.setImages(req.images() != null ? req.images() : new ArrayList<>());
    }
}
