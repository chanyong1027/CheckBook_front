/**
 * BookStateEditModal 컴포넌트
 *
 * @description
 * - 독서 상태 상세 정보 편집 모달
 * - 독서 상태, 별점, 메모/리뷰, 날짜 입력
 * - react-hook-form + zod 검증
 *
 * @example
 * <BookStateEditModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   bookId="book-123"
 *   currentState={bookState}
 *   onSave={(state) => handleSave(state)}
 * />
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ReadingState, UserBookState } from '@/types/user';
import { READING_STATE_LABELS } from '@/utils/constants';

/**
 * BookStateEditModal Props
 */
interface BookStateEditModalProps {
  /** 모달 열림 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 도서 ID */
  bookId: string;
  /** 현재 독서 상태 (편집 모드) */
  currentState?: UserBookState;
  /** 저장 핸들러 */
  onSave: (state: UserBookState) => void;
}

/**
 * 폼 데이터 스키마
 */
const bookStateSchema = z.object({
  state: z.enum(['WISHLIST', 'READING', 'READ'], {
    required_error: '독서 상태를 선택해주세요.',
  }),
  rating: z
    .number()
    .min(1, '별점은 최소 1점입니다.')
    .max(5, '별점은 최대 5점입니다.')
    .optional(),
  comment: z.string().max(500, '메모는 최대 500자까지 가능합니다.').optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type BookStateFormData = z.infer<typeof bookStateSchema>;

/**
 * 독서 상태 편집 모달 컴포넌트
 */
export const BookStateEditModal: React.FC<BookStateEditModalProps> = ({
  isOpen,
  onClose,
  bookId,
  currentState,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<BookStateFormData>({
    resolver: zodResolver(bookStateSchema),
    defaultValues: {
      state: currentState?.state || 'WISHLIST',
      rating: currentState?.rating,
      comment: currentState?.comment || '',
      startDate: currentState?.startDate
        ? new Date(currentState.startDate).toISOString().split('T')[0]
        : '',
      endDate: currentState?.endDate
        ? new Date(currentState.endDate).toISOString().split('T')[0]
        : '',
    },
  });

  // 별점 상태
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);
  const currentRating = watch('rating');

  // 모달 열릴 때 폼 초기화
  useEffect(() => {
    if (isOpen) {
      reset({
        state: currentState?.state || 'WISHLIST',
        rating: currentState?.rating,
        comment: currentState?.comment || '',
        startDate: currentState?.startDate
          ? new Date(currentState.startDate).toISOString().split('T')[0]
          : '',
        endDate: currentState?.endDate
          ? new Date(currentState.endDate).toISOString().split('T')[0]
          : '',
      });
    }
  }, [isOpen, currentState, reset]);

  // 모달이 닫혀있으면 렌더링 안함
  if (!isOpen) return null;

  const onSubmit = async (data: BookStateFormData) => {
    try {
      const bookState: UserBookState = {
        bookId,
        state: data.state,
        rating: data.rating,
        comment: data.comment || undefined,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
        updatedAt: new Date().toISOString(),
        createdAt: currentState?.createdAt || new Date().toISOString(),
      };

      onSave(bookState);
    } catch (error) {
      console.error('독서 상태 저장 실패:', error);
    }
  };

  // 별점 클릭 핸들러
  const handleRatingClick = (rating: number) => {
    setValue('rating', rating, { shouldValidate: true });
  };

  // 모달 배경 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">독서 상태 수정</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 모달 본문 */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* 독서 상태 선택 */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              독서 상태
            </label>
            <select
              id="state"
              {...register('state')}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
            >
              <option value="WISHLIST">{READING_STATE_LABELS.WISHLIST}</option>
              <option value="READING">{READING_STATE_LABELS.READING}</option>
              <option value="READ">{READING_STATE_LABELS.READ}</option>
            </select>
            {errors.state && (
              <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>
            )}
          </div>

          {/* 별점 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              별점 <span className="text-gray-400 text-xs">(선택사항)</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => {
                const isFilled =
                  hoverRating !== null ? rating <= hoverRating : rating <= (currentRating || 0);
                return (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingClick(rating)}
                    onMouseEnter={() => setHoverRating(rating)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                    aria-label={`${rating}점`}
                  >
                    {isFilled ? '★' : '☆'}
                  </button>
                );
              })}
              {currentRating && (
                <span className="ml-2 text-sm text-gray-600">({currentRating}/5)</span>
              )}
            </div>
            {errors.rating && (
              <p className="mt-1 text-sm text-red-500">{errors.rating.message}</p>
            )}
          </div>

          {/* 시작일 */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              시작일 <span className="text-gray-400 text-xs">(선택사항)</span>
            </label>
            <input
              id="startDate"
              type="date"
              {...register('startDate')}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>

          {/* 완료일 */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              완료일 <span className="text-gray-400 text-xs">(선택사항)</span>
            </label>
            <input
              id="endDate"
              type="date"
              {...register('endDate')}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-500">{errors.endDate.message}</p>
            )}
          </div>

          {/* 메모/리뷰 */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              메모/리뷰 <span className="text-gray-400 text-xs">(선택사항, 최대 500자)</span>
            </label>
            <textarea
              id="comment"
              {...register('comment')}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              placeholder="이 책에 대한 생각을 자유롭게 적어보세요..."
            />
            {errors.comment && (
              <p className="mt-1 text-sm text-red-500">{errors.comment.message}</p>
            )}
          </div>

          {/* 버튼 그룹 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-medium bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 text-sm font-medium bg-primary text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
