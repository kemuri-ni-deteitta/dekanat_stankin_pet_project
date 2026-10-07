package com.example.sessionauth.entity;

import com.example.sessionauth.enumeration.FinancialForm;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "student")
@Entity
@NoArgsConstructor
@Getter
@Setter
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Embedded
    Person person;

    @Column(name = "year_started", nullable = false)
    private long yearStarted;

    @Column(name = "financial_form")
    @Enumerated(value = EnumType.STRING)
    private FinancialForm financialForm;
}
