package com.example.sessionauth.service;

import com.example.sessionauth.dto.JobTitleDTO;
import com.example.sessionauth.entity.JobTitle;
import com.example.sessionauth.entity.Subdivision;
import com.example.sessionauth.repository.JobTitleRepository;
import com.example.sessionauth.repository.SubdivisionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobTitleService {
    private final JobTitleRepository jobTitleRepository;
    private final SubdivisionRepository subdivisionRepository;

    public JobTitleService(JobTitleRepository jobTitleRepository, SubdivisionRepository subdivisionRepository) {
        this.jobTitleRepository = jobTitleRepository;
        this.subdivisionRepository = subdivisionRepository;
    }

    @Transactional
    public JobTitleDTO createJobTitle(JobTitleDTO jobTitleDTO) {
        Subdivision subdivision = subdivisionRepository.findById(jobTitleDTO.getSubdivisionId())
                .orElseThrow(() -> new EntityNotFoundException("Subdivision not found"));

        JobTitle jobTitle = new JobTitle();
        jobTitle.setName(jobTitleDTO.getName());
        jobTitle.setDescription(jobTitleDTO.getDescription());
        jobTitle.setInstitute(subdivision);

        JobTitle savedJobTitle = jobTitleRepository.save(jobTitle);
        return convertToDTO(savedJobTitle);
    }

    public JobTitleDTO getJobTitleById(Long id) {
        JobTitle jobTitle = jobTitleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("JobTitle not found"));
        return convertToDTO(jobTitle);
    }

    public List<JobTitleDTO> getAllJobTitles() {
        return jobTitleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public JobTitleDTO updateJobTitle(Long id, JobTitleDTO jobTitleDTO) {
        JobTitle jobTitle = jobTitleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("JobTitle not found"));

        Subdivision subdivision = subdivisionRepository.findById(jobTitleDTO.getSubdivisionId())
                .orElseThrow(() -> new EntityNotFoundException("Subdivision not found"));

        jobTitle.setName(jobTitleDTO.getName());
        jobTitle.setDescription(jobTitleDTO.getDescription());
        jobTitle.setInstitute(subdivision);

        JobTitle updatedJobTitle = jobTitleRepository.save(jobTitle);
        return convertToDTO(updatedJobTitle);
    }

    @Transactional
    public void deleteJobTitle(Long id) {
        jobTitleRepository.deleteById(id);
    }

    private JobTitleDTO convertToDTO(JobTitle jobTitle) {
        JobTitleDTO dto = new JobTitleDTO();
        dto.setId(jobTitle.getId());
        dto.setName(jobTitle.getName());
        dto.setDescription(jobTitle.getDescription());
        dto.setSubdivisionId(jobTitle.getInstitute().getId());
        return dto;
    }
}
