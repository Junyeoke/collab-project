// src/components/SignUpPage.js

import React, { useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
  const navigate = useNavigate();

  // 사용자 ID (로그인용, PK)와 사용자 이름(실제 이름)을 별도로 관리
  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showAgreedMessage, setShowAgreedMessage] = useState(false);
  
  // 모달 열림/닫힘 상태
  const [showModal, setShowModal] = useState(false);

  // 에러 메시지 관리를 위한 객체
  const [errors, setErrors] = useState({});

  // 중복 체크 관련 상태 (사용자 ID 중복 체크)
  const [idAvailable, setIdAvailable] = useState(null);
  const [idCheckMessage, setIdCheckMessage] = useState("");

  // 이용약관 내용 스크롤 영역 참조
  const termsContentRef = useRef(null);

  // 폼 유효성 검사 함수
  const validateForm = () => {
    const newErrors = {};

    if (!id.trim()) {
      newErrors.id = '사용자 ID를 입력해주세요.';
    }
    if (!username.trim()) {
      newErrors.username = '사용자 이름을 입력해주세요.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = '유효한 이메일 형식이 아닙니다.';
    }
    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    if (!acceptTerms) {
      newErrors.acceptTerms = '이용 약관에 동의해야 가입이 가능합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 사용자 ID 중복 체크 함수
  const handleCheckId = async () => {
    if (!id.trim()) {
      setIdCheckMessage("사용자 ID를 입력해주세요.");
      setIdAvailable(false);
      return;
    }
    try {
      // 백엔드에서 ID 중복 확인 전용 엔드포인트 호출
      await axios.get(`/api/users/check-id?id=${id}`);
      // HTTP 200 반환 시 사용 가능한 ID
      setIdAvailable(true);
      setIdCheckMessage("사용 가능한 ID입니다.");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setIdAvailable(false);
        setIdCheckMessage("이미 사용 중인 ID입니다.");
      } else {
        setIdAvailable(false);
        setIdCheckMessage("중복 확인에 실패했습니다.");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newUser = { id, username, email, password };
    axios.post('/api/users/register', newUser)
      .then(() => {
        Swal.fire({
          title: '회원가입 성공',
          text: '회원가입에 성공했습니다! 로그인 페이지로 이동합니다.',
          icon: 'success',
          confirmButtonText: '확인'
        }).then(() => {
          navigate("/login");
        });
        // 폼 초기화
        setId('');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAcceptTerms(false);
        setShowAgreedMessage(false);
        setErrors({});
        setIdAvailable(null);
        setIdCheckMessage("");
      })
      .catch(err => {
        console.error('회원가입 실패:', err);
      });
  };

  // 모달 열기/닫기
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  // 약관 스크롤 감지: 스크롤이 끝까지 내려가면 자동 동의 처리 + 애니메이션 메시지 표시
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight) {
      if (!acceptTerms) {
        setAcceptTerms(true);
        setShowAgreedMessage(true);
      }
    }
  };

  return (
    <div className="bg-gradient-primary d-flex align-items-center" style={{ minHeight: '100vh' }}>
      {/* 인라인 스타일로 애니메이션 정의 */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .fade-in {
            animation: fadeIn 1s forwards;
          }
        `}
      </style>

      <div className="container-fluid h-100">
        <div className="row h-100 d-flex justify-content-center align-items-center mx-0">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            <div className="card o-hidden border-0 shadow-lg">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h1 className="h4 text-gray-900">회원가입</h1>
                  <div className="sidebar-brand-icon rotate-n-15">
                    <i className="fas fa-laugh-wink"></i>
                  </div>
                  <div className="sidebar-brand-text mx-3">Collab <sup>2</sup></div>
                </div>
                
                <form className="user" onSubmit={handleSubmit}>
                  {/* 사용자 ID 입력 및 중복 체크 */}
                  <div className="form-group mb-3">
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="form-control form-control-user" 
                        placeholder="사용자 ID" 
                        value={id} 
                        onChange={(e) => {
                          setId(e.target.value);
                          setIdAvailable(null);
                          setIdCheckMessage("");
                        }}
                      />
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={handleCheckId}
                      >
                        중복 확인
                      </button>
                    </div>
                    {idCheckMessage && (
                      <small className={idAvailable ? "text-success" : "text-danger"}>
                        {idCheckMessage}
                      </small>
                    )}
                    {errors.id && (
                      <small className="text-danger">{errors.id}</small>
                    )}
                  </div>

                  {/* 사용자 이름 입력 */}
                  <div className="form-group mb-3">
                    <input
                      type="text"
                      className="form-control form-control-user"
                      placeholder="사용자 이름"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && (
                      <small className="text-danger">{errors.username}</small>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <input
                      type="email"
                      className="form-control form-control-user"
                      placeholder="이메일"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                      <small className="text-danger">{errors.email}</small>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <input
                      type="password"
                      className="form-control form-control-user"
                      placeholder="비밀번호 (6자 이상)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && (
                      <small className="text-danger">{errors.password}</small>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <input
                      type="password"
                      className="form-control form-control-user"
                      placeholder="비밀번호 확인"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.confirmPassword && (
                      <small className="text-danger">{errors.confirmPassword}</small>
                    )}
                  </div>

                  <div className="form-group form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="acceptTerms"
                      checked={acceptTerms}
                      disabled={!acceptTerms} 
                      onChange={() => {}}
                    />
                    <label className="form-check-label" htmlFor="acceptTerms">
                      <span 
                        style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }}
                        onClick={openModal}
                      >
                        이용 약관
                      </span>
                      에 동의합니다
                    </label>
                    {errors.acceptTerms && (
                      <div>
                        <small className="text-danger">{errors.acceptTerms}</small>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-user btn-block"
                  >
                    회원가입
                  </button>
                </form>

                <hr />
                <div className="text-center">
                  <a className="small" href="/login">이미 계정이 있나요? 로그인</a>
                </div>
              </div>
            </div>
          </div> {/* col end */}
        </div>   {/* row end */}
      </div>     {/* container-fluid end */}

      {/* 약관 모달 */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h5>이용 약관</h5>
            <div 
              style={styles.termsBox} 
              onScroll={handleScroll} 
              ref={termsContentRef}
            >
              <p>
                <strong>서비스 이용약관</strong><br /><br />
                제1조 (목적)<br />
                이 약관은 [회사명] (이하 "회사")가 제공하는 [서비스명] (이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.<br /><br />
                제2조 (정의)<br />
                1. "이용자"란 회사가 제공하는 서비스를 이용하는 모든 자를 말합니다.<br />
                2. "회원"이란 서비스 이용을 위해 회사와 이용계약을 체결한 자를 말합니다.<br /><br />
                제3조 (서비스 이용)<br />
                회사는 이용자에게 최상의 서비스를 제공하기 위해 노력하며, 이용자는 이에 협조해야 합니다.<br /><br />
                제4조 (개인정보 보호)<br />
                회사는 관련 법령에 따라 이용자의 개인정보를 보호하며, 자세한 내용은 개인정보 처리방침에 따릅니다.<br /><br />
                제5조 (서비스 제공의 중지 및 제한)<br />
                회사는 불가항력적 사유로 인한 서비스 제공의 중단에 대해 책임지지 않습니다.<br /><br />
                제6조 (면책조항)<br />
                회사는 천재지변 등 불가항력적 사유로 인한 손해에 대해 책임지지 않습니다.<br /><br />
                제7조 (분쟁 해결)<br />
                이용자와 회사 간 분쟁은 상호 협의하여 해결하며, 협의가 어려울 경우 관할 법원에 제소할 수 있습니다.<br /><br />
                끝까지 스크롤하시면 자동 동의 처리됩니다.
              </p>
            </div>
            {showAgreedMessage && (
              <div className="fade-in" style={styles.agreedMessage}>
                이용약관에 동의하였습니다.
              </div>
            )}
            <button 
              className="btn btn-secondary mt-3"
              onClick={closeModal}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '800px',
    height: '500px',
    maxHeight: '80vh',
    overflowY: 'auto',
    textAlign: 'left'
  },
  termsBox: {
    height: '350px',
    overflowY: 'auto',
    border: '1px solid #ccc',
    padding: '10px',
    marginTop: '10px',
  },
  agreedMessage: {
    marginTop: '10px',
    color: 'green',
    fontWeight: 'bold'
  },
};

export default SignUpPage;