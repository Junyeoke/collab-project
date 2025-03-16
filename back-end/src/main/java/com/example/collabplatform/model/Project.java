package com.example.collabplatform.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "project")
public class Project {

    @Id
    private String id; // String 타입의 id (자동 생성)

    private String name;
    private String description;
    private String ownerId;

    // 추가 필드
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status;         // 예: "진행 중", "완료", "보류"

    // 마감일 필드를 LocalDate로 변경하고 JSON 형식을 지정합니다.
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate deadline; // 프로젝트 마감일

    private String tags;           // 간단한 태그 문자열, 혹은 별도의 엔티티로 구성할 수 있음
    private String priority;       // 예: "낮음", "보통", "높음"

    public Project() {}

    // Getter & Setter for 기존 필드
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

    // Getter & Setter for 추가 필드
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public LocalDate getDeadline() {
        return deadline;
    }
    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }
    public String getTags() {
        return tags;
    }
    public void setTags(String tags) {
        this.tags = tags;
    }
    public String getPriority() {
        return priority;
    }
    public void setPriority(String priority) {
        this.priority = priority;
    }

    /**
     * 엔티티가 저장되기 전에 id와 타임스탬프를 자동으로 생성합니다.
     */
    @PrePersist
    public void prePersist() {
        if (this.id == null || this.id.isEmpty()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyMMddHHmmss");
            String dateTimeStr = LocalDateTime.now().format(formatter);
            this.id = "PROJECT_" + dateTimeStr;
        }
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "진행 중"; // 기본 상태 설정
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}