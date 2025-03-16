package com.example.collabplatform.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "project")
public class Project {

    @Id
    private String id; // String 타입의 id (자동 생성)

    private String name;
    private String description;

    // 프로젝트 생성자의 ID를 저장 (로그인 사용자 ID)
    private String ownerId;

    public Project() {}

    // getter / setter
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getOwnerId() {
        return ownerId;
    }
    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    /**
     * 엔티티가 저장되기 전에 id가 없으면 "PROJECT_연월일시분초" 형식의 id를 자동으로 생성합니다.
     */
    @PrePersist
    public void prePersist() {
        if (this.id == null || this.id.isEmpty()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyMMddHHmmss");
            String dateTimeStr = LocalDateTime.now().format(formatter);
            this.id = "PROJECT_" + dateTimeStr;
        }
    }
}