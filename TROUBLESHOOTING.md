# CheckBook 프로젝트 문제 해결 가이드

## 세션 1: 환경 설정 문제 해결

이 문서는 CheckBook 프로젝트의 세션 1 (환경 설정) 과정에서 발생할 수 있는 문제와 해결 방법을 정리한 것입니다.

---

## 목차
1. [pnpm 관련 문제](#1-pnpm-관련-문제)
2. [TypeScript 에러](#2-typescript-에러)
3. [Vite 서버 문제](#3-vite-서버-문제)
4. [Tailwind CSS 문제](#4-tailwind-css-문제)
5. [경로 Alias 문제](#5-경로-alias-문제)
6. [환경 변수 문제](#6-환경-변수-문제)

---

## 1. pnpm 관련 문제

### 문제: pnpm 명령어를 찾을 수 없음
```bash
pnpm: command not found
```

**해결 방법:**
```bash
# Node.js 20 이상 설치 확인
node --version

# pnpm 전역 설치
npm install -g pnpm

# 설치 확인
pnpm --version
```

---

### 문제: pnpm install 실패 (EACCES 권한 에러)
```bash
Error: EACCES: permission denied
```

**해결 방법:**
```bash
# 캐시 정리
pnpm store prune

# 재시도
pnpm install

# 여전히 실패하면
sudo pnpm install  # Linux/Mac
```

---

### 문제: 의존성 버전 충돌
```bash
WARN Issues with peer dependencies found
```

**해결 방법:**
```bash
# package.json에서 충돌하는 패키지 버전 확인
# 필요시 --force 옵션 사용
pnpm install --force

# 또는 특정 패키지만 재설치
pnpm remove <패키지명>
pnpm add <패키지명>@<버전>
```

---

## 2. TypeScript 에러

### 문제: Cannot find module '@/*' 에러
```typescript
Cannot find module '@/types/book' or its corresponding type declarations.
```

**해결 방법:**

1. `tsconfig.json` 확인:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. VSCode 재시작:
   - `Ctrl + Shift + P` → "TypeScript: Restart TS Server"

3. node_modules 재설치:
```bash
rm -rf node_modules
pnpm install
```

---

### 문제: Strict mode 타입 에러
```typescript
Object is possibly 'null' or 'undefined'
```

**해결 방법:**

1. Non-null assertion 사용 (확실한 경우만):
```typescript
const root = document.getElementById('root')!;
```

2. Optional chaining 사용:
```typescript
const element = document.getElementById('root')?.textContent;
```

3. 타입 가드 사용:
```typescript
const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(<App />);
}
```

---

### 문제: tsconfig.node.json 관련 에러
```bash
File 'tsconfig.node.json' not found
```

**해결 방법:**

`tsconfig.node.json` 파일 생성:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

---

## 3. Vite 서버 문제

### 문제: 포트 5173이 이미 사용 중
```bash
Port 5173 is in use, trying another one...
```

**해결 방법:**

1. 기존 프로세스 종료:
```bash
# Linux/Mac
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID번호> /F
```

2. vite.config.ts에서 포트 변경:
```typescript
export default defineConfig({
  server: {
    port: 3000,  // 원하는 포트로 변경
  },
});
```

---

### 문제: Vite 서버가 느리게 시작됨
```bash
VITE ready in 30000 ms  (너무 느림)
```

**해결 방법:**

1. `.vite` 캐시 삭제:
```bash
rm -rf node_modules/.vite
```

2. 의존성 사전 번들링 비활성화 (개발 중):
```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    exclude: ['some-heavy-package'],
  },
});
```

3. WSL 환경이라면 Windows 파일 시스템 대신 Linux 파일 시스템 사용

---

### 문제: HMR (Hot Module Replacement) 작동 안 함
**증상:** 파일 변경 후 브라우저가 자동으로 갱신되지 않음

**해결 방법:**

1. vite.config.ts에 HMR 설정 추가:
```typescript
export default defineConfig({
  server: {
    watch: {
      usePolling: true,  // WSL 환경에서 필요
    },
  },
});
```

2. 브라우저 캐시 삭제 (Ctrl + Shift + R)

---

## 4. Tailwind CSS 문제

### 문제: Tailwind 클래스가 적용되지 않음
**증상:** 클래스를 추가해도 스타일이 반영되지 않음

**해결 방법:**

1. `tailwind.config.js`의 content 경로 확인:
```javascript
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',  // 모든 소스 파일 포함
  ],
  // ...
};
```

2. `src/index.css`에 Tailwind 지시문 확인:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

3. `src/main.tsx`에서 CSS import 확인:
```typescript
import './index.css';
```

4. 개발 서버 재시작:
```bash
# Ctrl + C로 서버 종료 후
pnpm dev
```

---

### 문제: 커스텀 색상이 적용되지 않음
```jsx
<div className="bg-primary">  {/* 작동 안 함 */}
```

**해결 방법:**

`tailwind.config.js` 확인:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#3563E9',  // 올바르게 정의되었는지 확인
    },
  },
},
```

---

### 문제: Pretendard 폰트가 로드되지 않음
**증상:** 기본 폰트가 표시됨

**해결 방법:**

1. `index.html`에서 폰트 링크 확인:
```html
<link
  rel="stylesheet"
  as="style"
  crossorigin
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
/>
```

2. 네트워크 탭에서 폰트 로드 확인 (F12 개발자 도구)

3. CDN 문제라면 로컬 폰트 파일 사용:
```bash
pnpm add @fontsource/pretendard
```

```typescript
// src/main.tsx
import '@fontsource/pretendard';
```

---

## 5. 경로 Alias 문제

### 문제: @/* import가 작동하지 않음
```typescript
import { Book } from '@/types/book';  // 에러 발생
```

**해결 방법:**

1. `vite.config.ts` 확인:
```typescript
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

2. `tsconfig.json` 확인:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

3. VSCode TypeScript 서버 재시작

4. 절대 경로 대신 상대 경로로 임시 해결:
```typescript
import { Book } from '../types/book';  // 임시 방편
```

---

## 6. 환경 변수 문제

### 문제: import.meta.env.VITE_API_BASE_URL이 undefined
```typescript
console.log(import.meta.env.VITE_API_BASE_URL);  // undefined
```

**해결 방법:**

1. `.env.local` 파일 확인:
```env
VITE_API_BASE_URL=http://localhost:8080
```

2. 환경 변수 이름 확인:
   - 반드시 `VITE_` 접두사로 시작해야 함
   - 대소문자 구분

3. 개발 서버 재시작 (환경 변수 변경 시 필수):
```bash
# Ctrl + C로 서버 종료 후
pnpm dev
```

4. TypeScript 타입 정의 추가 (선택사항):
```typescript
// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

### 문제: .env.production이 개발 중에 로드됨
**증상:** 배포용 API URL이 개발 중에 사용됨

**해결 방법:**

1. `.env.local`이 `.env.production`보다 우선순위가 높음을 확인

2. 파일명 정확히 확인:
   - 개발: `.env.local` (또는 `.env.development`)
   - 배포: `.env.production`

3. Vite의 환경 변수 우선순위:
   - `.env.local` > `.env.development` > `.env`

---

## 7. 기타 일반적인 문제

### 문제: 브라우저에서 빈 화면만 표시됨
**증상:** http://localhost:5173/ 접속 시 아무것도 표시되지 않음

**해결 방법:**

1. 브라우저 콘솔 확인 (F12):
   - JavaScript 에러 확인
   - 네트워크 에러 확인

2. `index.html`에서 root 엘리먼트 확인:
```html
<div id="root"></div>
```

3. `src/main.tsx` 확인:
```typescript
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

4. React DevTools 설치 및 확인

---

### 문제: WSL2 환경에서 Windows 브라우저에 접속 불가
**증상:** localhost:5173에 접속할 수 없음

**해결 방법:**

1. WSL2 IP 주소 확인:
```bash
ip addr show eth0 | grep inet
```

2. Windows에서 `http://<WSL2_IP>:5173/` 접속

3. 또는 vite.config.ts에서 host 설정:
```typescript
export default defineConfig({
  server: {
    host: '0.0.0.0',  // 모든 네트워크 인터페이스에서 접근 허용
  },
});
```

---

### 문제: Git에 node_modules나 .env가 커밋됨
**해결 방법:**

1. `.gitignore` 파일 생성/확인:
```gitignore
# dependencies
node_modules/
.pnpm-store/

# environment variables
.env
.env.local
.env.production

# build output
dist/
.vite/

# editor
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

2. 이미 커밋된 파일 제거:
```bash
git rm -r --cached node_modules
git rm --cached .env.local
git commit -m "Remove ignored files"
```

---

## 세션 1에서 발생한 실제 문제

### 실제 발생한 문제: 없음 ✅

세션 1 실행 과정에서 특별한 문제가 발생하지 않았습니다.
모든 설정이 정상적으로 완료되었습니다.

---

## 추가 도움말

### 유용한 디버깅 명령어

```bash
# TypeScript 타입 체크
pnpm tsc --noEmit

# 린트 실행
pnpm lint

# 의존성 트리 확인
pnpm list

# 캐시 정리
pnpm store prune

# 전체 재설치
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 개발자 도구 활용
- **React DevTools:** React 컴포넌트 트리 확인
- **React Query DevTools:** 쿼리 상태 및 캐시 확인
- **Network 탭:** API 요청/응답 확인
- **Console 탭:** 에러 메시지 확인

---

## 다음 세션 준비

세션 2 (타입 & 상수 정의)로 넘어가기 전 체크리스트:

- [ ] `pnpm dev` 정상 실행
- [ ] `pnpm tsc --noEmit` 에러 없음
- [ ] http://localhost:5173/ 접속 가능
- [ ] Tailwind CSS 스타일 적용 확인
- [ ] React Query DevTools 표시됨
- [ ] 브라우저 콘솔에 에러 없음

---

**작성자:** Claude Code
**최종 수정:** 2025-10-21
**버전:** 1.0
