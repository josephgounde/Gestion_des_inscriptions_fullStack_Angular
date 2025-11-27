package com.groupe.gestin_inscription.services.serviceImpl;


import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.groupe.gestin_inscription.dto.request.AcademicHistoryRequestDTO;
import com.groupe.gestin_inscription.dto.request.UserRequestDTO;
import com.groupe.gestin_inscription.dto.response.UserResponseDTO;
import com.groupe.gestin_inscription.model.AcademicHistory;
import com.groupe.gestin_inscription.model.Enums.Gender;
import com.groupe.gestin_inscription.model.Enums.UserRole;
import com.groupe.gestin_inscription.model.User;
import com.groupe.gestin_inscription.repository.AcademicHistoryRepository;
import com.groupe.gestin_inscription.repository.UserRepository;
import com.groupe.gestin_inscription.services.serviceInterfaces.UserService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AcademicHistoryRepository academicHistoryRepository;

    @Override
    @Transactional
    public UserResponseDTO createUser(UserRequestDTO userRequestDTO) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(userRequestDTO.getUsername())) {
            throw new IllegalArgumentException("Username already exists: " + userRequestDTO.getUsername());
        }
        if (userRepository.existsByEmail(userRequestDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + userRequestDTO.getEmail());
        }

        User user = mapToUserEntity(userRequestDTO);
        AcademicHistory academicHistory = mapToAcademicHistoryEntity(userRequestDTO.getAcademicHistory());

        user.setAcademicHistory(academicHistory);
        user.setRole(UserRole.CANDIDATE);

        // Hash the password before saving
        if (userRequestDTO.getPassword() != null && !userRequestDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        }

        User savedUser = userRepository.save(user);
        return mapToUserResponseDTO(savedUser);
    }

    @Transactional(readOnly = true)
    public Optional<UserResponseDTO> findById(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            return userOptional.map(this::mapToUserResponseDTO); 
        } else {
            throw new NoSuchElementException("User not found with id: " + id);
        }
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<UserResponseDTO> findByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            return userOptional.map(this::mapToUserResponseDTO); 
        } else {
            throw new NoSuchElementException("No User found with Username: " + username);
        }
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<UserResponseDTO> findByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            return userOptional.map(this::mapToUserResponseDTO); 
        } else {
            throw new NoSuchElementException("No User found with the Email: " + email);
        }
    }

    @Transactional(readOnly = true)
    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponseDTO) 
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public UserResponseDTO updateUser(Long id, UserRequestDTO request) {
        User concernedUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Update fields only if provided in the request
        if (request.getUsername() != null && !request.getUsername().equals(concernedUser.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new IllegalArgumentException("Username already taken: " + request.getUsername());
            }
            concernedUser.setUsername(request.getUsername());
        }
        if (request.getEmail() != null && !request.getEmail().equals(concernedUser.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email already in use: " + request.getEmail());
            }
            concernedUser.setEmail(request.getEmail());
        }
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            concernedUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getFirstName() != null) {
            concernedUser.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            concernedUser.setLastName(request.getLastName());
        }
        //Update additional fields if provided
        if (request.getGender() != null) {
            concernedUser.setGender(Gender.valueOf(request.getGender().toUpperCase()));
        }
        if (request.getDateOfBirth() != null) {
            concernedUser.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
        }
        if (request.getNationality() != null) {
            concernedUser.setNationality(request.getNationality());
        }
        if (request.getPhoneNumber() != null) {
            concernedUser.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            concernedUser.setAddress(request.getAddress());
        }

        User updatedUser = userRepository.save(concernedUser);
        return mapToUserResponseDTO(updatedUser);
    }

    @Transactional
    @Override
    public void deleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    /**
     * Helper method to map a UserRequestDTO to a User entity.
     */
    private User mapToUserEntity(UserRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        User user = new User();
        user.setUsername(dto.getUsername()); 
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        if (dto.getGender() != null) {
            user.setGender(Gender.valueOf(dto.getGender().toUpperCase()));
        }
        if (dto.getDateOfBirth() != null) {
            user.setDateOfBirth(LocalDate.parse(dto.getDateOfBirth()));
        }
        user.setNationality(dto.getNationality());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setAddress(dto.getAddress());
        user.setEmergencyContact(dto.getEmergencyContact());
        return user;
    }

    /**
     * Helper method to map a User's academic history from the DTO to an AcademicHistory entity.
     */
    private AcademicHistory mapToAcademicHistoryEntity(AcademicHistoryRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        AcademicHistory academicHistory = new AcademicHistory();
        academicHistory.setLastInstitution(dto.getLastInstitution());
        academicHistory.setSpecialization(dto.getSpecialization());
        if (dto.getFormationPeriodStart() != null) {
            academicHistory.setStartDate(LocalDate.parse(dto.getFormationPeriodStart()));
        }
        if (dto.getFormationPeriodEnd() != null) {
            academicHistory.setEndDate(LocalDate.parse(dto.getFormationPeriodEnd()));
        }
        return academicHistoryRepository.save(academicHistory);
    }

    /**
     * Helper method to map a User entity to a UserResponseDTO.
     * uses the @AllArgsConstructor or setters to create and populate the DTO.
     */
    private UserResponseDTO mapToUserResponseDTO(User user) {
        if (user == null) {
            return null;
        }
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setGender(user.getGender() != null ? user.getGender().name() : null);
        dto.setDateOfBirth(user.getDateOfBirth() != null ? user.getDateOfBirth().toString() : null);
        dto.setNationality(user.getNationality());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddress(user.getAddress());
        dto.setRole(user.getRole()); 
        return dto;
    }
}