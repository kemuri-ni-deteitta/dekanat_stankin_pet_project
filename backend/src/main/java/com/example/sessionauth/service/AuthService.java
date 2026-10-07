package com.example.sessionauth.service;

import com.example.sessionauth.dto.AuthDTO;
import com.example.sessionauth.dto.ChangeRoleDto;
import com.example.sessionauth.dto.UserWithRolesDto;
import com.example.sessionauth.entity.User;
import com.example.sessionauth.entity.Role;
import com.example.sessionauth.enumeration.RoleEnum;
import com.example.sessionauth.repository.RoleRepository;
import com.example.sessionauth.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.session.Session;
import org.springframework.session.data.redis.RedisIndexedSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service @Setter
public class AuthService {

    @Value(value = "${custom.max.session}")
    private int maxSession;

    @Value(value = "${admin.email}")
    private String adminEmail;

    private final UserRepository userRepo;

    private final PasswordEncoder passwordEncoder;

    private final SecurityContextRepository securityContextRepository;

    private final SecurityContextHolderStrategy securityContextHolderStrategy;

    private final AuthenticationManager authManager;

    private final RedisIndexedSessionRepository redisIndexedSessionRepository;

    private final SessionRegistry sessionRegistry;

    private final RoleRepository roleRepo;

    public AuthService(
            UserRepository userRepo,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authManager,
            RedisIndexedSessionRepository redisIndexedSessionRepository,
            SessionRegistry sessionRegistry,
            SecurityContextRepository securityContextRepository,
            RoleRepository roleRepo) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.authManager = authManager;
        this.redisIndexedSessionRepository = redisIndexedSessionRepository;
        this.sessionRegistry = sessionRegistry;
        this.securityContextRepository = securityContextRepository;
        this.securityContextHolderStrategy = SecurityContextHolder.getContextHolderStrategy();
        this.roleRepo = roleRepo;
    }

    @Transactional
    public String register(AuthDTO dto, HttpServletRequest request, HttpServletResponse response) {
        String email = dto.email().trim();

        Optional<User> exists = userRepo.findByPrincipal(email);

        if (exists.isPresent()) {
            throw new IllegalStateException(email + " exists");
        }

        var user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setLocked(true);
        user.setAccountNonExpired(true);
        user.setCredentialsNonExpired(true);
        user.setEnabled(true);


        if (adminEmail.equals(email)) {
            user.addRole(new Role(RoleEnum.ADMIN));
        } else {
            user.addRole(new Role(RoleEnum.REGISTERED));
        }

        userRepo.save(user);

        login(dto, request, response);
        return "Register!";
    }


    public String login(AuthDTO dto, HttpServletRequest request, HttpServletResponse response) {
        // Validate User credentials
        Authentication authentication = authManager.authenticate(UsernamePasswordAuthenticationToken.unauthenticated(
                dto.email().trim(), dto.password())
        );

        // Validate session constraint is not exceeded
        validateMaxSession(authentication);

        // Create a new context
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);

        // Update SecurityContextHolder and Strategy
        this.securityContextHolderStrategy.setContext(context);
        this.securityContextRepository.saveContext(context, request, response);

        return "Logged In!";
    }

    private void validateMaxSession(Authentication authentication) {
        // If max session is negative means unlimited session
        if (maxSession <= 0) {
            return;
        }

        var principal = (UserDetails) authentication.getPrincipal();
        List<SessionInformation> sessions = this.sessionRegistry.getAllSessions(principal, false);

        if (sessions.size() >= maxSession) {
            sessions.stream() //
                    // Gets the oldest session
                    .min(Comparator.comparing(SessionInformation::getLastRequest)) //
                    .ifPresent(sessionInfo -> this.redisIndexedSessionRepository.deleteById(sessionInfo.getSessionId()));
        }
    }

    @Transactional
    public String changeRole(ChangeRoleDto dto, boolean isAddRole) {

        String email = dto.email().trim();

        Optional<User> exists = userRepo.findByPrincipal(email);

        if (exists.isEmpty()) {
            throw new IllegalStateException(email + " not exists");
        }

        User user = exists.get();

        if (isAddRole) {
            Role role = new Role(RoleEnum.valueOf(dto.role()));
            role.setUser(user);
            roleRepo.saveAndFlush(role);
        } else {
            roleRepo.deleteByUserEmailAndRole(user.getEmail(), RoleEnum.valueOf(dto.role()));

            // Clean session and expire sessions
            Map<String, ? extends Session> userSessions = redisIndexedSessionRepository.findByIndexNameAndIndexValue(FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME, user.getEmail());

            for (String sessionId : userSessions.keySet()) {
                redisIndexedSessionRepository.deleteById(sessionId);
            }
        }

        return "Success changed role from " + dto.email() + ", add or remove role: " + dto.role();
    }


    public List<UserWithRolesDto> getAllUsersWithRoles() {
        List<User> users = userRepo.findAll();

        return users.stream()
                .map(user -> new UserWithRolesDto(
                        user.getEmail(),
                        user.getRoles().stream()
                                .map(role -> role.getRoleEnum().name())
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }
}
