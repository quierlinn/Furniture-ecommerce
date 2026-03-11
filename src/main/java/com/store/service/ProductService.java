package com.store.service;

import com.store.dto.ProductDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ProductService {

    Page<ProductDto> getAllProducts(Pageable pageable);

    Page<ProductDto> getProductsByCategory(Long categoryId, Pageable pageable);

    Page<ProductDto> searchProducts(String searchTerm, Pageable pageable);

    Page<ProductDto> searchProductsByCategory(Long categoryId, String searchTerm, Pageable pageable);

    Optional<ProductDto> getProductById(Long id);

    ProductDto createProduct(ProductDto productDto);

    ProductDto updateProduct(Long id, ProductDto productDto);

    void deleteProduct(Long id);

    List<ProductDto> getProductsByIds(List<Long> ids);
}
