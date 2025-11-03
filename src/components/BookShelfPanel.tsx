/**
 * BookShelfPanel 컴포넌트
 *
 * @description
 * - 내 서재에 추가 기능 (인라인 패널)
 * - 읽고 있는 책 / 다 읽은 책 탭
 * - 날짜 선택 (시작일/종료일)
 * - 달력 UI
 * - 별점 선택
 * - 짧은 기록 입력
 */

import React, { useState } from 'react';
import type { UserBookState } from '@/types/user';

interface BookShelfPanelProps {
  bookId: string;
  currentState?: UserBookState;
  onSave: (state: UserBookState) => void;
  onClose: () => void;
}

export const BookShelfPanel: React.FC<BookShelfPanelProps> = ({
  bookId,
  currentState,
  onSave,
  onClose,
}) => {
  // 탭 상태 (읽고 있는 책 / 다 읽은 책)
  const [activeTab, setActiveTab] = useState<'READING' | 'READ'>(
    currentState?.state === 'READ' ? 'READ' : 'READING'
  );

  // 날짜 상태
  const [startDate, setStartDate] = useState<string>(
    currentState?.startDate
      ? new Date(currentState.startDate).toISOString().split('T')[0]
      : ''
  );
  const [endDate, setEndDate] = useState<string>(
    currentState?.endDate
      ? new Date(currentState.endDate).toISOString().split('T')[0]
      : ''
  );

  // 별점 상태
  const [rating, setRating] = useState<number>(currentState?.rating || 0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  // 기록 상태
  const [comment, setComment] = useState<string>(currentState?.comment || '');

  // 달력 표시 상태
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  // 현재 달력 월/년
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  // 저장 핸들러
  const handleSave = () => {
    const bookState: UserBookState = {
      bookId,
      state: activeTab,
      rating: rating > 0 ? rating : undefined,
      comment: comment.trim() || undefined,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      updatedAt: new Date().toISOString(),
      createdAt: currentState?.createdAt || new Date().toISOString(),
    };

    onSave(bookState);
  };

  // 달력 날짜 생성
  const generateCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: (number | null)[] = [];

    // 이전 달의 빈 칸
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // 현재 달의 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (day: number, type: 'start' | 'end') => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const date = new Date(year, month, day);
    const dateString = date.toISOString().split('T')[0];

    if (type === 'start') {
      setStartDate(dateString);
      setShowStartCalendar(false);
    } else {
      setEndDate(dateString);
      setShowEndCalendar(false);
    }
  };

  // 월 이동
  const changeMonth = (delta: number) => {
    setCalendarDate(
      new Date(calendarDate.getFullYear(), calendarDate.getMonth() + delta, 1)
    );
  };

  const calendar = generateCalendar();

  return (
    <div className="space-y-4">
      {/* 탭 */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('READING')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'READING'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          읽고 있는 책
        </button>
        <button
          onClick={() => setActiveTab('READ')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'READ'
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          다 읽은 책
        </button>
      </div>

      {/* 날짜 선택 */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={startDate ? new Date(startDate).toLocaleDateString('ko-KR') : ''}
              onClick={() => {
                setShowStartCalendar(!showStartCalendar);
                setShowEndCalendar(false);
              }}
              readOnly
              placeholder="시작일 선택"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              부터
            </span>
          </div>

          <span className="text-gray-400">~</span>

          <div className="relative flex-1">
            <input
              type="text"
              value={endDate ? new Date(endDate).toLocaleDateString('ko-KR') : ''}
              onClick={() => {
                setShowEndCalendar(!showEndCalendar);
                setShowStartCalendar(false);
              }}
              readOnly
              placeholder="종료일 선택"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              까지
            </span>
          </div>
        </div>

        {/* 달력 */}
        {(showStartCalendar || showEndCalendar) && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
            {/* 달력 헤더 */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => changeMonth(-1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ◀
              </button>
              <span className="text-sm font-medium">
                {calendarDate.getFullYear()}년 {calendarDate.getMonth() + 1}월
              </span>
              <button
                onClick={() => changeMonth(1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ▶
              </button>
            </div>

            {/* 요일 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                <div key={day} className="text-center text-xs text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* 날짜 */}
            <div className="grid grid-cols-7 gap-1">
              {calendar.map((day, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (day) {
                      handleDateSelect(day, showStartCalendar ? 'start' : 'end');
                    }
                  }}
                  disabled={!day}
                  className={`text-center text-sm py-2 rounded transition-colors ${
                    day
                      ? 'hover:bg-yellow-100 cursor-pointer'
                      : 'text-transparent cursor-default'
                  } ${
                    day === new Date().getDate() &&
                    calendarDate.getMonth() === new Date().getMonth() &&
                    calendarDate.getFullYear() === new Date().getFullYear()
                      ? 'bg-yellow-400 text-gray-900 font-bold'
                      : ''
                  }`}
                >
                  {day || ''}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 별점 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">별점</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-2xl transition-transform hover:scale-110 focus:outline-none"
            >
              {star <= (hoverRating || rating) ? (
                <span className="text-yellow-400">★</span>
              ) : (
                <span className="text-gray-300">☆</span>
              )}
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
          )}
        </div>
      </div>

      {/* 짧은 기록 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">짧은 기록</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="이 책에 대한 생각을 자유롭게 적어보세요..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
        />
        <p className="mt-1 text-xs text-gray-400 text-right">
          {comment.length} / 500자
        </p>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          취소
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-500 transition-colors"
        >
          저장
        </button>
      </div>
    </div>
  );
};
