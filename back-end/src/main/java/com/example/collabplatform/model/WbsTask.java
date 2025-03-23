package com.example.collabplatform.model;

import jakarta.persistence.*;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDate;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WbsTask {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String projectId;         // 프로젝트 ID
    private String category;          // 예: 리서치, UX, UI, 개발, QA 등
    private String task;              // 세부 업무 항목
    private String assignee;          // 담당자명

    @NotNull
    private LocalDate startDate;
    @NotNull
    private LocalDate endDate;
    private int progress;             // 진행률 (0~100)
}