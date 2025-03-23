// CalendarEventRepository.java
package com.example.collabplatform.repository;

import com.example.collabplatform.model.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {
    List<CalendarEvent> findByUsername(String username);
}