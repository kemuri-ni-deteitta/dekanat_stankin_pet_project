package com.example.sessionauth.dto;

import lombok.Data;

@Data
public class StudentDTO {
    private Long id;
    private PersonDTO person;
    private long yearStarted;
    private String financialForm;
}
