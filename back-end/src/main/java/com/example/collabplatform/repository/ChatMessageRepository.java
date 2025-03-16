package com.example.collabplatform.repository;

import com.example.collabplatform.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByProjectIdOrderByTimestampAsc(String projectId);
}