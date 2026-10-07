package com.example.sessionauth.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.SessionManagementConfigurer;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.session.Session;
import org.springframework.session.data.redis.RedisIndexedSessionRepository;
import org.springframework.session.security.SpringSessionBackedSessionRegistry;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.springframework.security.config.http.SessionCreationPolicy.IF_REQUIRED;

@Configuration @EnableWebSecurity @EnableMethodSecurity
public class SecurityConfig {

    @Value(value = "${custom.max.session}")
    private int maxSession;

    private final RedisIndexedSessionRepository redisIndexedSessionRepository;

    @Autowired
    @Qualifier("realCorsConfig")
    CorsConfigurationSource configurationSource;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationEntryPoint authEntryPoint;

    private final UserDetailsService detailsService;

    public SecurityConfig(
            RedisIndexedSessionRepository redisIndexedSessionRepository,
            PasswordEncoder passwordEncoder,
            @Qualifier(value = "authEntryPoint") AuthenticationEntryPoint authEntryPoint,
            @Qualifier(value = "detailService") UserDetailsService detailsService
    ) {
        this.redisIndexedSessionRepository = redisIndexedSessionRepository;
        this.passwordEncoder = passwordEncoder;
        this.authEntryPoint = authEntryPoint;
        this.detailsService = detailsService;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(this.passwordEncoder);
        provider.setUserDetailsService(this.detailsService);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(authenticationProvider());
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(configurationSource))
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/api/v1/auth/register", "/api/v1/auth/login").permitAll();
                    auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
                    auth.anyRequest().authenticated();
                })
                .sessionManagement(sessionManagement -> sessionManagement
                        .sessionCreationPolicy(IF_REQUIRED) //
                        .sessionFixation(SessionManagementConfigurer.SessionFixationConfigurer::newSession) //
                        .maximumSessions(maxSession) //
                        .sessionRegistry(sessionRegistry())
                )
                .exceptionHandling((ex) -> ex.authenticationEntryPoint(this.authEntryPoint))
                .logout(out -> out
                        .logoutUrl("/api/v1/auth/logout")
                        .invalidateHttpSession(true) // Invalidate all sessions after logout
                        .deleteCookies("JSESSIONID")
                        .addLogoutHandler(new CustomLogoutHandler(this.redisIndexedSessionRepository))
                        .logoutSuccessHandler((request, response, authentication) ->
                                SecurityContextHolder.clearContext()
                        )
                )
                .build();
    }

    @Bean
    public SpringSessionBackedSessionRegistry<? extends Session> sessionRegistry() {
        return new SpringSessionBackedSessionRegistry<>(this.redisIndexedSessionRepository);
    }

    @Bean
    public SecurityContextRepository securityContextRepository() {
      return new HttpSessionSecurityContextRepository();
    }
}
