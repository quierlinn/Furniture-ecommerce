package com.store.mapper;

import com.store.dto.ProductDto;
import com.store.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ProductMapper {

    ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

    // Entity → DTO
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "imageUrl", source = "imageUrl")
    @Mapping(target = "categoryId", source = "category.id")  // ✅ Берём ID из объекта
    @Mapping(target = "category", source = "category")        // ✅ Маппим весь объект
    ProductDto toDto(Product product);

    // DTO → Entity
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "imageUrl", source = "imageUrl")
    @Mapping(target = "category.id", source = "categoryId")   // ✅ Создаём заглушку категории по ID
    @Mapping(target = "category", ignore = true)              // ✅ Игнорируем, чтобы не создавать новую
    Product toEntity(ProductDto productDto);
}
