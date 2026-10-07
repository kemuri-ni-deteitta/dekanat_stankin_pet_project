package com.example.sessionauth.controller;

import com.example.sessionauth.dto.ScholarshipDTO;
import com.example.sessionauth.service.ScholarshipService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/scholarships")
public class ScholarshipController {
    private final ScholarshipService scholarshipService;

    public ScholarshipController(ScholarshipService scholarshipService) {
        this.scholarshipService = scholarshipService;
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<ScholarshipDTO> createScholarship(@RequestBody ScholarshipDTO scholarshipDTO) {
        ScholarshipDTO createdScholarship = scholarshipService.createScholarship(scholarshipDTO);
        return new ResponseEntity<>(createdScholarship, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<ScholarshipDTO> getScholarshipById(@PathVariable Long id) {
        ScholarshipDTO scholarshipDTO = scholarshipService.getScholarshipById(id);
        return ResponseEntity.ok(scholarshipDTO);
    }

    @GetMapping("/getAll")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<List<ScholarshipDTO>> getAllScholarships() {
        List<ScholarshipDTO> scholarships = scholarshipService.getAllScholarships();
        return ResponseEntity.ok(scholarships);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<ScholarshipDTO> updateScholarship(
            @PathVariable Long id,
            @RequestBody ScholarshipDTO scholarshipDTO) {
        ScholarshipDTO updatedScholarship = scholarshipService.updateScholarship(id, scholarshipDTO);
        return ResponseEntity.ok(updatedScholarship);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<Void> deleteScholarship(@PathVariable Long id) {
        scholarshipService.deleteScholarship(id);
        return ResponseEntity.noContent().build();
    }
}
