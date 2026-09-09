package com.store.service;

import com.store.dto.CategoryDto;
import com.store.entity.Category;
import com.store.mapper.CategoryMapper;
import com.store.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }

    public Optional<CategoryDto> getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .map(CategoryMapper.INSTANCE::toDto);
    }

    // ===== CREATE =====
    @Transactional
    public CategoryDto createCategory(String name) {
        String normalized = normalize(name);
        if (categoryRepository.existsByNameIgnoreCase(normalized)) {
            throw new IllegalArgumentException("Категория с таким названием уже существует");
        }
        Category category = new Category(normalized);
        return CategoryMapper.INSTANCE.toDto(categoryRepository.save(category));
    }

    // ===== UPDATE =====
    @Transactional
    public CategoryDto updateCategory(Long id, String name) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Категория не найдена"));

        String normalized = normalize(name);
        boolean sameName = category.getName().equalsIgnoreCase(normalized);
        if (!sameName && categoryRepository.existsByNameIgnoreCase(normalized)) {
            throw new IllegalArgumentException("Категория с таким названием уже существует");
        }

        category.setName(normalized);
        category.setUpdatedAt(java.time.LocalDateTime.now());
        return CategoryMapper.INSTANCE.toDto(categoryRepository.save(category));
    }

    // ===== DELETE (вариант A: запрещаем, если есть товары) =====
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Категория не найдена"));

        if (categoryRepository.countProductsByCategoryId(id) > 0) {
            throw new IllegalArgumentException(
                    "В этой категории есть товары. Сначала перенесите или удалите их.");
        }
        categoryRepository.delete(category);
    }

    private String normalize(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Название категории не может быть пустым");
        }
        return name.trim();
    }
}
