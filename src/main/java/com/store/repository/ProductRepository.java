package com.store.repository;

import com.store.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    @Query(value = "SELECT * FROM products p WHERE " +
            "p.name LIKE CONCAT('%', :searchTerm, '%') OR p.description LIKE CONCAT('%', :searchTerm, '%')",
            countQuery = "SELECT COUNT(*) FROM products p WHERE " +
            "p.name LIKE CONCAT('%', :searchTerm, '%') OR p.description LIKE CONCAT('%', :searchTerm, '%')",
            nativeQuery = true)
    Page<Product> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);

    @Query(value = "SELECT * FROM products p WHERE " +
            "(p.category_id = :categoryId OR :categoryId IS NULL) AND " +
            "(:searchTerm IS NULL OR p.name LIKE CONCAT('%', :searchTerm, '%') OR p.description LIKE CONCAT('%', :searchTerm, '%'))",
            countQuery = "SELECT COUNT(*) FROM products p WHERE " +
            "(p.category_id = :categoryId OR :categoryId IS NULL) AND " +
            "(:searchTerm IS NULL OR p.name LIKE CONCAT('%', :searchTerm, '%') OR p.description LIKE CONCAT('%', :searchTerm, '%'))",
            nativeQuery = true)
    Page<Product> findByCategoryIdAndSearchTerm(
            @Param("categoryId") Long categoryId,
            @Param("searchTerm") String searchTerm,
            Pageable pageable
    );

    List<Product> findByIdIn(List<Long> ids);
}
