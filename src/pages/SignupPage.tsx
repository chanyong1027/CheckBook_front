import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import type { Gender, AgeGroup } from '@/types/user';

// 회원가입 폼 스키마
const signupSchema = z
  .object({
    email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
    nickname: z
      .string()
      .min(2, '닉네임은 최소 2자 이상이어야 합니다.')
      .max(8, '닉네임은 최대 8자까지 가능합니다.'),
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
      .max(15, '비밀번호는 최대 15자까지 가능합니다.')
      .regex(/[A-Za-z]/, '비밀번호에는 영문자가 포함되어야 합니다.')
      .regex(/[0-9]/, '비밀번호에는 숫자가 포함되어야 합니다.')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, '비밀번호에는 특수기호가 포함되어야 합니다.'),
    passwordConfirm: z.string(),
    gender: z.string().optional(),
    ageGroup: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setErrorMessage('');

      // 🚧 임시: API 연동 전 Mock 회원가입
      // TODO: 백엔드 API 연동 시 아래 주석 해제하고 Mock 회원가입 제거
      /*
      await signup({
        userEmail: data.email,
        userNickname: data.nickname,
        userPw: data.password,
      });
      */

      // === Mock 회원가입 시작 (API 연동 전 임시 코드) ===
      console.log('🚧 Mock 회원가입 실행:', {
        email: data.email,
        nickname: data.nickname,
        gender: data.gender,
        ageGroup: data.ageGroup,
      });

      // 임시 대기 (서버 호출 시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock 사용자 데이터를 localStorage에 저장
      const existingUsers = JSON.parse(
        localStorage.getItem('checkbook_mock_users') || '{}'
      );
      existingUsers[data.email] = {
        email: data.email,
        nickname: data.nickname,
        gender: data.gender || undefined,
        ageGroup: data.ageGroup || undefined,
        password: data.password, // Mock용으로 비밀번호도 저장 (실제론 절대 이렇게 하면 안됨!)
      };
      localStorage.setItem('checkbook_mock_users', JSON.stringify(existingUsers));

      console.log('✅ Mock 회원가입 성공 및 localStorage 저장 완료');
      // === Mock 회원가입 끝 ===

      toast.success('회원가입 성공! 로그인해주세요.');

      // 회원가입 성공 시 로그인 페이지로 이동
      navigate('/login');
    } catch (error: any) {
      console.error('회원가입 실패:', error);

      const message = error?.message || '회원가입에 실패했습니다. 다시 시도해주세요.';
      setErrorMessage(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-accent/10 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* 로고 섹션 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Book📚</h1>
          <p className="text-gray-600">새로운 독서 여정을 시작하세요</p>
        </div>

        {/* 회원가입 카드 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">회원가입</h2>

          {/* 에러 메시지 */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* 닉네임 입력 */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                닉네임
              </label>
              <input
                id="nickname"
                type="text"
                {...register('nickname')}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.nickname ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                placeholder="닉네임을 입력하세요"
              />
              {errors.nickname && (
                <p className="mt-1 text-sm text-red-500">{errors.nickname.message}</p>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                placeholder="영문, 숫자, 특수기호 포함 8-15자"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* 비밀번호 확인 입력 */}
            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                비밀번호 확인
              </label>
              <input
                id="passwordConfirm"
                type="password"
                {...register('passwordConfirm')}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                placeholder="비밀번호를 다시 입력하세요"
              />
              {errors.passwordConfirm && (
                <p className="mt-1 text-sm text-red-500">{errors.passwordConfirm.message}</p>
              )}
            </div>

            {/* 성별 선택 (선택사항) */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                성별 <span className="text-gray-400 text-xs">(선택사항)</span>
              </label>
              <select
                id="gender"
                {...register('gender')}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
              >
                <option value="">선택안함</option>
                <option value="male">남자</option>
                <option value="female">여자</option>
              </select>
            </div>

            {/* 연령대 선택 (선택사항) */}
            <div>
              <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700 mb-2">
                연령대 <span className="text-gray-400 text-xs">(선택사항)</span>
              </label>
              <select
                id="ageGroup"
                {...register('ageGroup')}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
              >
                <option value="">선택안함</option>
                <option value="10대">10대</option>
                <option value="20대">20대</option>
                <option value="30대">30대</option>
                <option value="40대">40대</option>
                <option value="50대">50대</option>
                <option value="60대 이상">60대 이상</option>
              </select>
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '가입 중...' : '회원가입'}
            </button>
          </form>

          {/* 로그인 링크 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </div>

        {/* 홈으로 돌아가기 */}
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};
