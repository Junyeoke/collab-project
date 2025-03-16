package com.example.collabplatform.service;

import com.example.collabplatform.model.ChatMessage;
import com.example.collabplatform.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public ChatMessage saveChatMessage(ChatMessage message) {
        return chatMessageRepository.save(message);
    }

    // 필요하다면, 특정 프로젝트ID로 메시지 조회하는 메서드도 가능
    // public List<ChatMessage> findByProjectId(...) { ... }
}