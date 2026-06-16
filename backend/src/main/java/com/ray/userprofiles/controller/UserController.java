package com.ray.userprofiles.controller;

import com.ray.userprofiles.dto.*;
import com.ray.userprofiles.entity.Address;
import com.ray.userprofiles.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserSummaryDto> listUsers() {
        return userService.listUsers();
    }

    @GetMapping("/{id}")
    public UserDetailsDto getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }

    @PutMapping("/{id}")
    public UserDetailsDto updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest req) {
        return userService.updateUser(id, req);
    }

    @PostMapping("/{id}/addresses")
    @ResponseStatus(HttpStatus.CREATED)
    public Address addAddress(@PathVariable Long id, @Valid @RequestBody AddressRequest req) {
        return userService.addAddress(id, req);
    }

    @PutMapping("/{userId}/addresses/{addressId}")
    public Address updateAddress(@PathVariable Long userId,
                                 @PathVariable Long addressId,
                                 @Valid @RequestBody AddressRequest req) {
        return userService.updateAddress(userId, addressId, req);
    }

    @DeleteMapping("/{userId}/addresses/{addressId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long userId, @PathVariable Long addressId) {
        userService.deleteAddress(userId, addressId);
        return ResponseEntity.noContent().build();
    }
}