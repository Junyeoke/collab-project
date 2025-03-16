// src/components/ProjectListPage.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function ProjectListPage() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 프로젝트 목록 불러오기
  useEffect(() => {
    axios.get('/api/projects')
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error("프로젝트 목록 불러오기 실패:", error);
      });
  }, []);

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
            <Card className="h-100 border-primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/create-project')}>
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
                  {/* 필요 시 프로젝트 상세페이지로 이동하는 버튼 추가 */}
                  <Button variant="primary">자세히 보기</Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ProjectListPage;