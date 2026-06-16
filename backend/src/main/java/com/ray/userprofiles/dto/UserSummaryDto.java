package com.ray.userprofiles.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserSummaryDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private int addressCount;
}