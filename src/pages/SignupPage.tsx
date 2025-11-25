import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { sendVerificationCode, verifyEmailCode } from '@/api/email';
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

  // 이메일 인증 상태
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [verificationSent, setVerificationSent] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [sendingCode, setSendingCode] = useState<boolean>(false);
  const [verifyingCode, setVerifyingCode] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const emailValue = watch('email');

  // 인증코드 전송
  const handleSendVerificationCode = async () => {
    if (!emailValue || errors.email) {
      toast.error('올바른 이메일을 입력해주세요.');
      return;
    }

    try {
      setSendingCode(true);
      await sendVerificationCode(emailValue);
      setVerificationSent(true);
      toast.success('인증코드가 전송되었습니다. 이메일을 확인해주세요.');
    } catch (error: any) {
      console.error('인증코드 전송 실패:', error);
      toast.error(error?.response?.data?.message || '인증코드 전송에 실패했습니다.');
    } finally {
      setSendingCode(false);
    }
  };

  // 인증코드 검증
  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('6자리 인증코드를 입력해주세요.');
      return;
    }

    try {
      setVerifyingCode(true);
      const result = await verifyEmailCode(emailValue, verificationCode);

      if (result.verified) {
        setEmailVerified(true);
        toast.success('이메일 인증이 완료되었습니다!');
      } else {
        toast.error(result.message || '인증코드가 일치하지 않습니다.');
      }
    } catch (error: any) {
      console.error('인증코드 검증 실패:', error);
      toast.error(error?.response?.data?.message || '인증 처리 중 오류가 발생했습니다.');
    } finally {
      setVerifyingCode(false);
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      setErrorMessage('');

      // 이메일 인증 확인
      if (!emailVerified) {
        toast.error('이메일 인증을 완료해주세요.');
        return;
      }

      // 실제 API 호출 (빈 문자열은 undefined로 변환)
      await signup({
        userEmail: data.email,
        userNm: data.nickname,
        userPw: data.password,
        gender: data.gender && data.gender !== '' ? (data.gender as Gender) : undefined,
        ageGroup: data.ageGroup && data.ageGroup !== '' ? (data.ageGroup as AgeGroup) : undefined,
      });

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CheckBook📚</h1>
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
            {/* 이메일 입력 + 인증 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <div className="flex gap-2">
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled={emailVerified}
                  className={`flex-1 px-4 py-3 rounded-xl border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:bg-gray-100`}
                  placeholder="example@email.com"
                />
                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  disabled={sendingCode || emailVerified || !emailValue || !!errors.email}
                  className="px-4 py-3 bg-primary text-white rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {emailVerified ? '✓ 인증완료' : sendingCode ? '전송중...' : '인증하기'}
                </button>
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}

              {/* 인증코드 입력 필드 (인증코드 전송 후 표시) */}
              {verificationSent && !emailVerified && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="6자리 인증코드 입력"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={verifyingCode || verificationCode.length !== 6}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {verifyingCode ? '확인중...' : '확인'}
                  </button>
                </div>
              )}

              {/* 인증 완료 메시지 */}
              {emailVerified && (
                <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>이메일 인증이 완료되었습니다</span>
                </div>
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
                <option value="MALE">남자</option>
                <option value="FEMALE">여자</option>
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
                <option value="TEENS">10대</option>
                <option value="TWENTIES">20대</option>
                <option value="THIRTIES">30대</option>
                <option value="FORTIES">40대</option>
                <option value="FIFTIES">50대</option>
                <option value="SIXTIES_PLUS">60대 이상</option>
              </select>
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting || !emailVerified}
              className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '가입 중...' : '회원가입'}
            </button>

            {/* 이메일 인증 안내 메시지 */}
            {!emailVerified && (
              <p className="text-xs text-center text-gray-500">
                회원가입을 위해 먼저 이메일 인증을 완료해주세요.
              </p>
            )}
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
