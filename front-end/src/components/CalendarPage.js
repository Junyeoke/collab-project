import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ko from '@fullcalendar/core/locales/ko'; // ✅ 한국어 로케일 추가
import { Container, Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import './CalendarPage.css';

function CalendarPage() {
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const username = currentUser?.username;

  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  // ✅ 항목별 색상 지정
  const categoryColors = {
    회의: '#007bff',
    할일: '#28a745',
    휴가: '#ffc107',
    기타: '#6c757d'
  };

  // ✅ 일정 조회
  useEffect(() => {
    if (!username) return;

    axios.get(`/api/calendar/user/${username}`)
      .then(res => {
        const mappedEvents = res.data.map(evt => ({
          id: evt.id,
          title: evt.title,
          start: evt.startDate,
          end: evt.endDate,
          color: categoryColors[evt.category] || '#17a2b8',
          extendedProps: {
            description: evt.description,
            category: evt.category
          }
        }));
        setEvents(mappedEvents);
      })
      .catch(err => {
        console.error("일정 불러오기 실패:", err);
        Swal.fire({
          icon: 'error',
          title: '일정 조회 실패',
          text: '일정을 불러오는 중 문제가 발생했습니다.'
        });
      });
  }, [username]);

  const handleDateClick = (arg) => {
    setStartDate(arg.dateStr);
    setEndDate(arg.dateStr);
    setShowModal(true);
  };

  const handleEventClick = (info) => {
    setSelectedEvent({
      title: info.event.title,
      startDate: info.event.startStr,
      endDate: info.event.endStr,
      description: info.event.extendedProps.description,
      category: info.event.extendedProps.category
    });
    setShowViewModal(true);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (!username) {
      Swal.fire("로그인이 필요합니다.", "", "warning");
      return;
    }

    const newEvent = {
      title,
      description,
      username,
      startDate,
      endDate,
      category
    };

    try {
      const response = await axios.post('/api/calendar', newEvent);
      const saved = response.data;

      setEvents(prev => [
        ...prev,
        {
          id: saved.id,
          title: saved.title,
          start: saved.startDate,
          end: saved.endDate,
          color: categoryColors[saved.category] || '#17a2b8',
          extendedProps: {
            description: saved.description,
            category: saved.category
          }
        }
      ]);

      setShowModal(false);
      setTitle('');
      setStartDate('');
      setEndDate('');
      setDescription('');
      setCategory('');
      Swal.fire("일정이 등록되었습니다!", "", "success");

    } catch (error) {
      console.error("일정 등록 실패:", error);
      Swal.fire("등록 실패", "일정 등록 중 오류가 발생했습니다.", "error");
    }
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">캘린더</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        locale={ko} // ✅ 한글로 변경
        height="auto"
      />

      {/* 일정 등록 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>일정 등록</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddEvent}>
            <Form.Group className="mb-3">
              <Form.Label>항목</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">선택하세요</option>
                <option value="회의">회의</option>
                <option value="할일">할일</option>
                <option value="휴가">휴가</option>
                <option value="기타">기타</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>제목</Form.Label>
              <Form.Control
                type="text"
                placeholder="예: 회의, 할 일 등"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>시작일</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>종료일</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>설명</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="일정에 대한 상세 설명"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              등록하기
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* 일정 보기 모달 */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>일정 상세 보기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <>
              <p><strong>제목:</strong> {selectedEvent.title}</p>
              <p><strong>항목:</strong> {selectedEvent.category || '없음'}</p>
              <p><strong>시작일:</strong> {selectedEvent.startDate}</p>
              <p><strong>종료일:</strong> {selectedEvent.endDate}</p>
              <p><strong>설명:</strong> {selectedEvent.description || '없음'}</p>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default CalendarPage;