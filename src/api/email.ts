import { api } from './index';

/**
 * 이메일 인증코드 전송
 * @param email 인증할 이메일 주소
 */
export const sendVerificationCode = async (email: string): Promise<{ message: string }> => {
  const response = await api.post('/api/email/send-verification', { email });
  return response.data;
};

/**
 * 이메일 인증코드 검증
 * @param email 이메일 주소
 * @param code 인증코드
 */
export const verifyEmailCode = async (
  email: string,
  code: string
): Promise<{ verified: boolean; message: string }> => {
  const response = await api.post('/api/email/verify-code', { email, code });
  return response.data;
};
