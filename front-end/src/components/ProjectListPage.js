// src/components/ProjectListPage.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './ProjectListPage.css'; // CSS 파일 import

function ProjectListPage() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // 프로젝트 생성 폼 상태
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');

  const navigate = useNavigate();

  // 로컬 스토리지에서 로그인 사용자 정보 가져오기
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const ownerId = user ? user.id : "";

  // 컴포넌트 마운트 시 프로젝트 목록 불러오기
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    axios.get('/api/projects')
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error("프로젝트 목록 불러오기 실패:", error);
        Swal.fire({
          icon: 'error',
          title: '프로젝트 목록 불러오기 실패',
          text: '프로젝트 목록을 불러오지 못했습니다.'
        });
      });
  };

  // 모달 열기/닫기
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    // 폼 내용 초기화
    setProjectName('');
    setDescription('');
  };

  // 프로젝트 생성
  const handleCreateProject = (e) => {
    e.preventDefault();

    if (!projectName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '프로젝트 이름을 입력해주세요.'
      });
      return;
    }

    axios.post('/api/projects', {
      name: projectName,
      description: description,
      ownerId: ownerId, // 로그인한 사용자의 ID 전달
    })
    .then(response => {
      Swal.fire({
        icon: 'success',
        title: '프로젝트 생성 완료',
        text: '프로젝트가 성공적으로 생성되었습니다.',
        confirmButtonText: '확인'
      }).then(() => {
        // 모달 닫고 목록 갱신
        handleCloseModal();
        fetchProjects(); // 새로고침 없이 목록 업데이트
      });
    })
    .catch(error => {
      console.error('프로젝트 생성 실패:', error);
      Swal.fire({
        icon: 'error',
        title: '프로젝트 생성 실패',
        text: '프로젝트 생성에 실패했습니다. 다시 시도해주세요.'
      });
    });
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">프로젝트 목록</h2>
      <Row className="mb-4">
        <Col md={4}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            {/* 프로젝트 생성하기 박스 → 클릭 시 모달 열기 */}
            <Card className="h-100 border-primary project-create-card" style={{ cursor: 'pointer' }} onClick={handleShowModal}>
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <i className="fas fa-plus fa-3x text-primary mb-3"></i>
                <Card.Title>프로젝트 생성하기</Card.Title>
                <Card.Text>새 프로젝트를 생성하려면 여기를 클릭하세요.</Card.Text>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        {/* 기존 프로젝트 목록 */}
        {projects.map(project => (
          <Col key={project.id} md={4} className="mb-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
            >
              <Card>
                <Card.Body>
                  <Card.Title>{project.name}</Card.Title>
                  <Card.Text>{project.description}</Card.Text>
                  <Button variant="primary">자세히 보기</Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* 프로젝트 생성 모달 */}
      <Modal show={showModal} onHide={handleCloseModal} centered dialogClassName="rounded-modal">
        <Modal.Header closeButton>
          <Modal.Title>프로젝트 생성</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateProject}>
          <Modal.Body>
            {/* 생성자 ID 읽기 전용 필드 */}
            <Form.Group className="mb-3">
              <Form.Label>프로젝트 소유자</Form.Label>
              <Form.Control
                type="text"
                value={ownerId}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>프로젝트 이름</Form.Label>
              <Form.Control
                type="text"
                placeholder="예: 협업툴 개발"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>프로젝트 설명</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="프로젝트에 대한 간단한 설명을 입력하세요."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              닫기
            </Button>
            <Button variant="primary" type="submit">
              생성하기
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default ProjectListPage;