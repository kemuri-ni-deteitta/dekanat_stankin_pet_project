package com.example.sessionauth.controller;

import com.example.sessionauth.dto.JobTitleDTO;
import com.example.sessionauth.service.JobTitleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/job-titles")
public class JobTitleController {
    private final JobTitleService jobTitleService;

    public JobTitleController(JobTitleService jobTitleService) {
        this.jobTitleService = jobTitleService;
    }

    @PostMapping("/create")
    @PreAuthorize(value = "hasAuthority('ADMIN')")
    public ResponseEntity<JobTitleDTO> createJobTitle(@RequestBody JobTitleDTO jobTitleDTO) {
        JobTitleDTO createdJobTitle = jobTitleService.createJobTitle(jobTitleDTO);
        return new ResponseEntity<>(createdJobTitle, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize(value = "hasAuthority('ADMIN')")
    public ResponseEntity<JobTitleDTO> getJobTitleById(@PathVariable Long id) {
        JobTitleDTO jobTitleDTO = jobTitleService.getJobTitleById(id);
        return ResponseEntity.ok(jobTitleDTO);
    }

    @GetMapping("/getAll")
    @PreAuthorize(value = "hasAuthority('ADMIN')")
    public ResponseEntity<List<JobTitleDTO>> getAllJobTitles() {
        List<JobTitleDTO> jobTitles = jobTitleService.getAllJobTitles();
        return ResponseEntity.ok(jobTitles);
    }

    @PutMapping("/{id}")
    @PreAuthorize(value = "hasAuthority('ADMIN')")
    public ResponseEntity<JobTitleDTO> updateJobTitle(
            @PathVariable Long id,
            @RequestBody JobTitleDTO jobTitleDTO) {
        JobTitleDTO updatedJobTitle = jobTitleService.updateJobTitle(id, jobTitleDTO);
        return ResponseEntity.ok(updatedJobTitle);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(value = "hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteJobTitle(@PathVariable Long id) {
        jobTitleService.deleteJobTitle(id);
        return ResponseEntity.noContent().build();
    }
}
