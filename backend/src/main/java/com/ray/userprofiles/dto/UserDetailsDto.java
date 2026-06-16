package com.ray.userprofiles.dto;

import com.ray.userprofiles.entity.Address;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserDetailsDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private List<Address> addresses;
}