package com.store.mapper;

import com.store.dto.OrderItemDto;
import com.store.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface OrderItemMapper {

    OrderItemMapper INSTANCE = Mappers.getMapper(OrderItemMapper.class);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    OrderItemDto toDto(OrderItem orderItem);

    @Mapping(target = "product.id", source = "productId")
    OrderItem toEntity(OrderItemDto orderItemDto);
}
