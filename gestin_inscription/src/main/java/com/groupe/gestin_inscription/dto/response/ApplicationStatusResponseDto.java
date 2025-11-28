package com.groupe.gestin_inscription.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ApplicationStatusResponseDto {
    private Long applicationId;
    private String status;
    private Double completionRate;
    private LocalDateTime submissionDate;
    private Long assignedAdminId;
    private String assignedAdminUsername;
    
    // Basic applicant info
    private String username;
    private String applicantName;
    
    // ✅ FIELDS THAT EXIST IN USER ENTITY:
    
    // Personal Information (from User entity)
    private String phoneNumber;           // ✅ User.phoneNumber
    private String gender;                // ✅ User.gender (Gender enum)
    private String BirthDate;           // ✅ User.dateOfBirth (LocalDate)
    private String nationality;           // ✅ User.nationality
    private String email;                 // ✅ User.email
    private String address;               // ✅ User.address
    
    // Emergency Contact (from User entity)
    private String emergencyContact;      // ✅ User.emergencyContact (single string)
    
    // Academic Information (from AcademicHistory entity)
    private String lastInstitution;       // ✅ AcademicHistory.lastInstitution
    private String specialization;        // ✅ AcademicHistory.specialization
    private String academicStartDate;     // ✅ AcademicHistory.startDate
    private String academicEndDate;       // ✅ AcademicHistory.endDate
    
    // Documents and notifications
    private List<DocumentResponseDTO> documentsStatus;
    private List<NotificationResponseDTO> recentNotifications;
}