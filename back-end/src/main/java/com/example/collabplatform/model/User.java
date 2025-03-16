package com.example.collabplatform.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users") // 테이블 이름을 "users"로 지정
public class User {

    /**
     * 1) 사용자 지정 ID (회원가입 시 유저가 입력)
     *    - PK(기본키)로 사용하므로, @GeneratedValue를 사용하지 않습니다.
     *    - 중복 검사 로직을 컨트롤러/서비스에서 처리해야 합니다.
     */
    @Id
    @Column(name = "id", nullable = false, unique = true)
    private String id;

    /**
     * 2) 사용자의 '이름' 혹은 '닉네임' (username)
     *    - DB에선 일반 문자열 컬럼으로 저장됩니다.
     */
    private String username;

    private String password;
    private String email;

    /**
     * 3) 사용자 프로필 사진 URL 또는 파일 경로
     *    - 사용자가 업로드한 프로필 사진의 경로를 저장합니다.
     */
    private String profileImage;

    public User() {}

    // Getter & Setter
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfileImage() {
        return profileImage;
    }
    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }
}