import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function CreateProjectPage() {
  const navigate = useNavigate();

  // 로컬 스토리지에서 로그인 사용자 정보 가져오기
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // 1) DB에 저장할 사용자 ID
  const [ownerId] = useState(user ? user.id : null);
  // 2) 화면에 표시할 사용자 이름
  const [creatorName] = useState(user ? user.id : '');

  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '프로젝트 이름을 입력해주세요',
      });
      return;
    }

    // POST 요청으로 프로젝트 생성
    axios.post('/api/projects', {
      name: projectName,
      description: description,
      ownerId: ownerId  // DB에는 숫자 PK가 저장됨
    })
    .then((response) => {
      Swal.fire({
        icon: 'success',
        title: '프로젝트 생성 완료',
        text: '프로젝트가 성공적으로 생성되었습니다.',
        confirmButtonText: '확인'
      }).then(() => {
        // 생성 후 홈 등으로 이동
        navigate('/');
      });
    })
    .catch((error) => {
      console.error('프로젝트 생성 실패:', error);
      Swal.fire({
        icon: 'error',
        title: '생성 실패',
        text: '프로젝트 생성에 실패했습니다. 다시 시도해주세요.',
      });
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #74ABE2, #5563DE)'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        width: '400px'
      }}>
        <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>프로젝트 생성</h3>
        <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label className="form-label">프로젝트 생성자</label>
            {/* 화면에는 username 표시 (읽기 전용) */}
            <input 
              type="text" 
              className="form-control" 
              value={creatorName} 
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">프로젝트 이름</label>
            <input 
              type="text" 
              className="form-control" 
              value={projectName} 
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">프로젝트 설명</label>
            <textarea 
              className="form-control" 
              rows="3" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        
          <button type="submit" className="btn btn-primary w-100">
            생성하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectPage;