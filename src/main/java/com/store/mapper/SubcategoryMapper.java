package com.store.mapper;

import com.store.dto.SubcategoryDto;
import com.store.entity.Subcategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface SubcategoryMapper {
    SubcategoryMapper INSTANCE = Mappers.getMapper(SubcategoryMapper.class);

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    SubcategoryDto toDto(Subcategory subcategory);
}
