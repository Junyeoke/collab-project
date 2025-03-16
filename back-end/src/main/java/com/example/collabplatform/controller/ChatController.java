package com.example.collabplatform.controller;

import com.example.collabplatform.model.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // 프로젝트별 연결된 참여자 목록 (키: 프로젝트 ID, 값: 참여자 이름 집합)
    private ConcurrentHashMap<String, Set<String>> projectParticipants = new ConcurrentHashMap<>();

    /**
     * 클라이언트가 '/app/chat.sendMessage/{projectId}'로 메시지를 보내면,
     * 해당 프로젝트의 채팅 토픽인 '/topic/project.{projectId}'로 메시지를 전달합니다.
     */
    @MessageMapping("/chat.sendMessage/{projectId}")
    public void sendMessageToProject(@DestinationVariable String projectId, ChatMessage chatMessage) {
        messagingTemplate.convertAndSend("/topic/project." + projectId, chatMessage);
    }

    /**
     * 클라이언트가 '/app/chat.addUser/{projectId}'로 메시지를 보내면,
     * 사용자가 채팅방에 입장했음을 처리하고, 최신 참여자 목록과 입장 메시지를 브로드캐스트합니다.
     */
    @MessageMapping("/chat.addUser/{projectId}")
    public void addUserToProject(@DestinationVariable String projectId, ChatMessage chatMessage) {
        // 참여자 목록 초기화 후 추가
        projectParticipants.putIfAbsent(projectId, Collections.synchronizedSet(new HashSet<>()));
        projectParticipants.get(projectId).add(chatMessage.getSender());

        // 참여자 목록 업데이트를 모든 클라이언트에 전송
        messagingTemplate.convertAndSend("/topic/project." + projectId + ".participants", projectParticipants.get(projectId));

        // 입장 메시지 생성 및 전송: "username(id)님이 입장하였습니다."
        String joinContent = chatMessage.getSender() + "님이 입장하였습니다.";
        ChatMessage joinMessage = new ChatMessage();
        joinMessage.setType(ChatMessage.MessageType.JOIN);
        joinMessage.setSender(chatMessage.getSender());
        joinMessage.setContent(joinContent);
        joinMessage.setTimestamp(chatMessage.getTimestamp()); // 혹은 LocalDateTime.now() 사용
        messagingTemplate.convertAndSend("/topic/project." + projectId, joinMessage);
    }

    /**
     * 클라이언트가 '/app/chat.removeUser/{projectId}'로 메시지를 보내면,
     * 사용자가 채팅방에서 퇴장했음을 처리하고, 최신 참여자 목록과 퇴장 메시지를 브로드캐스트합니다.
     */
    @MessageMapping("/chat.removeUser/{projectId}")
    public void removeUserFromProject(@DestinationVariable String projectId, ChatMessage chatMessage) {
        if (projectParticipants.containsKey(projectId)) {
            projectParticipants.get(projectId).remove(chatMessage.getSender());
            // 업데이트된 참여자 목록 전송
            messagingTemplate.convertAndSend("/topic/project." + projectId + ".participants", projectParticipants.get(projectId));

            // 퇴장 메시지 생성 및 전송: "username(id)님이 나갔습니다."
            String leaveContent = chatMessage.getSender() + "님이 나갔습니다.";
            ChatMessage leaveMessage = new ChatMessage();
            leaveMessage.setType(ChatMessage.MessageType.LEAVE);
            leaveMessage.setSender(chatMessage.getSender());
            leaveMessage.setContent(leaveContent);
            leaveMessage.setTimestamp(chatMessage.getTimestamp());
            messagingTemplate.convertAndSend("/topic/project." + projectId, leaveMessage);
        }
    }
}