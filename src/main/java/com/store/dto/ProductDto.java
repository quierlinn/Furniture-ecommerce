package com.store.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductDto {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private List<String> images;
    private Long categoryId;
    private Long subcategoryId;
    private String subcategoryName;
    private CategoryDto category;

    public ProductDto() {}

    public ProductDto(Long id, String name, String description, BigDecimal price,
                      List<String> images, Long categoryId, CategoryDto category, Long subcategoryId, String subcategoryName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.images = images;
        this.categoryId = categoryId;
        this.category = category;
        this.subcategoryId = subcategoryId;
        this.subcategoryName = subcategoryName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public Long getSubcategoryId() { return subcategoryId; }
    public void setSubcategoryId(Long subcategoryId) { this.subcategoryId = subcategoryId; }
    public String getSubcategoryName() { return subcategoryName; }
    public void setSubcategoryName(String subcategoryName) { this.subcategoryName = subcategoryName; }

    public CategoryDto getCategory() { return category; }
    public void setCategory(CategoryDto category) { this.category = category; }
}
