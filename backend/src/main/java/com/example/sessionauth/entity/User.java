package com.example.sessionauth.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.Serializable;
import java.util.Collection;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import static jakarta.persistence.CascadeType.*;
import static jakarta.persistence.FetchType.EAGER;

@Table(name = "user_authenticated")
@Entity
@NoArgsConstructor
@Getter
@Setter
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "account_enable")
    private boolean enabled;

    @Column(name = "credentials_expired")
    private boolean credentialsNonExpired;

    @Column(name = "account_expired")
    private boolean accountNonExpired;

    @Column(name = "account_locked")
    private boolean locked;

    @JsonIgnore
    @OneToMany(cascade = {PERSIST, MERGE, REMOVE}, fetch = EAGER, mappedBy = "user", orphanRemoval = true)
    private Set<Role> roles = new HashSet<>();

    @JsonIgnore
    @OneToMany(cascade = {PERSIST, MERGE, REMOVE}, fetch = EAGER, mappedBy = "user", orphanRemoval = true)
    private Set<Document> documents = new HashSet<>();

    public void addRole(Role role) {
        this.roles.add(role);
        role.setUser(this);
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this
                .roles
                .stream() //
                .map(role -> new SimpleGrantedAuthority(role.getRoleEnum().toString()))
                .collect(Collectors.toSet());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User user)) return false;
        return isEnabled() == user.isEnabled()
                && isCredentialsNonExpired() == user.isCredentialsNonExpired()
                && isAccountNonExpired() == user.isAccountNonExpired()
                && isLocked() == user.isLocked()
                && Objects.equals(getId(), user.getId())
                && Objects.equals(getPassword(), user.getPassword())
                && Objects.equals(getRoles(), user.getRoles());
    }

    @Override
    public int hashCode() {
        return Objects.hash(
                getId(),
                getPassword(),
                isEnabled(),
                isCredentialsNonExpired(),
                isAccountNonExpired(),
                isLocked(),
                getRoles()
        );
    }

}
