// src/main/java/com/store/service/impl/ProductServiceImpl.java

package com.store.service.impl;

import com.store.dto.ProductDto;
import com.store.entity.Category;
import com.store.entity.Product;
import com.store.mapper.ProductMapper;
import com.store.repository.CategoryRepository;
import com.store.repository.ProductRepository;
import com.store.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(ProductMapper.INSTANCE::toDto);
    }

    @Override
    public Optional<ProductDto> getProductById(Long id) {
        return productRepository.findById(id).map(ProductMapper.INSTANCE::toDto);
    }

    @Override
    public Page<ProductDto> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryId(categoryId, pageable).map(ProductMapper.INSTANCE::toDto);
    }

    @Override
    public Page<ProductDto> searchProducts(String query, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(query, pageable).map(ProductMapper.INSTANCE::toDto);
    }

    @Override
    public Page<ProductDto> searchProductsByCategory(Long categoryId, String query, Pageable pageable) {
        return productRepository.findByCategoryIdAndNameContainingIgnoreCase(categoryId, query, pageable)
                .map(ProductMapper.INSTANCE::toDto);
    }

    @Override
    @Transactional
    public ProductDto createProduct(ProductDto productDto) {
        Product product = ProductMapper.INSTANCE.toEntity(productDto);

        if (productDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found: " + productDto.getCategoryId()));
            product.setCategory(category);
        }

        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        Product saved = productRepository.save(product);
        return ProductMapper.INSTANCE.toDto(saved);
    }

    @Override
    @Transactional
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));

        existing.setName(productDto.getName());
        existing.setDescription(productDto.getDescription());
        existing.setPrice(productDto.getPrice());
        existing.setImageUrl(productDto.getImageUrl());

        if (productDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found: " + productDto.getCategoryId()));
            existing.setCategory(category);
        }

        existing.setUpdatedAt(LocalDateTime.now());

        Product updated = productRepository.save(existing);
        return ProductMapper.INSTANCE.toDto(updated);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found: " + id);
        }
        productRepository.deleteById(id);
    }
}
