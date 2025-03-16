package com.example.collabplatform.model;

import java.time.LocalDateTime;

public class ChatMessage {
    private MessageType type;
    private String sender;
    private String content;
    private LocalDateTime timestamp; // 메시지 전송 시간

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }

    // 기본 생성자
    public ChatMessage() {
        this.timestamp = LocalDateTime.now();
    }

    // Getters & Setters
    public MessageType getType() {
        return type;
    }
    public void setType(MessageType type) {
        this.type = type;
    }
    public String getSender() {
        return sender;
    }
    public void setSender(String sender) {
        this.sender = sender;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}