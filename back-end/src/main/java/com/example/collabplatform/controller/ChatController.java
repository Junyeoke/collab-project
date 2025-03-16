package com.example.collabplatform.controller;

import com.example.collabplatform.model.ChatMessage;
import com.example.collabplatform.model.User;
import com.example.collabplatform.repository.ChatMessageRepository;
import com.example.collabplatform.repository.UserRepository;
import com.example.collabplatform.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatService chatService; // ChatMessage DB 저장용

    private ConcurrentHashMap<String, Set<String>> projectParticipants = new ConcurrentHashMap<>();

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    // 특정 프로젝트의 모든 채팅 메시지를 시간순으로 조회
    @GetMapping("/history/{projectId}")
    public List<ChatMessage> getChatHistory(@PathVariable String projectId) {
        List<ChatMessage> messages = chatMessageRepository.findByProjectIdOrderByTimestampAsc(projectId);
        System.out.println("Chat History for " + projectId + ": " + messages); // 로그 추가
        return messages;
    }

    @MessageMapping("/chat.sendMessage/{projectId}")
    public void sendMessageToProject(@DestinationVariable String projectId, ChatMessage chatMessage) {
        // 프로필 이미지 설정
        User senderUser = userRepository.findByUsername(chatMessage.getSender());
        if (senderUser != null) {
            chatMessage.setProfileImage(senderUser.getProfileImage());
        }
        // (1) DB 저장
        chatService.saveChatMessage(chatMessage);
        // (2) WebSocket 브로드캐스트
        messagingTemplate.convertAndSend("/topic/project." + projectId, chatMessage);
    }

    @MessageMapping("/chat.addUser/{projectId}")
    public void addUserToProject(@DestinationVariable String projectId, ChatMessage chatMessage) {
        projectParticipants.putIfAbsent(projectId, Collections.synchronizedSet(new HashSet<>()));
        projectParticipants.get(projectId).add(chatMessage.getSender());

        // 참여자 목록 업데이트 전송
        messagingTemplate.convertAndSend("/topic/project." + projectId + ".participants", projectParticipants.get(projectId));

        // 입장 메시지 생성 및 전송
        String joinContent = chatMessage.getSender() + "님이 입장하였습니다.";
        ChatMessage joinMessage = new ChatMessage();
        joinMessage.setType(ChatMessage.MessageType.JOIN);
        joinMessage.setSender(chatMessage.getSender());
        joinMessage.setContent(joinContent);
        joinMessage.setTimestamp(chatMessage.getTimestamp());
        // 프로필 이미지 설정
        User senderUser = userRepository.findByUsername(chatMessage.getSender());
        if (senderUser != null) {
            joinMessage.setProfileImage(senderUser.getProfileImage());
        }
        // DB 저장
        chatService.saveChatMessage(joinMessage);
        // WebSocket 브로드캐스트
        messagingTemplate.convertAndSend("/topic/project." + projectId, joinMessage);
    }

    @MessageMapping("/chat.removeUser/{projectId}")
    public void removeUserFromProject(@DestinationVariable String projectId, ChatMessage chatMessage) {
        if (projectParticipants.containsKey(projectId)) {
            projectParticipants.get(projectId).remove(chatMessage.getSender());
            messagingTemplate.convertAndSend("/topic/project." + projectId + ".participants", projectParticipants.get(projectId));

            String leaveContent = chatMessage.getSender() + "님이 나갔습니다.";
            ChatMessage leaveMessage = new ChatMessage();
            leaveMessage.setType(ChatMessage.MessageType.LEAVE);
            leaveMessage.setSender(chatMessage.getSender());
            leaveMessage.setContent(leaveContent);
            leaveMessage.setTimestamp(chatMessage.getTimestamp());
            // 프로필 이미지 설정
            User senderUser = userRepository.findByUsername(chatMessage.getSender());
            if (senderUser != null) {
                leaveMessage.setProfileImage(senderUser.getProfileImage());
            }
            // DB 저장
            chatService.saveChatMessage(leaveMessage);
            // WebSocket 브로드캐스트
            messagingTemplate.convertAndSend("/topic/project." + projectId, leaveMessage);
        }
    }
}