package com.ray.userprofiles.service;

import com.ray.userprofiles.dto.*;
import com.ray.userprofiles.exception.ResourceNotFoundException;
import com.ray.userprofiles.entity.Address;
import com.ray.userprofiles.entity.User;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final Map<Long, User> users = new ConcurrentHashMap<>();
    private final AtomicLong userIdSeq = new AtomicLong(1);
    private final AtomicLong addressIdSeq = new AtomicLong(1);

    @PostConstruct
    public void seed() {
        createUser("martin@gatenine.dev", "Martin", "Odegaard", List.of(
                buildAddress("Home", "14 Colombo", null, "Kandy", "Central", "20000", "Sri Lanka"),
                buildAddress("Office", "GateNine HQ", "Floor 2", "Kandy", "Central", "20000", "Sri Lanka")
        ));
        createUser("messi@chambersone.com", "Lionel", "Messi", List.of(
                buildAddress("Office", "Al Zahiya", "Suite 401", "Dubai", "Dubai", "00000", "UAE")
        ));
        createUser("jane.doe@example.com", "Jane", "Doe", List.of(
                buildAddress("Home", "221B Baker Street", null, "London", null, "NW1 6XE", "UK"),
                buildAddress("Holiday", "Villa 7", null, "Lisbon", null, "1100-148", "Portugal"),
                buildAddress("Office", "Canary Wharf", "Level 12", "London", null, "E14 5AB", "UK")
        ));
        createUser("john.smith@example.com", "John", "Smith", List.of());
    }

    private Address buildAddress(String label, String l1, String l2, String city, String state, String postal, String country) {
        return Address.builder()
                .id(addressIdSeq.getAndIncrement())
                .label(label).line1(l1).line2(l2)
                .city(city).state(state).postalCode(postal).country(country)
                .build();
    }

    private void createUser(String email, String firstName, String lastName, List<Address> addresses) {
        long id = userIdSeq.getAndIncrement();
        users.put(id, User.builder()
                .id(id).email(email).firstName(firstName).lastName(lastName)
                .addresses(new ArrayList<>(addresses))
                .build());
    }

    public List<UserSummaryDto> listUsers() {
        return users.values().stream()
                .sorted(Comparator.comparing(User::getId))
                .map(u -> UserSummaryDto.builder()
                        .id(u.getId())
                        .email(u.getEmail())
                        .firstName(u.getFirstName())
                        .lastName(u.getLastName())
                        .addressCount(u.getAddresses().size())
                        .build())
                .collect(Collectors.toList());
    }

    public UserDetailsDto getUser(Long id) {
        User u = requireUser(id);
        return toDetail(u);
    }

    public UserDetailsDto updateUser(Long id, UpdateUserRequest req) {
        User u = requireUser(id);
        u.setEmail(req.getEmail());
        u.setFirstName(req.getFirstName());
        u.setLastName(req.getLastName());
        return toDetail(u);
    }

    public Address addAddress(Long userId, AddressRequest req) {
        User u = requireUser(userId);
        Address a = Address.builder()
                .id(addressIdSeq.getAndIncrement())
                .label(req.getLabel())
                .line1(req.getLine1())
                .line2(req.getLine2())
                .city(req.getCity())
                .state(req.getState())
                .postalCode(req.getPostalCode())
                .country(req.getCountry())
                .build();
        u.getAddresses().add(a);
        return a;
    }

    public Address updateAddress(Long userId, Long addressId, AddressRequest req) {
        User u = requireUser(userId);
        Address a = u.getAddresses().stream()
                .filter(x -> x.getId().equals(addressId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Address not found: " + addressId));
        a.setLabel(req.getLabel());
        a.setLine1(req.getLine1());
        a.setLine2(req.getLine2());
        a.setCity(req.getCity());
        a.setState(req.getState());
        a.setPostalCode(req.getPostalCode());
        a.setCountry(req.getCountry());
        return a;
    }

    public void deleteAddress(Long userId, Long addressId) {
        User u = requireUser(userId);
        boolean removed = u.getAddresses().removeIf(x -> x.getId().equals(addressId));
        if (!removed) throw new ResourceNotFoundException("Address not found: " + addressId);
    }

    private User requireUser(Long id) {
        User u = users.get(id);
        if (u == null) throw new ResourceNotFoundException("User not found: " + id);
        return u;
    }

    private UserDetailsDto toDetail(User u) {
        return UserDetailsDto.builder()
                .id(u.getId())
                .email(u.getEmail())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .addresses(new ArrayList<>(u.getAddresses()))
                .build();
    }
}