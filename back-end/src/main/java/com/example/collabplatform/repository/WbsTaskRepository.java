package com.example.collabplatform.repository;

import com.example.collabplatform.model.WbsTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WbsTaskRepository extends JpaRepository<WbsTask, Long> {
    List<WbsTask> findByProjectIdOrderByStartDateAsc(String projectId);
}