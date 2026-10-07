package com.example.sessionauth.repository;

import com.example.sessionauth.entity.Kafedra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KafedraRepository extends JpaRepository<Kafedra, Long> {
}
