// ChatMessage.java
package com.example.collabplatform.model;

import java.time.LocalDateTime;

public class ChatMessage {
    public enum MessageType {
        CHAT, JOIN, LEAVE
    }

    private MessageType type;
    private String sender;
    private String content;
    private LocalDateTime timestamp;
    private String profileImage; // 여기에 프로필 이미지 경로(또는 URL)

    public ChatMessage() {
        this.timestamp = LocalDateTime.now();
    }

    // getter/setter ...
    public MessageType getType() { return type; }
    public void setType(MessageType type) { this.type = type; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
}