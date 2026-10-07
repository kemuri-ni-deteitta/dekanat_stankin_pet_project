package com.example.sessionauth.service;

import com.example.sessionauth.dto.PersonDTO;
import com.example.sessionauth.dto.StudentDTO;
import com.example.sessionauth.entity.Person;
import com.example.sessionauth.entity.Student;
import com.example.sessionauth.enumeration.FinancialForm;
import com.example.sessionauth.repository.StudentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {
    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Transactional
    public StudentDTO createStudent(StudentDTO studentDTO) {
        Student student = new Student();
        student.setPerson(convertToPerson(studentDTO.getPerson()));
        student.setYearStarted(studentDTO.getYearStarted());
        student.setFinancialForm(FinancialForm.valueOf(studentDTO.getFinancialForm()));

        Student savedStudent = studentRepository.save(student);
        return convertToDTO(savedStudent);
    }

    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));
        return convertToDTO(student);
    }

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));

        student.setPerson(convertToPerson(studentDTO.getPerson()));
        student.setYearStarted(studentDTO.getYearStarted());
        student.setFinancialForm(FinancialForm.valueOf(studentDTO.getFinancialForm()));

        Student updatedStudent = studentRepository.save(student);
        return convertToDTO(updatedStudent);
    }

    @Transactional
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    private Person convertToPerson(PersonDTO personDTO) {
        Person person = new Person();
        person.setName(personDTO.getName());
        person.setSurname(personDTO.getSurname());
        person.setPatronymic(personDTO.getPatronymic());
        person.setPhone(personDTO.getPhone());
        return person;
    }

    private StudentDTO convertToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setPerson(convertToPersonDTO(student.getPerson()));
        dto.setYearStarted(student.getYearStarted());
        dto.setFinancialForm(student.getFinancialForm().toString());
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
