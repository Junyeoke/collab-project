// src/components/LeftSidebar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import defaultProfile from '../assets/images/default_profile.png'; // 기본 프로필 이미지

function LeftSidebar() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAuthenticated = user !== null;

  const handleLogout = () => {
    Swal.fire({
      title: '로그아웃',
      text: '로그아웃 하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '로그아웃',
      cancelButtonText: '취소'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        Swal.fire({
          title: '로그아웃 되었습니다.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        navigate("/login");
      }
    });
  };

  return (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      {/* Sidebar - Brand: 버튼을 사용하여 항상 '/' 페이지로 이동 */}
      <button
        className="sidebar-brand d-flex align-items-center justify-content-center btn btn-link"
        onClick={() => navigate("/")}
        style={{ textDecoration: 'none' }}
      >
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-handshake fa-lg" style={{ marginRight: '8px' }}></i>
        </div>
        <div className="sidebar-brand-text mx-3">Collab</div>
      </button>

      <hr className="sidebar-divider my-0" />

      {/* 로그인 상태에 따른 정보 표시 */}
      {isAuthenticated ? (
        <div className="sidebar-user-info text-center my-3">
          {/* 프로필 사진 */}
          <div className="mb-2">
            <img
              src={user.profileImage ? `/uploads/profile-images/${user.profileImage}` : defaultProfile}
              alt="Profile"
              className="rounded-circle"
              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            />
          </div>
          <h5 className="text-white mb-0">안녕하세요, {user.username} 님</h5>
          <p className="text-white-50 small mb-2">{user.email}</p>
          <div className="d-flex justify-content-center gap-2">
            <Link 
              className="btn btn-outline-light btn-sm d-flex align-items-center" 
              to="/profile"
            >
              <i className="fas fa-user me-1"></i>
              내정보
            </Link>
            <button 
              className="btn btn-outline-light btn-sm d-flex align-items-center" 
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt me-1"></i>
              로그아웃
            </button>
          </div>
        </div>
      ) : (
        <div className="sidebar-auth-links text-center my-3">
          <div className="d-flex justify-content-center gap-2">
            <Link 
              className="btn btn-outline-light btn-sm d-flex align-items-center" 
              to="/login"
            >
              <i className="fas fa-sign-in-alt me-1"></i>
              로그인
            </Link>
            <Link 
              className="btn btn-outline-light btn-sm d-flex align-items-center" 
              to="/signup"
            >
              <i className="fas fa-user-plus me-1"></i>
              회원가입
            </Link>
          </div>
        </div>
      )}

      <hr className="sidebar-divider" />

      {/* 기본 네비게이션 */}
      <li className="nav-item active">
        <Link className="nav-link" to="/">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Collab 알아보기</span>
        </Link>
      </li>

      <hr className="sidebar-divider" />

      <div className="sidebar-heading">사용자</div>
      <li className="nav-item">
        <Link className="nav-link" to="/users">
          <i className="fas fa-fw fa-user"></i>
          <span>사용자 목록</span>
        </Link>
      </li>

      {!isAuthenticated && (
        <li className="nav-item">
          <Link className="nav-link" to="/signup">
            <i className="fas fa-fw fa-user-plus"></i>
            <span>회원가입</span>
          </Link>
        </li>
      )}

      <hr className="sidebar-divider" />

    {/* 프로젝트 섹션 */}
<div className="sidebar-heading">프로젝트</div>
<li className="nav-item">
  <Link className="nav-link" to="/create-project">
    <i className="fas fa-fw fa-folder-plus"></i>
    <span>프로젝트 생성</span>
  </Link>
</li>
<li className="nav-item">
  <Link className="nav-link" to="/project-list">
    <i className="fas fa-fw fa-list"></i>
    <span>프로젝트 목록</span>
  </Link>
</li>

      <hr className="sidebar-divider d-none d-md-block" />
    </ul>
  );
}

export default LeftSidebar;