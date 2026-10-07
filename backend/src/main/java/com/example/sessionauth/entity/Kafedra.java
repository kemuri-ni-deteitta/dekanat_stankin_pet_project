package com.example.sessionauth.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "kafedra")
@Entity
@NoArgsConstructor
@Getter
@Setter
public class Kafedra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    //кабинет
    @Column(name = "room", nullable = false, unique = true)
    private String room;

    @Column(name = "phone", nullable = false, unique = true)
    private String phone;

    @Column(name = "credentials_expired", nullable = false, unique = true)
    private boolean credentialsNonExpired;

    @ManyToOne
    @JoinColumn(
            name = "institute_id",
            nullable = false,
            referencedColumnName = "id",
            foreignKey  = @ForeignKey(name = "kafedra_institute_fk")
    )
    private Institute institute;
}
