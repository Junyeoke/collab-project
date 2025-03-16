package com.example.collabplatform.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * 이 클래스는 Spring Security에서 사용할 비밀번호 암호화(해싱) 도구인 BCryptPasswordEncoder를 Bean으로 등록합니다.
 * BCryptPasswordEncoder는 해싱된 비밀번호를 생성하며, 비밀번호 비교 시에도 안전하게 처리할 수 있도록 도와줍니다.
 *
 * 일반적으로 회원가입, 로그인, 회원정보 수정 등의 기능에서 평문 비밀번호 대신 해싱된 비밀번호를 저장 및 검증하기 위해 사용됩니다.
 */
@Configuration  // 해당 클래스가 Spring 설정 클래스임을 나타냅니다.
public class PasswordConfig {

    /**
     * BCryptPasswordEncoder를 Bean으로 등록합니다.
     * 이 Bean은 UserController와 같이 비밀번호 암호화가 필요한 곳에서 자동으로 주입(inject)되어 사용됩니다.
     *
     * @return BCryptPasswordEncoder 인스턴스
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // 기본 strength(10)로 BCryptPasswordEncoder 객체 생성
    }
}