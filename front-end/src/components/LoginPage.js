// src/components/LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  // 사용자 지정 ID를 위한 상태 변수 (이전 username → id)
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // 기존 에러 초기화

    const loginData = { id, password };

    axios.post('/api/users/login', loginData)
      .then((response) => {
        // 로그인 성공 시 사용자 정보 저장 (예: localStorage)
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate('/'); // 로그인 후 홈 화면 등으로 이동
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          setError(err.response.data);
        } else {
          setError('로그인에 실패했습니다.');
        }
      });
  };

  return (
    <div className="bg-gradient-primary d-flex align-items-center" style={{ minHeight: '100vh' }}>
      <div className="container-fluid h-100">
        <div className="row h-100 d-flex justify-content-center align-items-center mx-0">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            <div className="card o-hidden border-0 shadow-lg">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h1 className="h4 text-gray-900">로그인</h1>
                </div>
                <form className="user" onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <input
                      type="text"
                      className="form-control form-control-user"
                      placeholder="사용자 ID"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <input
                      type="password"
                      className="form-control form-control-user"
                      placeholder="비밀번호"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <div className="text-danger mb-3">{error}</div>}
                  <button type="submit" className="btn btn-primary btn-user btn-block">
                    로그인
                  </button>
                </form>
                <hr />
                <div className="text-center">
                  <a className="small" href="/signup">회원가입</a>
                </div>
              </div>
            </div>
          </div> {/* col end */}
        </div>   {/* row end */}
      </div>     {/* container-fluid end */}
    </div>
  );
}

export default LoginPage;