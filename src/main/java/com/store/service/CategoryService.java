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
}
