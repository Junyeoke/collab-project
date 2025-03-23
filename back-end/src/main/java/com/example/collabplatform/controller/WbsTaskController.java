package com.example.collabplatform.controller;

import com.example.collabplatform.model.WbsTask;
import com.example.collabplatform.repository.WbsTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wbs")
@RequiredArgsConstructor
public class WbsTaskController {

    private final WbsTaskRepository wbsTaskRepository;

    @GetMapping("/{projectId}")
    public List<WbsTask> getTasks(@PathVariable String projectId) {
        return wbsTaskRepository.findByProjectIdOrderByStartDateAsc(projectId);
    }

    @PostMapping
    public WbsTask addTask(@RequestBody WbsTask task) {
        return wbsTaskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        wbsTaskRepository.deleteById(id);
    }
}