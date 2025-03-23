import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import defaultProfile from '../assets/images/default_profile.png'; // 기본 프로필 이미지
import './LeftSidebar.css'; // 수정된 CSS 파일

function LeftSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAuthenticated = user !== null;

  // 현재 URL에서 프로젝트 ID 추출 (예: "/project/PROJECT_123/settings")
  let projectId = null;
  const pathSegments = location.pathname.split("/");
  if (pathSegments[1] === "project" && pathSegments.length > 2) {
    projectId = pathSegments[2];
  }

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

  // 모바일 화면 여부에 따라 사이드바 보이기/숨기기 토글 상태 관리
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  // 컴포넌트 마운트 시 현재 화면 크기에 따라 사이드바 초기 보임 여부 결정 (모바일이면 숨김)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarVisible(false);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  return (
    <>
      {/* 토글 버튼: 수정된 스타일 적용 */}
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>

      {/* 사이드바: isSidebarVisible이 true일 때 렌더링 */}
      {isSidebarVisible && (
        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
          {/* Sidebar - Brand */}
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

          {/* 로그인 상태에 따른 사용자 정보 표시 */}
          {isAuthenticated ? (
            <div className="sidebar-user-info text-center my-3">
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
          {!projectId && (
            <>
              <li className="nav-item active">
                <Link className="nav-link" to="/">
                  <i className="fas fa-fw fa-tachometer-alt"></i>
                  <span>Collab 알아보기</span>
                </Link>
              </li>

              {isAuthenticated && (
                <>
                  <hr className="sidebar-divider" />
                  <div className="sidebar-heading">프로젝트</div>
                  <li className="nav-item">
                    <Link className="nav-link" to="/project-list">
                      <i className="fas fa-fw fa-list"></i>
                      <span>프로젝트 목록</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/calendar">
                      <i className="fas fa-calendar-alt"></i>
                      <span>캘린더</span>
                    </Link>
                  </li>
                </>
              )}
            </>
          )}

          {/* 프로젝트 상세 페이지인 경우 */}
          {projectId && (
  <>
    <div className="sidebar-heading">프로젝트 관리</div>
    <li className="nav-item">
      <Link className="nav-link" to={`/project/${projectId}/settings`}>
        <i className="fas fa-cog"></i>
        <span>프로젝트 설정</span>
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to={`/project/${projectId}/menu-settings`}>
        <i className="fas fa-bars"></i>
        <span>프로젝트 메뉴 설정</span>
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to={`/project/${projectId}/chat`}>
        <i className="fas fa-comments"></i>
        <span>프로젝트 채팅방</span>
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to={`/project/${projectId}/wbs`}>
        <i className="fas fa-project-diagram"></i> {/* 또는 calendar-alt 등 아이콘 변경 가능 */}
        <span>프로젝트 일정관리</span> {/* 또는 "WBS"로 명시 */}
      </Link>
    </li>
  </>
)}

          <hr className="sidebar-divider d-none d-md-block" />
        </ul>
      )}
    </>
  );
}

export default LeftSidebar;