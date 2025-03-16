// src/components/ProjectSettingsPage.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function ProjectSettingsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState({
    name: '',
    description: '',
    deadline: '',
    tags: '',
    priority: '보통',
    status: '',
  });

  // 프로젝트 데이터 불러오기
  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  const fetchProjectData = () => {
    if (!id) {
      console.error("프로젝트 ID가 없습니다.");
      return;
    }

    axios.get(`/api/projects/${id}`)
      .then(response => {
        setProject({
          name: response.data.name,
          description: response.data.description,
          // ISO 형식 문자열에서 날짜 부분만 추출 (YYYY-MM-DD)
          deadline: response.data.deadline ? response.data.deadline.split("T")[0] : '',
          tags: response.data.tags || '',
          priority: response.data.priority || '보통',
          status: response.data.status || '',
        });
      })
      .catch(error => {
        console.error("프로젝트 정보 불러오기 실패:", error);
        Swal.fire({
          icon: 'error',
          title: '프로젝트 정보 불러오기 실패',
          text: '프로젝트 정보를 불러올 수 없습니다.'
        });
      });
  };

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  // 프로젝트 정보 업데이트
  const handleUpdateProject = (e) => {
    e.preventDefault();

    // payload 구성 시, deadline이 빈 문자열이면 null로 전송
    const payload = {
      name: project.name,
      description: project.description,
      deadline: project.deadline ? project.deadline : null,
      tags: project.tags,
      priority: project.priority,
      status: project.status,
    };

    axios.put(`/api/projects/${id}`, payload)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: '수정 완료',
          text: '프로젝트 정보가 업데이트되었습니다.',
          confirmButtonText: '확인'
        });
      })
      .catch(error => {
        console.error("프로젝트 업데이트 실패:", error);
        Swal.fire({
          icon: 'error',
          title: '수정 실패',
          text: '프로젝트 정보를 업데이트할 수 없습니다.'
        });
      });
  };

  // 프로젝트 종료(삭제) 기능
  const handleDeleteProject = () => {
    Swal.fire({
      title: '프로젝트를 종료하시겠습니까?',
      text: '삭제하면 복구할 수 없습니다!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '삭제',
      cancelButtonText: '취소'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/projects/${id}`)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: '프로젝트 종료',
              text: '프로젝트가 삭제되었습니다.'
            }).then(() => {
              navigate('/project-list');
            });
          })
          .catch(error => {
            console.error("프로젝트 삭제 실패:", error);
            Swal.fire({
              icon: 'error',
              title: '삭제 실패',
              text: '프로젝트 삭제에 실패했습니다.'
            });
          });
      }
    });
  };

  return (
    <Container className="project-settings-container py-5">
      <h2 className="text-center mb-4">프로젝트 설정</h2>
      
      <Form onSubmit={handleUpdateProject}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>프로젝트 이름</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={project.name}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>마감일</Form.Label>
              <Form.Control
                type="date"
                name="deadline"
                value={project.deadline}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>프로젝트 설명</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={project.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>태그</Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={project.tags}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>우선순위</Form.Label>
              <Form.Select
                name="priority"
                value={project.priority}
                onChange={handleChange}
              >
                <option value="낮음">낮음</option>
                <option value="보통">보통</option>
                <option value="높음">높음</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>상태</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={project.status}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-between mt-4">
          <Button variant="primary" type="submit">
            수정하기
          </Button>
          <Button variant="danger" onClick={handleDeleteProject}>
            프로젝트 종료
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default ProjectSettingsPage;