package com.example.sessionauth.controller;

import com.example.sessionauth.dto.SubdivisionDTO;
import com.example.sessionauth.service.SubdivisionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/subdivisions")
public class SubdivisionController {
    private final SubdivisionService subdivisionService;

    public SubdivisionController(SubdivisionService subdivisionService) {
        this.subdivisionService = subdivisionService;
    }

    @PostMapping("/create")
    @PreAuthorize(value = "hasAuthority('ADMIN')")
    public ResponseEntity<SubdivisionDTO> createSubdivision(@RequestBody SubdivisionDTO subdivisionDTO) {
        SubdivisionDTO createdSubdivision = subdivisionService.createSubdivision(subdivisionDTO);
        return new ResponseEntity<>(createdSubdivision, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize(value = "hasAuthority('ADMIN')")
    public ResponseEntity<SubdivisionDTO> getSubdivisionById(@PathVariable Long id) {
        SubdivisionDTO subdivisionDTO = subdivisionService.getSubdivisionById(id);
        return ResponseEntity.ok(subdivisionDTO);
    }

    @GetMapping("/getAll")
    @PreAuthorize(value = "hasAuthority('ADMIN')")
    public ResponseEntity<List<SubdivisionDTO>> getAllSubdivisions() {
        List<SubdivisionDTO> subdivisions = subdivisionService.getAllSubdivisions();
        return ResponseEntity.ok(subdivisions);
    }

    @PutMapping("/{id}")
    @PreAuthorize(value = "hasAuthority('ADMIN')")
    public ResponseEntity<SubdivisionDTO> updateSubdivision(
            @PathVariable Long id,
            @RequestBody SubdivisionDTO subdivisionDTO) {
        SubdivisionDTO updatedSubdivision = subdivisionService.updateSubdivision(id, subdivisionDTO);
        return ResponseEntity.ok(updatedSubdivision);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(value = "hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteSubdivision(@PathVariable Long id) {
        subdivisionService.deleteSubdivision(id);
        return ResponseEntity.noContent().build();
    }
}
