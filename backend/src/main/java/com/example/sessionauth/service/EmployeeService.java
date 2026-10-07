package com.example.sessionauth.service;

import com.example.sessionauth.dto.EmployeeDTO;
import com.example.sessionauth.dto.PersonDTO;
import com.example.sessionauth.entity.*;
import com.example.sessionauth.repository.EmployeeRepository;
import com.example.sessionauth.repository.JobTitleRepository;
import com.example.sessionauth.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final JobTitleRepository jobTitleRepository;
    private final UserRepository userRepository;

    public EmployeeService(EmployeeRepository employeeRepository,
                           JobTitleRepository jobTitleRepository,
                           UserRepository userRepository) {
        this.employeeRepository = employeeRepository;
        this.jobTitleRepository = jobTitleRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {
        JobTitle jobTitle = jobTitleRepository.findById(employeeDTO.getJobTitleId())
                .orElseThrow(() -> new EntityNotFoundException("JobTitle not found"));

        User user = userRepository.findById(employeeDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Employee employee = new Employee();
        employee.setPerson(convertToPerson(employeeDTO.getPerson()));
        employee.setInstitute(jobTitle);
        employee.setUser(user);

        Employee savedEmployee = employeeRepository.save(employee);
        return convertToDTO(savedEmployee);
    }

    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found"));
        return convertToDTO(employee);
    }

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found"));

        JobTitle jobTitle = jobTitleRepository.findById(employeeDTO.getJobTitleId())
                .orElseThrow(() -> new EntityNotFoundException("JobTitle not found"));

        User user = userRepository.findById(employeeDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        employee.setPerson(convertToPerson(employeeDTO.getPerson()));
        employee.setInstitute(jobTitle);
        employee.setUser(user);

        Employee updatedEmployee = employeeRepository.save(employee);
        return convertToDTO(updatedEmployee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    private Person convertToPerson(PersonDTO personDTO) {
        Person person = new Person();
        person.setName(personDTO.getName());
        person.setSurname(personDTO.getSurname());
        person.setPatronymic(personDTO.getPatronymic());
        person.setPhone(personDTO.getPhone());
        return person;
    }

    private EmployeeDTO convertToDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setPerson(convertToPersonDTO(employee.getPerson()));
        dto.setJobTitleId(employee.getInstitute().getId());
        dto.setUserId(employee.getUser().getId());
        return dto;
    }

    private PersonDTO convertToPersonDTO(Person person) {
        PersonDTO dto = new PersonDTO();
        dto.setName(person.getName());
        dto.setSurname(person.getSurname());
        dto.setPatronymic(person.getPatronymic());
        dto.setPhone(person.getPhone());
        return dto;
    }
}
