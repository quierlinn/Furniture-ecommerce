package com.store.mapper;

import com.store.dto.OrderItemDto;
import com.store.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface OrderItemMapper {
    
    OrderItemMapper INSTANCE = Mappers.getMapper(OrderItemMapper.class);
    
    @Mapping(target = "id", source = "id")
    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "price", source = "price")
    OrderItemDto toDto(OrderItem orderItem);
    
    @Mapping(target = "id", source = "id")
    @Mapping(target = "product.id", source = "productId")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "price", source = "price")
    OrderItem toEntity(OrderItemDto orderItemDto);
}
