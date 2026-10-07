package com.example.sessionauth.repository;

import com.example.sessionauth.entity.Subdivision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubdivisionRepository extends JpaRepository<Subdivision, Long> {
}
