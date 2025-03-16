package com.example.collabplatform.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        // 모든 요청에 대해 인증 없이 접근 허용
                        .anyRequest().permitAll()
                )
                // 폼 로그인 비활성화 (REST API 기반)
                .formLogin().disable()
                // 개발용으로 CSRF 검증 완전 비활성화 (운영 시에는 반드시 활성화해야 합니다)
                .csrf(csrf -> csrf.disable())
                // h2-console을 iframe 내부에서 로드할 수 있도록 설정
                .headers(headers -> headers.frameOptions().disable());

        return http.build();
    }
}