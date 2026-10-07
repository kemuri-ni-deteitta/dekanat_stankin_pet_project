package com.example.sessionauth.dto;

import lombok.Data;

@Data
public class EmployeeDTO {
    private Long id;
    private PersonDTO person;
    private Long jobTitleId;
    private Long userId;
}
