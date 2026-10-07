package com.example.sessionauth.service;

import com.example.sessionauth.dto.ScholarshipDTO;
import com.example.sessionauth.entity.Scholarship;
import com.example.sessionauth.enumeration.ScholarshipType;
import com.example.sessionauth.repository.ScholarshipRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScholarshipService {
    private final ScholarshipRepository scholarshipRepository;

    public ScholarshipService(ScholarshipRepository scholarshipRepository) {
        this.scholarshipRepository = scholarshipRepository;
    }

    @Transactional
    public ScholarshipDTO createScholarship(ScholarshipDTO scholarshipDTO) {
        Scholarship scholarship = new Scholarship();
        scholarship.setName(scholarshipDTO.getName());
        scholarship.setAmount(scholarshipDTO.getAmount());
        scholarship.setScholarshipType(ScholarshipType.valueOf(scholarshipDTO.getScholarshipType()));

        Scholarship savedScholarship = scholarshipRepository.save(scholarship);
        return convertToDTO(savedScholarship);
    }

    public ScholarshipDTO getScholarshipById(Long id) {
        Scholarship scholarship = scholarshipRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Scholarship not found"));
        return convertToDTO(scholarship);
    }

    public List<ScholarshipDTO> getAllScholarships() {
        return scholarshipRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ScholarshipDTO updateScholarship(Long id, ScholarshipDTO scholarshipDTO) {
        Scholarship scholarship = scholarshipRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Scholarship not found"));

        scholarship.setName(scholarshipDTO.getName());
        scholarship.setAmount(scholarshipDTO.getAmount());
        scholarship.setScholarshipType(ScholarshipType.valueOf(scholarshipDTO.getScholarshipType()));

        Scholarship updatedScholarship = scholarshipRepository.save(scholarship);
        return convertToDTO(updatedScholarship);
    }

    @Transactional
    public void deleteScholarship(Long id) {
        scholarshipRepository.deleteById(id);
    }

    private ScholarshipDTO convertToDTO(Scholarship scholarship) {
        ScholarshipDTO dto = new ScholarshipDTO();
        dto.setId(scholarship.getId());
        dto.setName(scholarship.getName());
        dto.setAmount(scholarship.getAmount());
        dto.setScholarshipType(scholarship.getScholarshipType().toString());
        return dto;
    }
}
