import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Image } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Swal from 'sweetalert2';
import axios from 'axios';
import './ProjectChatPage.css';
import defaultProfile from '../assets/images/default_profile.png';

function ProjectChatPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const messageEndRef = useRef(null);

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : { username: '익명', profileImage: null };

  // ✅ 0. 알림 권한 요청 (최초 1회)
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // 1. 이전 채팅 기록 불러오기
  useEffect(() => {
    if (projectId) {
      axios.get(`/api/chat/history/${projectId}`)
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: '채팅 기록 불러오기 실패',
            text: '과거 채팅 기록을 불러오지 못했습니다.'
          });
        });
    }
  }, [projectId]);

  // 2. WebSocket 연결 및 메시지 수신
  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    stompClient.onConnect = () => {
      stompClient.subscribe(`/topic/project.${projectId}`, (message) => {
        if (message.body) {
          const receivedMessage = JSON.parse(message.body);

          if (receivedMessage.type === 'JOIN') {
            receivedMessage.content = `${receivedMessage.sender}님이 입장하였습니다.`;
            receivedMessage.system = true;
          } else if (receivedMessage.type === 'LEAVE') {
            receivedMessage.content = `${receivedMessage.sender}님이 나갔습니다.`;
            receivedMessage.system = true;
          }

          // ✅ 본인 메시지가 아니면 알림 띄우기
          if (
            receivedMessage.type === 'CHAT' &&
            receivedMessage.sender !== currentUser.username &&
            Notification.permission === "granted"
          ) {
            new Notification(`${receivedMessage.sender}님의 메시지`, {
              body: receivedMessage.content,
              icon: "/favicon.ico"
            });
          }

          setMessages(prev => [...prev, receivedMessage]);
        }
      });

      stompClient.subscribe(`/topic/project.${projectId}.participants`, (message) => {
        if (message.body) {
          setParticipants(JSON.parse(message.body));
        }
      });

      const joinMessage = {
        type: 'JOIN',
        sender: currentUser.username,
        content: '',
        timestamp: new Date().toISOString(),
        projectId: projectId,
      };
      stompClient.publish({
        destination: `/app/chat.addUser/${projectId}`,
        body: JSON.stringify(joinMessage),
      });
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient.connected) {
        const leaveMessage = {
          type: 'LEAVE',
          sender: currentUser.username,
          content: '',
          timestamp: new Date().toISOString(),
          projectId: projectId,
        };
        stompClient.publish({
          destination: `/app/chat.removeUser/${projectId}`,
          body: JSON.stringify(leaveMessage),
        });
      }
      stompClient.deactivate();
    };
  }, [projectId, currentUser.username]);

  // 3. 프로젝트 정보 불러오기
  useEffect(() => {
    if (projectId) {
      axios.get(`/api/projects/${projectId}`)
        .then(response => setProject(response.data))
        .catch(() => {
          Swal.fire({
            icon: 'error',
            title: '프로젝트 정보 불러오기 실패',
            text: '프로젝트 정보를 불러오지 못했습니다.'
          });
        });
    }
  }, [projectId]);

  // 4. 메시지 스크롤 아래로
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 5. 메시지 전송
  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() === '') return;

    const chatMessage = {
      type: 'CHAT',
      sender: currentUser.username,
      content: messageInput.trim(),
      timestamp: new Date().toISOString(),
      projectId: projectId,
    };

    if (client && client.connected) {
      try {
        client.publish({
          destination: `/app/chat.sendMessage/${projectId}`,
          body: JSON.stringify(chatMessage),
        });
        setMessageInput('');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: '전송 오류',
          text: '메시지 전송 중 문제가 발생했습니다.'
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: '연결 오류',
        text: '메시지를 전송할 수 없습니다. 연결 상태를 확인해주세요.'
      });
    }
  };

  return (
    <Container className="py-5 project-chat-container" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col xs={12} md={9}>
          <Card className="mb-3" style={{ height: '750px', display: 'flex', flexDirection: 'column' }}>
            <Card.Header className="bg-primary text-white">
              {project ? (
                <div>프로젝트 채팅방 - <strong>{project.name}</strong></div>
              ) : "프로젝트 채팅방"}
            </Card.Header>
            <Card.Body className="chat-body" style={{ flex: 1, overflowY: 'auto' }}>
              <ListGroup variant="flush">
                {messages.map((msg, index) => {
                  const isOwnMessage = msg.sender === currentUser.username;
                  const isSystemMessage = msg.system;
                  const profileSrc = isOwnMessage
                    ? (currentUser.profileImage ? `/uploads/profile-images/${currentUser.profileImage}` : defaultProfile)
                    : (msg.profileImage ? `/uploads/profile-images/${msg.profileImage}` : defaultProfile);

                  if (isSystemMessage) {
                    return (
                      <ListGroup.Item key={index} className="system-message">
                        {msg.content}
                        <div className="message-timestamp-small">
                          {new Date(msg.timestamp).toLocaleString()}
                        </div>
                      </ListGroup.Item>
                    );
                  } else {
                    return (
                      <ListGroup.Item
                        key={index}
                        className={isOwnMessage ? 'chat-message chat-message-sent' : 'chat-message chat-message-received'}>
                        <div className="chat-bubble">
                          <div className="message-header">
                            <Image src={profileSrc} roundedCircle className="message-profile" />
                            <span className="message-sender">{msg.sender}</span>
                            <span className="message-timestamp">{new Date(msg.timestamp).toLocaleString()}</span>
                          </div>
                          <div className="message-content">{msg.content}</div>
                        </div>
                      </ListGroup.Item>
                    );
                  }
                })}
                <div ref={messageEndRef} />
              </ListGroup>
            </Card.Body>
            <Card.Footer>
              <Form onSubmit={sendMessage} className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="메시지를 입력하세요..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <Button variant="primary" type="submit" className="ms-2">
                  <i className="fas fa-paper-plane"></i>
                </Button>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
        <Col xs={12} md={3}>
          <Card className="mb-3" style={{ height: '750px' }}>
            <Card.Header className="bg-secondary text-white">참여자 ({participants.length})</Card.Header>
            <Card.Body style={{ overflowY: 'auto' }}>
              {participants.length > 0 ? (
                <ListGroup variant="flush">
                  {participants.map((participant, idx) => (
                    <ListGroup.Item key={idx}>{participant}</ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-center">참여자가 없습니다.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProjectChatPage;