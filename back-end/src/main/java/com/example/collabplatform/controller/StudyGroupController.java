package com.example.collabplatform.controller;

import com.example.collabplatform.model.StudyGroup;
import com.example.collabplatform.repository.StudyGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/studygroups")
public class StudyGroupController {
    @Autowired
    private StudyGroupRepository studyGroupRepository;

    // 전체 스터디 그룹 조회
    @GetMapping
    public List<StudyGroup> getAllStudyGroups(){
        return studyGroupRepository.findAll();
    }

    // 스터디 그룹 생성
    @PostMapping
    public StudyGroup createStudyGroup(@RequestBody StudyGroup studyGroup){
        return studyGroupRepository.save(studyGroup);
    }

    // 특정 스터디 그룹 조회
    @GetMapping("/{id}")
    public StudyGroup getStudyGroupById(@PathVariable Long id) {
        return studyGroupRepository.findById(id).orElse(null);
    }
}
