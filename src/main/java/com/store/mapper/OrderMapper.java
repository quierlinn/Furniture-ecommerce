package com.store.mapper;

import com.store.dto.OrderDto;
import com.store.dto.OrderItemDto;
import com.store.entity.Order;
import com.store.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface OrderMapper {

    OrderMapper INSTANCE = Mappers.getMapper(OrderMapper.class);

    // ✅ Простой маппинг — только поля, которые точно есть
    @Mapping(target = "userId", source = "user.id")
    OrderDto toDto(Order order);

    @Mapping(target = "user.id", source = "userId")
    Order toEntity(OrderDto orderDto);

    // ✅ OrderItem — отдельно
    OrderItemDto toDto(OrderItem orderItem);
    OrderItem toEntity(OrderItemDto orderItemDto);
}
