package com.example.sessionauth.repository;

import com.example.sessionauth.entity.Role;
import com.example.sessionauth.enumeration.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM Role r WHERE r.user.id IN (SELECT u.id FROM User u WHERE u.email = :email) AND r.roleEnum = :role")
    void deleteByUserEmailAndRole(
            @Param("email") String email,
            @Param("role") RoleEnum role
    );

}
