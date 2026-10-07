package com.example.sessionauth.dto;

import lombok.Data;

@Data
public class DocumentDTO {
    private Long id;
    private String name;
    private String bytes;
    private Long userId;
}
