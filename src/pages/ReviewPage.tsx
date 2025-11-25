/**
 * ReviewPage 컴포넌트
 *
 * @description
 * - 내 리뷰 페이지
 * - 읽고 있는 책 / 다 읽은 책 탭 구분
 * - 책 정보 + 리뷰 작성 공간
 * - 페이지네이션 (10개씩)
 */

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { useUserBookStates } from '@/hooks/useUserBookState';
import { updateBookReview, deleteUserBookState } from '@/api/user';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { UserBookState } from '@/types/user';

export const ReviewPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'READING' | 'READ'>('READ');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // 인증 체크
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  // 백엔드에서 독서 기록 가져오기
  const { bookStates: allBookStates, isLoading, refetch } = useUserBookStates();

  // 상태별 필터링
  const readingBooks = useMemo(
    () => allBookStates.filter((item) => item.state === 'READING'),
    [allBookStates]
  );

  const readBooks = useMemo(
    () => allBookStates.filter((item) => item.state === 'READ'),
    [allBookStates]
  );

  // 현재 탭의 책 목록
  const currentBooks = activeTab === 'READING' ? readingBooks : readBooks;

  // 페이지네이션
  const totalPages = Math.ceil(currentBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBooks = currentBooks.slice(startIndex, endIndex);

  // 탭 변경 시 페이지 초기화
  const handleTabChange = (tab: 'READING' | 'READ') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // 리뷰 저장 (백엔드 연동)
  const handleSaveReview = async (bookState: UserBookState, newComment: string, rating?: number) => {
    if (!bookState.recordId) {
      toast.error('리뷰를 저장할 수 없습니다. recordId가 없습니다.');
      return;
    }

    try {
      await updateBookReview(bookState.recordId, newComment, rating);
      toast.success('리뷰가 저장되었습니다!');
      // 데이터 다시 가져오기
      refetch();
    } catch (error) {
      console.error('Failed to save review:', error);
      toast.error('리뷰 저장에 실패했습니다.');
    }
  };

  // 독서 기록 삭제 (백엔드 연동)
  const handleDeleteRecord = async (bookState: UserBookState) => {
    if (!bookState.recordId) {
      toast.error('삭제할 수 없습니다. recordId가 없습니다.');
      return;
    }

    // 확인 메시지
    if (!window.confirm(`"${bookState.bookTitle || '이 책'}"을(를) 내 도서관에서 삭제하시겠습니까?\n리뷰와 독서 기록이 모두 삭제됩니다.`)) {
      return;
    }

    try {
      await deleteUserBookState(bookState.recordId);
      toast.success('독서 기록이 삭제되었습니다.');
      // 데이터 다시 가져오기
      refetch();
    } catch (error) {
      console.error('Failed to delete record:', error);
      toast.error('삭제에 실패했습니다.');
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <LoadingSpinner size="lg" label="리뷰 목록을 불러오는 중..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">내 리뷰</h1>
          <p className="text-sm text-gray-600">
            읽은 책과 읽고 있는 책에 대한 리뷰를 작성해보세요
          </p>
        </div>

        {/* 탭 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => handleTabChange('READ')}
            className={`
              px-6 py-3 rounded-xl text-sm font-medium transition-colors
              ${
                activeTab === 'READ'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            다 읽은 책 ({readBooks.length})
          </button>
          <button
            onClick={() => handleTabChange('READING')}
            className={`
              px-6 py-3 rounded-xl text-sm font-medium transition-colors
              ${
                activeTab === 'READING'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            읽고 있는 책 ({readingBooks.length})
          </button>
        </div>

        {/* 리뷰 목록 */}
        {paginatedBooks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {activeTab === 'READ' ? '완독한 책이 없습니다' : '읽고 있는 책이 없습니다'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              책을 추가하고 리뷰를 작성해보세요!
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-primary text-white rounded-xl hover:opacity-90 transition-all"
            >
              책 검색하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedBooks.map((bookState) => {
              return (
                <ReviewCard
                  key={bookState.bookId}
                  bookState={bookState}
                  onSave={handleSaveReview}
                  onDelete={handleDeleteRecord}
                  onViewDetail={() => navigate(`/book/${bookState.bookId}`)}
                />
              );
            })}
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="
                px-4 py-2 rounded-xl text-sm font-medium
                bg-white text-gray-700 border border-gray-300
                hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              "
            >
              이전
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-colors
                  ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="
                px-4 py-2 rounded-xl text-sm font-medium
                bg-white text-gray-700 border border-gray-300
                hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              "
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ReviewCard 컴포넌트
 */
interface ReviewCardProps {
  bookState: UserBookState;
  onSave: (bookState: UserBookState, comment: string, rating?: number) => void;
  onDelete: (bookState: UserBookState) => void;
  onViewDetail: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ bookState, onSave, onDelete, onViewDetail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState(bookState.comment || '');
  const [rating, setRating] = useState(bookState.rating || 0);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(bookState, comment, rating);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setComment(bookState.comment || '');
    setRating(bookState.rating || 0);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-6">
        {/* 책 정보 (왼쪽) */}
        <div className="flex-shrink-0 w-32">
          <div className="aspect-[2/3] rounded-lg overflow-hidden mb-3 cursor-pointer" onClick={onViewDetail}>
            {bookState.bookCover ? (
              <img
                src={bookState.bookCover}
                alt={bookState.bookTitle || '책 표지'}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
          </div>
          <h3
            className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 cursor-pointer hover:text-primary"
            onClick={onViewDetail}
          >
            {bookState.bookTitle || `도서 #${bookState.bookId}`}
          </h3>
          <p className="text-xs text-gray-500">{bookState.bookAuthor || '저자 미상'}</p>

          {/* 별점 */}
          {bookState.rating && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-yellow-400 text-sm">{'★'.repeat(bookState.rating)}</span>
              <span className="text-xs text-gray-500">{bookState.rating}.0</span>
            </div>
          )}

          {/* 읽은 날짜 */}
          {bookState.endDate && (
            <p className="text-xs text-gray-400 mt-2">
              완독일: {new Date(bookState.endDate).toLocaleDateString('ko-KR')}
            </p>
          )}
        </div>

        {/* 리뷰 영역 (오른쪽) */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base font-semibold text-gray-900">나의 리뷰</h4>
            {!isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-primary hover:text-blue-600 font-medium"
                >
                  {bookState.comment ? '수정' : '작성'}
                </button>
                <button
                  onClick={() => onDelete(bookState)}
                  className="text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div>
              {/* 별점 선택 */}
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 mb-2 block">평점</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-2xl focus:outline-none hover:scale-110 transition-transform"
                    >
                      <span className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{rating > 0 ? `${rating}.0` : '선택 안 함'}</span>
                </div>
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="이 책에 대한 생각을 자유롭게 작성해보세요..."
                className="
                  w-full h-40 px-4 py-3 border border-gray-300 rounded-xl
                  focus:ring-2 focus:ring-blue-400 focus:border-transparent
                  resize-none text-sm
                "
                maxLength={1000}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">{comment.length}/1000자</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {isSaving ? '저장 중...' : '저장'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {bookState.comment ? (
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {bookState.comment}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  아직 리뷰를 작성하지 않았습니다. 이 책에 대한 생각을 기록해보세요!
                </p>
              )}
              {bookState.updatedAt && bookState.comment && (
                <p className="text-xs text-gray-400 mt-3">
                  마지막 수정: {new Date(bookState.updatedAt).toLocaleString('ko-KR')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
