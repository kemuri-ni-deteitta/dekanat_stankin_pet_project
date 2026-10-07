package com.example.sessionauth.service;

import com.example.sessionauth.dto.SubdivisionDTO;
import com.example.sessionauth.entity.Subdivision;
import com.example.sessionauth.repository.SubdivisionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubdivisionService {
    private final SubdivisionRepository subdivisionRepository;

    public SubdivisionService(SubdivisionRepository subdivisionRepository) {
        this.subdivisionRepository = subdivisionRepository;
    }

    @Transactional
    public SubdivisionDTO createSubdivision(SubdivisionDTO subdivisionDTO) {
        Subdivision subdivision = new Subdivision();
        subdivision.setName(subdivisionDTO.getName());

        Subdivision savedSubdivision = subdivisionRepository.save(subdivision);
        return convertToDTO(savedSubdivision);
    }

    public SubdivisionDTO getSubdivisionById(Long id) {
        Subdivision subdivision = subdivisionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subdivision not found"));
        return convertToDTO(subdivision);
    }

    public List<SubdivisionDTO> getAllSubdivisions() {
        return subdivisionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubdivisionDTO updateSubdivision(Long id, SubdivisionDTO subdivisionDTO) {
        Subdivision subdivision = subdivisionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subdivision not found"));

        subdivision.setName(subdivisionDTO.getName());

        Subdivision updatedSubdivision = subdivisionRepository.save(subdivision);
        return convertToDTO(updatedSubdivision);
    }

    @Transactional
    public void deleteSubdivision(Long id) {
        subdivisionRepository.deleteById(id);
    }

    private SubdivisionDTO convertToDTO(Subdivision subdivision) {
        SubdivisionDTO dto = new SubdivisionDTO();
        dto.setId(subdivision.getId());
        dto.setName(subdivision.getName());
        return dto;
    }
}