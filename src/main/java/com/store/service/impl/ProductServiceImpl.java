package com.store.service.impl;

import com.store.dto.ProductDto;
import com.store.entity.Product;
import com.store.mapper.ProductMapper;
import com.store.repository.ProductRepository;
import com.store.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(ProductMapper.INSTANCE::toDto);
    }

    @Override
    public Page<ProductDto> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryId(categoryId, pageable)
                .map(ProductMapper.INSTANCE::toDto);
    }

    @Override
    public Page<ProductDto> searchProducts(String searchTerm, Pageable pageable) {
        return productRepository.findBySearchTerm(searchTerm, pageable)
                .map(ProductMapper.INSTANCE::toDto);
    }

    @Override
    public Page<ProductDto> searchProductsByCategory(Long categoryId, String searchTerm, Pageable pageable) {
        return productRepository.findByCategoryIdAndSearchTerm(categoryId, searchTerm, pageable)
                .map(ProductMapper.INSTANCE::toDto);
    }

    @Override
    public Optional<ProductDto> getProductById(Long id) {
        return productRepository.findById(id)
                .map(ProductMapper.INSTANCE::toDto);
    }

    @Override
    public ProductDto createProduct(ProductDto productDto) {
        Product product = ProductMapper.INSTANCE.toEntity(productDto);
        Product savedProduct = productRepository.save(product);
        return ProductMapper.INSTANCE.toDto(savedProduct);
    }

    @Override
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Update fields
        existingProduct.setName(productDto.getName());
        existingProduct.setDescription(productDto.getDescription());
        existingProduct.setPrice(productDto.getPrice());
        existingProduct.setImageUrl(productDto.getImageUrl());
        existingProduct.setCategoryId(productDto.getCategoryId());

        Product updatedProduct = productRepository.save(existingProduct);
        return ProductMapper.INSTANCE.toDto(updatedProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    @Override
    public List<ProductDto> getProductsByIds(List<Long> ids) {
        return productRepository.findByIdIn(ids)
                .stream()
                .map(ProductMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }
}
