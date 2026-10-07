package com.example.sessionauth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class Person {

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "surname", nullable = false, unique = true)
    private String surname;

    @Column(name = "patronymic", nullable = false, unique = true)
    private String patronymic;

    @Column(name = "phone", nullable = false, unique = true)
    private String phone;
}
