/**
 * Footer 컴포넌트
 *
 * @description
 * - 애플리케이션 푸터
 * - 저작권, 링크, 소셜 미디어
 *
 * @example
 * <Footer />
 */

import * as React from 'react';

/**
 * Footer Props
 */
interface FooterProps {
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 푸터 컴포넌트
 */
export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-gray-50 border-t border-gray-200 mt-auto ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 로고 및 설명 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">📚 CheckBook</h3>
            <p className="text-sm text-gray-600">
              도서 검색부터 도서관 대출 확인까지,
              <br />
              편리한 독서 생활의 시작
            </p>
          </div>

          {/* 링크 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">바로가기</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  도서 검색
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  내 도서관
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  독서 기록
                </a>
              </li>
            </ul>
          </div>

          {/* 정보 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">정보</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  서비스 소개
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  개인정보처리방침
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  이용약관
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 저작권 */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © {currentYear} CheckBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
