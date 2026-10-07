package com.example.sessionauth.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.data.redis.RedisProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisIndexedHttpSession;
import org.springframework.session.web.context.AbstractHttpSessionApplicationInitializer;


@Configuration @EnableRedisIndexedHttpSession @Slf4j
public class RedisConfig extends AbstractHttpSessionApplicationInitializer {

    private final RedisProperties redisProperties;

    public RedisConfig(RedisProperties redisProperties) {
        this.redisProperties = redisProperties;
    }

    @Bean
    public LettuceConnectionFactory connectionFactory() {
        RedisStandaloneConfiguration configuration =
                new RedisStandaloneConfiguration(this.redisProperties.getHost(), this.redisProperties.getPort());
        configuration.setPassword(redisProperties.getPassword());

        return new LettuceConnectionFactory(configuration);
    }

    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }

}
