// src/components/ProjectChatPage.js
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
  const [messages, setMessages] = useState([]); // 기존 메시지 + 실시간 메시지 저장
  const [participants, setParticipants] = useState([]); // 참여자 목록
  const [messageInput, setMessageInput] = useState('');
  const messageEndRef = useRef(null);

  // 로컬 스토리지에서 로그인 사용자 정보 가져오기
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : { username: '익명', profileImage: null };

  // 1. 이전 채팅 기록 불러오기
  useEffect(() => {
    if (projectId) {
      axios.get(`/api/chat/history/${projectId}`)
        .then((response) => {
          console.log("불러온 채팅 기록:", response.data);
          setMessages(response.data);
        })
        .catch((error) => {
          console.error("채팅 기록 불러오기 실패:", error);
          Swal.fire({
            icon: 'error',
            title: '채팅 기록 불러오기 실패',
            text: '과거 채팅 기록을 불러오지 못했습니다.'
          });
        });
    }
  }, [projectId]);

  // 2. WebSocket 연결 및 실시간 메시지 수신
  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    stompClient.onConnect = () => {
      console.log('웹소켓 연결 성공');

      // 채팅 메시지 구독
      stompClient.subscribe(`/topic/project.${projectId}`, (message) => {
        if (message.body) {
          const receivedMessage = JSON.parse(message.body);
          // 시스템 메시지 처리
          if (receivedMessage.type === 'JOIN') {
            receivedMessage.content = `${receivedMessage.sender}님이 입장하였습니다.`;
            receivedMessage.system = true;
          } else if (receivedMessage.type === 'LEAVE') {
            receivedMessage.content = `${receivedMessage.sender}님이 나갔습니다.`;
            receivedMessage.system = true;
          }
          setMessages(prev => [...prev, receivedMessage]);
        }
      });

      // 참여자 목록 구독
      stompClient.subscribe(`/topic/project.${projectId}.participants`, (message) => {
        if (message.body) {
          setParticipants(JSON.parse(message.body));
        }
      });

      // 채팅 입장 메시지 전송
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

  // 3. 프로젝트 정보 불러오기 (프로젝트 이름 표시용)
  useEffect(() => {
    if (projectId) {
      axios.get(`/api/projects/${projectId}`)
        .then(response => {
          setProject(response.data);
        })
        .catch(error => {
          console.error("프로젝트 정보 불러오기 실패:", error);
          Swal.fire({
            icon: 'error',
            title: '프로젝트 정보 불러오기 실패',
            text: '프로젝트 정보를 불러오지 못했습니다.'
          });
        });
    }
  }, [projectId]);

  // 4. 메시지가 업데이트 될 때마다 스크롤 하단으로 이동
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 메시지 전송 함수
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
        console.error("메시지 전송 오류:", error);
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
    <Container className="py-5 project-chat-container d-flex align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        {/* 채팅 메시지 영역 */}
        <Col md={9}>
          <Card style={{ height: '750px', display: 'flex', flexDirection: 'column' }}>
            <Card.Header className="bg-primary text-white">
              {/* 프로젝트 정보가 로드되면 프로젝트 이름을 채팅방 헤더에 표시 */}
              {project ? (
                <div>
                  프로젝트 채팅방 - <strong>{project.name}</strong>
                </div>
              ) : (
                "프로젝트 채팅방"
              )}
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
                        <div className="message-timestamp-small">{new Date(msg.timestamp).toLocaleString()}</div>
                      </ListGroup.Item>
                    );
                  } else {
                    return (
                      <ListGroup.Item key={index} className={isOwnMessage ? 'chat-message chat-message-sent' : 'chat-message chat-message-received'}>
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
        {/* 참여자 목록 영역 */}
        <Col md={3}>
          <Card style={{ height: '750px' }}>
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