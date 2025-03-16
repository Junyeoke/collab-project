// src/components/CollabIntroPage.js

import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import cooperationImage from '../assets/images/free-icon-cooperation-3386765.png';

function CollabIntroPage() {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (!user) {
      Swal.fire({
        title: '알림',
        text: '회원가입을 하시면 모든 서비스를 이용해보실 수 있습니다.',
        icon: 'info',
        confirmButtonText: '로그인'
      }).then(() => {
        navigate('/login');
      });
    } else {
      // 로그인한 사용자라면 다른 페이지로 이동하는 로직(예: 대시보드)
      navigate('/dashboard');
    }
  };

  return (
    <Container fluid 
      className="p-0"
      style={{
        background: 'linear-gradient(135deg, #4B79A1, #283E51)', 
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Row className="w-100 m-0 d-flex align-items-center justify-content-center">
        {/* Grid 컬럼을 넓게 조정 */}
        <Col xs={12} md={10} lg={10}>
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 카드 스타일에 최대 너비 설정 */}
            <Card className="shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden', width: '100%', maxWidth: '1200px' }}>
              <Row className="g-0">
                {/* 이미지 컬럼 */}
                <Col md={6} className="d-none d-md-flex align-items-center justify-content-center" style={{ backgroundColor: '#283E51' }}>
                  <motion.img 
                    src={cooperationImage}
                    alt="협업 아이콘"
                    className="img-fluid"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ padding: '20px' }}
                  />
                </Col>
                {/* 소개 내용 컬럼 */}
                <Col xs={12} md={6}>
                  <Card.Body className="p-5">
                    <motion.div 
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <Card.Title as="h2" className="mb-4 text-primary text-center" style={{ fontWeight: 'bold' }}>
                        협업 플랫폼 소개
                      </Card.Title>
                      <Card.Text className="mb-4 text-center" style={{ fontSize: '1.1rem', color: '#555' }}>
                        팀원들이 함께 학습하고, 프로젝트를 효율적으로 관리할 수 있는 통합 플랫폼입니다.
                      </Card.Text>
                      <Card.Text style={{ fontSize: '1rem', color: '#333', lineHeight: 1.6 }}>
                        <ul style={{ paddingLeft: '20px' }}>
                          <li><strong>스터디 그룹 구성:</strong> 관심 분야별로 스터디 그룹을 쉽게 구성하고 참여할 수 있습니다.</li>
                          <li><strong>프로젝트 관리:</strong> 프로젝트 일정, 작업 배분 및 진행 상황을 한눈에 확인할 수 있습니다.</li>
                          <li><strong>실시간 채팅:</strong> 팀원들과 실시간으로 소통하며, 문제를 즉각적으로 해결할 수 있습니다.</li>
                          <li><strong>파일 공유:</strong> 중요한 문서나 자료를 안전하게 업로드하고 공유할 수 있습니다.</li>
                        </ul>
                      </Card.Text>
                      <div className="text-center mt-4">
                        <Button 
                          variant="primary" 
                          size="lg" 
                          style={{ borderRadius: '50px', padding: '10px 30px' }}
                          onClick={handleLearnMore}
                        >
                          더 알아보기
                        </Button>
                      </div>
                    </motion.div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}

export default CollabIntroPage;