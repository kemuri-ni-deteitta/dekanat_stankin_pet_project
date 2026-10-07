package com.example.sessionauth.dto;

import lombok.Data;

@Data
public class KafedraDTO {
    private Long id;
    private String name;
    private String email;
    private String room;
    private String phone;
    private boolean credentialsNonExpired;
    private Long instituteId;
}
