package com.store.service;

import com.store.dto.SubcategoryDto;
import com.store.entity.Category;
import com.store.entity.Subcategory;
import com.store.mapper.SubcategoryMapper;
import com.store.repository.CategoryRepository;
import com.store.repository.SubcategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class SubcategoryService {

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<SubcategoryDto> getAll() {
        return subcategoryRepository.findAll().stream()
                .map(SubcategoryMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }

    public List<SubcategoryDto> getByCategory(Long categoryId) {
        return subcategoryRepository.findByCategoryIdOrderByNameAsc(categoryId).stream()
                .map(SubcategoryMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubcategoryDto create(Long categoryId, String name) {
        String normalized = normalize(name);
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Категория не найдена"));

        if (subcategoryRepository.existsByCategoryIdAndNameIgnoreCase(categoryId, normalized)) {
            throw new IllegalArgumentException(
                    "В категории «" + category.getName() + "» уже есть подкатегория с таким названием");
        }

        Subcategory sub = new Subcategory();
        sub.setName(normalized);
        sub.setCategory(category);
        return SubcategoryMapper.INSTANCE.toDto(subcategoryRepository.save(sub));
    }

    @Transactional
    public SubcategoryDto update(Long id, Long categoryId, String name) {
        Subcategory sub = subcategoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Подкатегория не найдена"));

        String normalized = normalize(name);
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Категория не найдена"));

        boolean sameCategory = sub.getCategory().getId().equals(categoryId);
        boolean sameName = sub.getName().equalsIgnoreCase(normalized);

        if (!(sameCategory && sameName) &&
                subcategoryRepository.existsByCategoryIdAndNameIgnoreCaseAndIdNot(categoryId, normalized, id)) {
            throw new IllegalArgumentException(
                    "В категории «" + category.getName() + "» уже есть подкатегория с таким названием");
        }

        sub.setName(normalized);
        sub.setCategory(category);
        sub.setUpdatedAt(LocalDateTime.now());
        return SubcategoryMapper.INSTANCE.toDto(subcategoryRepository.save(sub));
    }

    @Transactional
    public void delete(Long id) {
        if (!subcategoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Подкатегория не найдена");
        }
        subcategoryRepository.deleteById(id);
        // товары, у которых была эта подкатегория, останутся, но с null subcategory_id (FK ON DELETE SET NULL)
    }

    private String normalize(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Название подкатегории не может быть пустым");
        }
        return name.trim();
    }
}
