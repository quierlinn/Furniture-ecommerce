package com.store.mapper;

import com.store.dto.ProductDto;
import com.store.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ProductMapper {

    ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

    @Mapping(target = "categoryId", source = "category.id")
    ProductDto toDto(Product product);

    @Mapping(target = "category.id", source = "categoryId")
    @Mapping(target = "category", ignore = true)
    Product toEntity(ProductDto productDto);
}
