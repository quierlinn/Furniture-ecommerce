package com.store.service;

import com.store.dto.ReviewDto;
import com.store.entity.Review;
import com.store.mapper.ReviewMapper;
import com.store.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    /** Публично: только опубликованные */
    public List<ReviewDto> getPublished() {
        return reviewRepository.findByPublishedTrueOrderByCreatedAtDesc().stream()
                .map(ReviewMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }

    /** Админ: все с пагинацией */
    public Page<ReviewDto> getAll(Pageable pageable) {
        return reviewRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(ReviewMapper.INSTANCE::toDto);
    }

    @Transactional
    public ReviewDto create(ReviewDto dto) {
        Review review = ReviewMapper.INSTANCE.toEntity(dto);
        review.setId(null);
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());
        if (review.getRating() == null) review.setRating(5);
        if (review.getPublished() == null) review.setPublished(true);
        return ReviewMapper.INSTANCE.toDto(reviewRepository.save(review));
    }

    @Transactional
    public ReviewDto update(Long id, ReviewDto dto) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Отзыв не найден"));

        review.setAuthorName(dto.getAuthorName());
        review.setAuthorCity(dto.getAuthorCity());
        review.setRating(dto.getRating());
        review.setContent(dto.getContent());
        if (dto.getPublished() != null) review.setPublished(dto.getPublished());
        review.setUpdatedAt(LocalDateTime.now());

        return ReviewMapper.INSTANCE.toDto(reviewRepository.save(review));
    }

    @Transactional
    public ReviewDto togglePublished(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Отзыв не найден"));
        review.setPublished(!review.getPublished());
        review.setUpdatedAt(LocalDateTime.now());
        return ReviewMapper.INSTANCE.toDto(reviewRepository.save(review));
    }

    @Transactional
    public void delete(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new IllegalArgumentException("Отзыв не найден");
        }
        reviewRepository.deleteById(id);
    }
}
