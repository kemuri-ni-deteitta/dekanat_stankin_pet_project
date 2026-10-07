package com.example.sessionauth.entity;

import com.example.sessionauth.enumeration.ScholarshipType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "scholarship")
@Entity
@NoArgsConstructor
@Getter
@Setter
public class Scholarship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;


    @Column(name = "amount", nullable = false, unique = true)
    private String amount;

    @Column(name = "scholarship_type")
    @Enumerated(value = EnumType.STRING)
    private ScholarshipType scholarshipType;
}
