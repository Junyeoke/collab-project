package com.example.collabplatform.dto;

public class LoginRequest {
    // 사용자 지정 ID (로그인 시 사용자가 지정하는 ID)
    private String id;

    private String password;

    // 기본 생성자
    public LoginRequest() {}

    // Getter & Setter
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}