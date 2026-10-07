package com.example.sessionauth.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sessionauth.dto.StudentDTO;
import com.example.sessionauth.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/students")
public class StudentController {
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<StudentDTO> createStudent(@RequestBody StudentDTO studentDTO) {
        StudentDTO createdStudent = studentService.createStudent(studentDTO);
        return new ResponseEntity<>(createdStudent, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        StudentDTO studentDTO = studentService.getStudentById(id);
        return ResponseEntity.ok(studentDTO);
    }

    @GetMapping("/getAll")
    @PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        List<StudentDTO> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<StudentDTO> updateStudent(
            @PathVariable Long id,
            @RequestBody StudentDTO studentDTO) {
        StudentDTO updatedStudent = studentService.updateStudent(id, studentDTO);
        return ResponseEntity.ok(updatedStudent);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}


//@RestController
//@RequestMapping("/api/v1/students")
//public class StudentController {
//    private final StudentService studentService;
//
//    public StudentController(StudentService studentService) {
//        this.studentService = studentService;
//    }
//
//    @PostMapping("/create")
//    @PreAuthorize(value = "hasAuthority('EMPLOYEE')")
//    public ResponseEntity<StudentDTO> createStudent(@RequestBody StudentDTO studentDTO) {
//        StudentDTO createdStudent = studentService.createStudent(studentDTO);
//        return new ResponseEntity<>(createdStudent, HttpStatus.CREATED);
//    }
//
//    @GetMapping("/{id}")
//    @PreAuthorize(value = "hasAuthority('EMPLOYEE')")
//    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
//        StudentDTO studentDTO = studentService.getStudentById(id);
//        return ResponseEntity.ok(studentDTO);
//    }
//
//    @GetMapping("/getAll")
//    @PreAuthorize(value = "hasAuthority('EMPLOYEE')")
//    public ResponseEntity<List<StudentDTO>> getAllStudents() {
//        List<StudentDTO> students = studentService.getAllStudents();
//        return ResponseEntity.ok(students);
//    }
//
//    @PutMapping("/{id}")
//    @PreAuthorize(value = "hasAuthority('EMPLOYEE')")
//    public ResponseEntity<StudentDTO> updateStudent(
//            @PathVariable Long id,
//            @RequestBody StudentDTO studentDTO) {
//        StudentDTO updatedStudent = studentService.updateStudent(id, studentDTO);
//        return ResponseEntity.ok(updatedStudent);
//    }
//
//    @DeleteMapping("/{id}")
//    @PreAuthorize(value = "hasAuthority('EMPLOYEE')")
//    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
//        studentService.deleteStudent(id);
//        return ResponseEntity.noContent().build();
//    }
//}
