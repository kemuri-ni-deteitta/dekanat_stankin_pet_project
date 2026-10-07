package com.example.sessionauth.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

import static jakarta.persistence.CascadeType.*;
import static jakarta.persistence.FetchType.EAGER;

@Table(name = "employee")
@Entity
@NoArgsConstructor
@Getter
@Setter
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Embedded
    Person person;

    @ManyToOne
    @JoinColumn(
        name = "job_title_id",
        nullable = false,
        referencedColumnName = "id",
        foreignKey  = @ForeignKey(name = "employee_job_title_fk")
    )
    private JobTitle institute;

    @ManyToOne
    @JoinColumn(
            name = "user_id",
            nullable = false,
            referencedColumnName = "id",
            foreignKey  = @ForeignKey(name = "employee_user_fk")
    )
    private User user;
}
