package com.store.mapper;

import com.store.dto.CategoryDto;
import com.store.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CategoryMapper {

    CategoryMapper INSTANCE = Mappers.getMapper(CategoryMapper.class);

    CategoryDto toDto(Category category);

    Category toEntity(CategoryDto categoryDto);
}
