package com.store.repository;

import com.store.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId")
    Page<Product> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Product> findByNameContainingIgnoreCase(@Param("query") String query, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Product> findByCategoryIdAndNameContainingIgnoreCase(
            @Param("categoryId") Long categoryId,
            @Param("query") String query,
            Pageable pageable);
}
