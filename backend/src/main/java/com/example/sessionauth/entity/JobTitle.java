package com.example.sessionauth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "job_title")
@Entity
@NoArgsConstructor
@Getter
@Setter
public class JobTitle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "description", nullable = false, unique = true)
    private String description;

    @ManyToOne
    @JoinColumn(
            name = "subdivision_id",
            nullable = false,
            referencedColumnName = "id",
            foreignKey  = @ForeignKey(name = "job_title_subdivision_fk")
    )
    private Subdivision institute;
}
