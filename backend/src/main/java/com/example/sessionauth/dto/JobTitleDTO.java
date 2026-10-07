package com.example.sessionauth.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobTitleDTO {

    Long id;

    String name;

    String description;

    Long subdivisionId;
}
