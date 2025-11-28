package com.groupe.gestin_inscription.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.groupe.gestin_inscription.dto.request.AdministratorCreationDTO;
import com.groupe.gestin_inscription.dto.request.administratorRequestDTO;
import com.groupe.gestin_inscription.model.Administrator;
import com.groupe.gestin_inscription.model.Enums.AdministratorRole;
import com.groupe.gestin_inscription.repository.AdministratorRepository;
import com.groupe.gestin_inscription.security.Utils.ObjectLevelSecurity;
import com.groupe.gestin_inscription.services.serviceImpl.AdministratorServiceImpl;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin Management")

public class AdministratorController {

    @Autowired
    private AdministratorServiceImpl administratorService;
    
    @Autowired
    private AdministratorRepository administratorRepository;
    
    private ObjectLevelSecurity objectLevelSecurity;

    @Operation(summary = "Completes the profile for the currently authenticated administrator.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profile updated successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Not authorized")
    })
    @PutMapping("/profile/complete")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Administrator> completeProfile(@RequestBody administratorRequestDTO profileDTO) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentAdminUsername = authentication.getName();

        Administrator updatedAdmin = administratorService.completeAdminProfile(currentAdminUsername, profileDTO);

        return ResponseEntity.ok(updatedAdmin);
    }

    @Operation(
            summary = "Create a new Agent account",
            description = "Allows a Super Admin to create a new Administrator account with the 'AGENT' role."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Agent account created successfully",
                    content = @Content(schema = @Schema(implementation = Administrator.class))
            ),
            @ApiResponse(responseCode = "400", description = "Invalid input data (e.g., email already exists)"),
            @ApiResponse(responseCode = "403", description = "Forbidden: User must have the 'SUPER_ADMIN' role")
    })
    @PostMapping("/profile/agent")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Administrator> createNewAgent(@RequestBody AdministratorCreationDTO creationDTO) {
        Administrator newAgent = administratorService.createAgent(creationDTO);
        return ResponseEntity.ok(newAgent);
    }

    // NEW ENDPOINT - Get list of all agents
    @Operation(
            summary = "Get all agents",
            description = "Returns a list of all administrators with AGENT role for assignment purposes"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "List of agents retrieved successfully",
                    content = @Content(schema = @Schema(implementation = Administrator.class))
            ),
            @ApiResponse(responseCode = "403", description = "Forbidden: User must have admin role")
    })
    @GetMapping("/agents")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('AGENT')")
    public ResponseEntity<List<AgentDTO>> getAllAgents() {
        // Get all administrators with AGENT role
        List<Administrator> agents = administratorRepository.findAll().stream()
                .filter(admin -> admin.getRole() == AdministratorRole.AGENT)
                .collect(Collectors.toList());
        
        // Convert to DTO to avoid exposing passwords
        List<AgentDTO> agentDTOs = agents.stream()
                .map(agent -> new AgentDTO(
                        agent.getId(),
                        agent.getFirstName(),
                        agent.getLastName(),
                        agent.getEmail(),
                        agent.getUserName(),
                        agent.getRole().name()
                ))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(agentDTOs);
    }
    
    // DTO for Agent response (avoids exposing password)
    public static class AgentDTO {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String userName;
        private String role;
        
        public AgentDTO(Long id, String firstName, String lastName, String email, String userName, String role) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.userName = userName;
            this.role = role;
        }
        
        // Getters
        public Long getId() { return id; }
        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        public String getEmail() { return email; }
        public String getUserName() { return userName; }
        public String getRole() { return role; }
        
        // Setters
        public void setId(Long id) { this.id = id; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public void setEmail(String email) { this.email = email; }
        public void setUserName(String userName) { this.userName = userName; }
        public void setRole(String role) { this.role = role; }
    }
}