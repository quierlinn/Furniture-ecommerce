package com.store.mapper;

import com.store.dto.ReviewDto;
import com.store.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ReviewMapper {

    ReviewMapper INSTANCE = Mappers.getMapper(ReviewMapper.class);

    ReviewDto toDto(Review review);

    Review toEntity(ReviewDto dto);
}
