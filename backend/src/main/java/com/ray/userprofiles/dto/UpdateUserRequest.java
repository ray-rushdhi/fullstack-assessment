package com.ray.userprofiles.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateUserRequest {
    @NotBlank @Email
    private String email;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
}