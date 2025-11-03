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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 로고 및 설명 */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-1">📚 CheckBook</h3>
            <p className="text-xs text-gray-600">
              도서 검색부터 도서관 대출 확인까지, 편리한 독서 생활의 시작
            </p>
          </div>

          {/* 정보 */}
          <div className="flex items-center md:justify-end">
            <ul className="flex gap-4">
              <li>
                <a
                  href="#"
                  className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                >
                  서비스 소개
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                >
                  개인정보처리방침
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                >
                  이용약관
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 저작권 */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            © {currentYear} CheckBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
