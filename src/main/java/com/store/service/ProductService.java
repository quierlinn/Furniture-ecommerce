// src/main/java/com/store/service/ProductService.java

package com.store.service;

import com.store.dto.ProductDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface ProductService {
    Page<ProductDto> getAllProducts(Pageable pageable);
    Optional<ProductDto> getProductById(Long id);
    Page<ProductDto> getProductsByCategory(Long categoryId, Pageable pageable);
    Page<ProductDto> searchProducts(String query, Pageable pageable);
    Page<ProductDto> searchProductsByCategory(Long categoryId, String query, Pageable pageable);

    ProductDto createProduct(ProductDto productDto);
    ProductDto updateProduct(Long id, ProductDto productDto);
    void deleteProduct(Long id);
}
