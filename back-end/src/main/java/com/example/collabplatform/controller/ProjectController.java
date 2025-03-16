package com.example.collabplatform.controller;

import com.example.collabplatform.model.Project;
import com.example.collabplatform.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    // ✅ 전체 프로젝트 조회
    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // ✅ 프로젝트 생성
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        if (project.getName() == null || project.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build(); // 400 Bad Request
        }
        Project savedProject = projectRepository.save(project);
        return ResponseEntity.ok(savedProject);
    }

    // ✅ 특정 프로젝트 조회
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable String id) {
        Optional<Project> project = projectRepository.findById(id);
        return project.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build()); // 404 Not Found
    }

    // ✅ 프로젝트 정보 수정 (PUT 요청)
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable String id, @RequestBody Project updatedProject) {
        return projectRepository.findById(id).map(existingProject -> {
            existingProject.setName(updatedProject.getName());
            existingProject.setDescription(updatedProject.getDescription());
            existingProject.setDeadline(updatedProject.getDeadline());
            existingProject.setTags(updatedProject.getTags());
            existingProject.setPriority(updatedProject.getPriority());
            existingProject.setStatus(updatedProject.getStatus());

            Project savedProject = projectRepository.save(existingProject);
            return ResponseEntity.ok(savedProject);
        }).orElseGet(() -> ResponseEntity.notFound().build()); // 404 Not Found
    }

    // ✅ 프로젝트 삭제 (DELETE 요청)
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteProject(@PathVariable String id) {
        return projectRepository.findById(id).map(project -> {
            projectRepository.delete(project);
            return ResponseEntity.ok().build(); // 200 OK
        }).orElseGet(() -> ResponseEntity.notFound().build()); // 404 Not Found
    }
}