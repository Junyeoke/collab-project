import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaCalendarAlt, FaTags, FaFlag, FaClipboardList } from 'react-icons/fa';
import './ProjectDetailPage.css'; // 스타일 추가

function ProjectDetailPage() {
  const { id } = useParams(); // URL에서 프로젝트 ID 가져오기
  const { projectId } = useParams(); // 이렇게 맞춰줘야 projectId가 제대로 들어옴
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetchProjectDetail();
  }, []);

  const fetchProjectDetail = () => {
    axios.get(`/api/projects/${id}`)
      .then(response => {
        setProject(response.data);
      })
      .catch(error => {
        console.error("프로젝트 상세 정보 불러오기 실패:", error);
        Swal.fire({
          icon: 'error',
          title: '프로젝트 상세 정보 불러오기 실패',
          text: '프로젝트 정보를 불러올 수 없습니다.'
        });
      });
  };

  if (!project) {
    return <p className="text-center mt-5">로딩 중...</p>;
  }

  return (
    <Container className="project-detail-container py-4">
      {/* 프로젝트 헤더 */}
      <div className="project-header">
        <h1 className="project-title">{project.name}</h1>
        <p className="project-description">{project.description}</p>
      </div>

      {/* 프로젝트 정보 섹션 */}
      <Row className="project-info-section mt-4">
        <Col md={6} className="info-box">
          <FaCalendarAlt className="info-icon" />
          <div>
            <h5>마감일</h5>
            <p>{new Date(project.deadline).toLocaleString()}</p>
          </div>
        </Col>

        <Col md={6} className="info-box">
          <FaTags className="info-icon" />
          <div>
            <h5>태그</h5>
            <p>{project.tags || "없음"}</p>
          </div>
        </Col>

        <Col md={6} className="info-box">
          <FaFlag className="info-icon" />
          <div>
            <h5>우선순위</h5>
            <p>{project.priority}</p>
          </div>
        </Col>

        <Col md={6} className="info-box">
          <FaClipboardList className="info-icon" />
          <div>
            <h5>상태</h5>
            <p>{project.status}</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProjectDetailPage;