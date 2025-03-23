package com.example.collabplatform.controller;

import com.example.collabplatform.model.CalendarEvent;
import com.example.collabplatform.repository.CalendarEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendar")
public class CalendarEventController {

    @Autowired
    private CalendarEventRepository repository;

    // ✅ 전체 일정 조회 (관리자용 등)
    @GetMapping
    public List<CalendarEvent> getAllEvents() {
        return repository.findAll();
    }

    // ✅ 특정 사용자 일정 조회
    @GetMapping("/user/{username}")
    public List<CalendarEvent> getUserEvents(@PathVariable String username) {
        return repository.findByUsername(username);
    }

    // ✅ 일정 등록 (시작일 ~ 종료일 포함)
    @PostMapping
    public CalendarEvent createEvent(@RequestBody CalendarEvent event) {
        if (event.getStartDate() == null) {
            // 기본값 처리 (단일일정으로 처리 가능)
            event.setStartDate(event.getEndDate());
        }
        return repository.save(event);
    }

    // ✅ 일정 삭제
    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        repository.deleteById(id);
    }
}