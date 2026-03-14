package com.store.mapper;

import com.store.dto.UserDto;
import com.store.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(target = "password", ignore = true)
    UserDto toDto(User user);

    @Mapping(target = "password", ignore = true)
    User toEntity(UserDto userDto);
}
