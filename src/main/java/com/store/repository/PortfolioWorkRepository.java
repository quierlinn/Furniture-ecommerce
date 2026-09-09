package com.store.repository;

import com.store.entity.PortfolioWork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioWorkRepository extends JpaRepository<PortfolioWork, Long> {
    List<PortfolioWork> findAllByOrderByCreatedAtDesc();
    List<PortfolioWork> findByCategoryIdOrderByCreatedAtDesc(Long categoryId);
}
