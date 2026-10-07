package com.example.sessionauth.entity.userdetails;

import com.example.sessionauth.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service(value = "detailService")
public class DetailService implements UserDetailsService {

    private final UserRepository userRepo;

    public DetailService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String principal) throws UsernameNotFoundException {
        return this
                .userRepo
                .findByPrincipal(principal)
                .map(UserDetailss::new) //
                .orElseThrow(() -> new UsernameNotFoundException(principal + " not found"));
    }

}
