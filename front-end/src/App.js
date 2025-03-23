// src/App.js

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CollabIntroPage from './components/CollabIntroPage';
import SignUpPage from './components/SignUpPage';
import LoginPage from './components/LoginPage';
import CreateProjectPage from './components/CreateProjectPage';
import ProfilePage from './components/ProfilePage';
import ProjectListPage from './components/ProjectListPage';
import LeftSidebar from './components/LeftSidebar';
import UserList from './components/UserList';
import ProjectDetailPage from './components/ProjectDetailPage';
import ProjectSettingsPage from './components/ProjectSettingsPage';
import ProjectChatPage from './components/ProjectChatPage'; // 프로젝트 채팅방 페이지 추가
import CalendarPage from './components/CalendarPage';
import WBSPage from './components/WBSPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* 회원가입 및 로그인 페이지: 사이드바 없이 단독 렌더링 */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 사이드바 포함 레이아웃 */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </Router>
  );
}

function MainLayout() {
  return (
    <div id="wrapper">
      <LeftSidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <Routes>
            <Route path="/" element={<CollabIntroPage />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/create-project" element={<CreateProjectPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/project-list" element={<ProjectListPage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
            <Route path="/project/:id/settings" element={<ProjectSettingsPage />} />
            {/* 프로젝트 채팅방 페이지 */}
            <Route path="/project/:projectId/chat" element={<ProjectChatPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/project/:projectId/wbs" element={<WBSPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;