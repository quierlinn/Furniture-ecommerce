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
import com.store.entity.Subcategory;
import com.store.repository.SubcategoryRepository;

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
    private final SubcategoryRepository subcategoryRepository;

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
    public Page<ProductDto> getProductsBySubcategory(Long subcategoryId, Pageable pageable) {
        return productRepository.findBySubcategoryId(subcategoryId, pageable)
                .map(ProductMapper.INSTANCE::toDto);
    }

    @Override
    public Page<ProductDto> getProductsByCategoryAndSubcategory(Long categoryId, Long subcategoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndSubcategoryId(categoryId, subcategoryId, pageable)
                .map(ProductMapper.INSTANCE::toDto);
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
                    .orElseThrow(() -> new RuntimeException("Категория не найдена: " + productDto.getCategoryId()));
            product.setCategory(category);
        }

        // <-- ДОБАВИТЬ ЭТОТ БЛОК для подкатегории при создании
        if (productDto.getSubcategoryId() != null) {
            Subcategory subcategory = subcategoryRepository.findById(productDto.getSubcategoryId())
                    .orElseThrow(() -> new RuntimeException("Подкатегория не найдена: " + productDto.getSubcategoryId()));
            product.setSubcategory(subcategory);
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
                .orElseThrow(() -> new RuntimeException("Товар не найден: " + id));

        existing.setName(productDto.getName());
        existing.setDescription(productDto.getDescription());
        existing.setPrice(productDto.getPrice());
        existing.setImages(productDto.getImages());

        if (productDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Категория не найдена: " + productDto.getCategoryId()));
            existing.setCategory(category);
        }

        // <-- ДОБАВИТЬ ЭТОТ БЛОК для обновления подкатегории
        if (productDto.getSubcategoryId() != null) {
            Subcategory subcategory = subcategoryRepository.findById(productDto.getSubcategoryId())
                    .orElseThrow(() -> new RuntimeException("Подкатегория не найдена: " + productDto.getSubcategoryId()));
            existing.setSubcategory(subcategory);
        } else {
            existing.setSubcategory(null); // Позволяем убрать подкатегорию, если выбрано "Без подкатегории"
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
