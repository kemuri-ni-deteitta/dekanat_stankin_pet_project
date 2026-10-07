package com.example.sessionauth.service;
import com.example.sessionauth.dto.InstituteDTO;
import com.example.sessionauth.entity.Institute;
import com.example.sessionauth.repository.InstituteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InstituteService {
    private final InstituteRepository instituteRepository;

    public InstituteService(InstituteRepository instituteRepository) {
        this.instituteRepository = instituteRepository;
    }

    @Transactional
    public InstituteDTO createInstitute(InstituteDTO instituteDTO) {
        Institute institute = new Institute();
        institute.setName(instituteDTO.getName());
        institute.setEmail(instituteDTO.getEmail());
        institute.setPhone(instituteDTO.getPhone());

        Institute savedInstitute = instituteRepository.save(institute);
        return convertToDTO(savedInstitute);
    }

    public InstituteDTO getInstituteById(Long id) {
        Institute institute = instituteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Institute not found"));
        return convertToDTO(institute);
    }

    public List<InstituteDTO> getAllInstitutes() {
        return instituteRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public InstituteDTO updateInstitute(Long id, InstituteDTO instituteDTO) {
        Institute institute = instituteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Institute not found"));

        institute.setName(instituteDTO.getName());
        institute.setEmail(instituteDTO.getEmail());
        institute.setPhone(instituteDTO.getPhone());

        Institute updatedInstitute = instituteRepository.save(institute);
        return convertToDTO(updatedInstitute);
    }

    @Transactional
    public void deleteInstitute(Long id) {
        instituteRepository.deleteById(id);
    }

    private InstituteDTO convertToDTO(Institute institute) {
        InstituteDTO dto = new InstituteDTO();
        dto.setId(institute.getId());
        dto.setName(institute.getName());
        dto.setEmail(institute.getEmail());
        dto.setPhone(institute.getPhone());
        return dto;
    }
}
