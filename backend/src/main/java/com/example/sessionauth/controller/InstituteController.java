package com.example.sessionauth.controller;

import com.example.sessionauth.dto.InstituteDTO;
import com.example.sessionauth.service.InstituteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/institutes")
public class InstituteController {
    private final InstituteService instituteService;

    public InstituteController(InstituteService instituteService) {
        this.instituteService = instituteService;
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<InstituteDTO> createInstitute(@RequestBody InstituteDTO instituteDTO) {
        InstituteDTO createdInstitute = instituteService.createInstitute(instituteDTO);
        return new ResponseEntity<>(createdInstitute, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<InstituteDTO> getInstituteById(@PathVariable Long id) {
        InstituteDTO instituteDTO = instituteService.getInstituteById(id);
        return ResponseEntity.ok(instituteDTO);
    }

    @GetMapping("/getAll")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<List<InstituteDTO>> getAllInstitutes() {
        List<InstituteDTO> institutes = instituteService.getAllInstitutes();
        return ResponseEntity.ok(institutes);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<InstituteDTO> updateInstitute(
            @PathVariable Long id,
            @RequestBody InstituteDTO instituteDTO) {
        InstituteDTO updatedInstitute = instituteService.updateInstitute(id, instituteDTO);
        return ResponseEntity.ok(updatedInstitute);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<Void> deleteInstitute(@PathVariable Long id) {
        instituteService.deleteInstitute(id);
        return ResponseEntity.noContent().build();
    }
}