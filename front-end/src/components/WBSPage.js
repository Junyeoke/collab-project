import React, { useEffect, useState } from 'react';
import { Container, Button, ButtonGroup, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { ViewMode, Gantt } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import axios from 'axios';

function WBSPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState(ViewMode.Month);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWbsTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`/api/wbs/${projectId}`);

      const formatted = res.data.map((task) => {
        const start = new Date(task.startDate);
        const end = new Date(task.endDate);

        // 날짜 검증
        const isValidDate = (d) => d instanceof Date && !isNaN(d);
        if (!isValidDate(start) || !isValidDate(end)) return null;

        return {
          id: String(task.id),
          name: task.task,
          type: 'task',
          start,
          end,
          progress: task.progress ?? 0,
          isDisabled: false,
          project: task.category ?? '',
          dependencies: [],
        };
      }).filter(Boolean);

      setTasks(formatted);
    } catch (e) {
      console.error('WBS 조회 실패:', e);
      setError('WBS 데이터를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchWbsTasks();
    } else {
      setError('유효하지 않은 프로젝트입니다.');
    }
  }, [projectId]);

  return (
    <Container className="py-4">
      <h2 className="mb-4">📅 프로젝트 일정 관리 (WBS)</h2>

      <ButtonGroup className="mb-3">
        <Button variant={viewMode === ViewMode.Day ? 'primary' : 'outline-primary'} onClick={() => setViewMode(ViewMode.Day)}>일간</Button>
        <Button variant={viewMode === ViewMode.Week ? 'primary' : 'outline-primary'} onClick={() => setViewMode(ViewMode.Week)}>주간</Button>
        <Button variant={viewMode === ViewMode.Month ? 'primary' : 'outline-primary'} onClick={() => setViewMode(ViewMode.Month)}>월간</Button>
        {/* 선택사항: 연간 뷰도 추가하고 싶다면 아래 주석 해제 */}
        {/* <Button variant={viewMode === ViewMode.Year ? 'primary' : 'outline-primary'} onClick={() => setViewMode(ViewMode.Year)}>연간</Button> */}
      </ButtonGroup>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">일정을 불러오는 중...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : tasks.length === 0 ? (
        <Alert variant="info">등록된 일정이 없습니다.</Alert>
      ) : (
        <Gantt
          tasks={tasks}
          viewMode={viewMode}
          locale="ko"
          listCellWidth="180px"
          columnWidth={viewMode === ViewMode.Day ? 60 : viewMode === ViewMode.Week ? 150 : 300}
        />
      )}

      <div className="text-muted mt-3">
        ※ WBS 항목은 백엔드에서 자동 불러오며, 항목명 / 기간 / 진행률 등을 기준으로 표시됩니다.
      </div>
    </Container>
  );
}

export default WBSPage;