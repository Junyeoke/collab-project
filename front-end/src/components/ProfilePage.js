// src/components/ProfilePage.js

import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import { motion } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import defaultProfile from '../assets/images/default_profile.png'; // 기본 프로필 이미지

function ProfilePage() {
  const navigate = useNavigate();
  // 로컬 스토리지에 저장된 사용자 정보를 초기값으로 사용
  const storedUser = localStorage.getItem("user");
  const initialUser = storedUser ? JSON.parse(storedUser) : {};

  // 로그인 ID (변경 불가능)
  const [loginId] = useState(initialUser.id || '');
  // 수정 가능한 사용자 이름, 이메일, 비밀번호
  const [username, setUsername] = useState(initialUser.username || '');
  const [email, setEmail] = useState(initialUser.email || '');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  // 프로필 이미지 파일과 미리보기 URL 상태
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    initialUser.profileImage
      ? `/uploads/profile-images/${initialUser.profileImage}`
      : defaultProfile
  );

  // 폼 유효성 검사 함수
  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = '사용자 이름을 입력해주세요.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = '유효한 이메일 형식이 아닙니다.';
    }
    if (password && password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 파일 선택 시 자동 업로드 처리
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(file);
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    // 파일 선택 후 바로 업로드
    handleUploadImage(file);
  };

  // 프로필 이미지 업로드 함수
  const handleUploadImage = (fileParam) => {
    const fileToUpload = fileParam || profileImage;
    if (!fileToUpload) {
      Swal.fire({ icon: 'warning', title: '프로필 이미지를 선택해주세요.' });
      return;
    }
    const formData = new FormData();
    formData.append("file", fileToUpload);

    axios.post(`/api/users/${loginId}/upload-profile-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
      .then(response => {
        Swal.fire({ icon: 'success', title: '프로필 이미지 업로드 성공' });
        const updatedUser = response.data;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        // 업로드 후 반환된 이미지가 있으면 해당 경로로 업데이트, 그렇지 않으면 기본 이미지 유지
        setPreviewImage(updatedUser.profileImage 
          ? `/uploads/profile-images/${updatedUser.profileImage}`
          : defaultProfile
        );
      })
      .catch(error => {
        console.error("프로필 이미지 업로드 실패:", error);
        Swal.fire({ icon: 'error', title: '프로필 이미지 업로드 실패' });
      });
  };

  // 프로필 이미지 삭제 함수
  const handleDeleteImage = () => {
    axios.delete(`/api/users/${loginId}/delete-profile-image`)
      .then(response => {
        Swal.fire({ icon: 'success', title: '프로필 이미지 삭제 성공' });
        const updatedUser = response.data;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        // 이미지 삭제 후 기본 이미지로 업데이트
        setPreviewImage(defaultProfile);
      })
      .catch(error => {
        console.error("프로필 이미지 삭제 실패:", error);
        Swal.fire({ icon: 'error', title: '프로필 이미지 삭제 실패' });
      });
  };

  // 회원정보 수정 폼 제출 함수 (프로필 사진 업로드는 별도로 처리)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      id: loginId,       // 변경 불가능한 로그인 ID
      username,          // 수정 가능한 사용자 이름
      email,
      ...(password && { password })
    };

    axios.put(`/api/users/${loginId}`, payload)
      .then(response => {
        Swal.fire({
          title: '정보 수정 성공',
          text: '회원 정보를 성공적으로 수정했습니다.',
          icon: 'success',
          confirmButtonText: '확인'
        }).then(() => {
          localStorage.setItem("user", JSON.stringify(response.data));
          navigate("/");
        });
      })
      .catch(error => {
        console.error("회원 정보 수정 실패:", error);
        Swal.fire({
          title: '수정 실패',
          text: '회원 정보 수정에 실패했습니다. 다시 시도해주세요.',
          icon: 'error'
        });
      });
  };

  return (
    <Container fluid className="py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="shadow rounded" style={{ border: 'none' }}>
            {/* <h2 className="text-center mb-4 mt-4" style={{ color: '#007bff' }}>내 정보 수정</h2> */}
              <Card.Body>
                {/* 프로필 이미지를 최상단 가운데 배치 */}
                <div className="text-center mb-4">
                  <Image src={previewImage} roundedCircle style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                  {previewImage && previewImage !== defaultProfile && (
                    <div className="mt-2">
                      <Button variant="outline-danger" size="sm" onClick={handleDeleteImage}>
                        사진 삭제
                      </Button>
                    </div>
                  )}
                </div>
               
                <Form onSubmit={handleSubmit}>
                  {/* 로그인 ID: 읽기 전용 */}
                  <Form.Group controlId="formLoginId" className="mb-3">
                    <Form.Label style={{ fontWeight: 'bold' }}>로그인 ID</Form.Label>
                    <Form.Control type="text" value={loginId} readOnly />
                  </Form.Group>
                  {/* 사용자 이름 */}
                  <Form.Group controlId="formUsername" className="mb-3">
                    <Form.Label style={{ fontWeight: 'bold' }}>사용자 이름</Form.Label>
                    <Form.Control type="text" placeholder="사용자 이름" value={username} onChange={(e) => setUsername(e.target.value)} isInvalid={!!errors.username} />
                    <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                  </Form.Group>
                  {/* 이메일 */}
                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label style={{ fontWeight: 'bold' }}>이메일</Form.Label>
                    <Form.Control type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} isInvalid={!!errors.email} />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>
                  {/* 비밀번호 (변경 시 입력) */}
                  <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label style={{ fontWeight: 'bold' }}>비밀번호 (변경 시 입력)</Form.Label>
                    <Form.Control type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} isInvalid={!!errors.password} />
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                  </Form.Group>
                  {/* 프로필 이미지 업로드 */}
                  <Form.Group controlId="formProfileImage" className="mb-3">
                    <Form.Label style={{ fontWeight: 'bold' }}>프로필 사진 변경</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} />
                  </Form.Group>
                  <div className="text-center mt-4">
                    <Button variant="primary" type="submit" size="lg" style={{ borderRadius: '50px', padding: '10px 30px' }}>
                      정보 수정
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;