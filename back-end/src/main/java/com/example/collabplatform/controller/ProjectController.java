package com.example.collabplatform.controller;

import com.example.collabplatform.model.Project;
import com.example.collabplatform.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    @Autowired
    private ProjectRepository projectRepository;

    // 전체 프로젝트 조회
    @GetMapping
    public List<Project> getAllProjects(){
        return projectRepository.findAll();
    }

    // 프로젝트 생성
    @PostMapping
    public Project createProject(@RequestBody Project project){
        // project.getOwnerId()로 로그인한 사용자 ID가 넘어온다고 가정
        return projectRepository.save(project);
    }

    // 특정 프로젝트 조회
    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id).orElse(null);
    }
}
