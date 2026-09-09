package com.store.repository;

import com.store.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByNameIgnoreCase(String name);

    @Query("select count(p) from Product p where p.category.id = :id")
    long countProductsByCategoryId(@Param("id") Long id);
}
