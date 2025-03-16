package com.example.collabplatform.repository;

import com.example.collabplatform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * User 엔티티의 PK가 String 타입이므로,
 * JpaRepository<User, String> 형태로 변경합니다.
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // username(사용자 이름/닉네임)으로 사용자 조회
    User findByUsername(String username);
}