# 모바일 Word 문서 뷰어 개발 명세서

> **목적**: 이 문서는 AI 코딩 에이전트(Qwen3-Coder)에게 모바일 환경에서 사용 가능한 Word(.docx) 뷰어를 설계·구현·패키징하도록 지시하기 위한 전체 명세서입니다.

---

## 1. 프로젝트 개요

### 1.1 목표
- `.docx` 파일을 모바일 브라우저 및 네이티브 앱 환경에서 열람할 수 있는 뷰어 개발
- 서버 의존 없이 **클라이언트 사이드에서 완전히 동작**하는 오프라인 지원 뷰어
- 최종적으로 Android/iOS 앱(APK/IPA)으로 패키징

### 1.2 기술 스택 (권장)

| 계층 | 기술 | 선택 이유 |
|------|------|-----------|
| UI 프레임워크 | React 18+ with TypeScript | 컴포넌트 기반, 생태계 풍부 |
| 빌드 도구 | Vite | 빠른 HMR, 가벼운 번들 |
| docx 파싱 | mammoth.js + JSZip | docx→HTML 변환 검증된 라이브러리 |
| 스타일링 | Tailwind CSS | 모바일 반응형 유틸리티 |
| 앱 패키징 | Capacitor (Ionic) | 웹→네이티브 브리지, 플러그인 생태계 |
| 파일 접근 | Capacitor Filesystem + File Picker | 네이티브 파일 선택 및 읽기 |

### 1.3 지원 범위

**필수 지원 (MVP)**:
- 텍스트 콘텐츠 렌더링 (제목, 본문, 리스트)
- 기본 서식 (굵게, 기울임, 밑줄, 글자 색상, 글자 크기)
- 표(Table) 렌더링
- 이미지 표시 (내장 이미지)
- 페이지 스크롤 및 핀치 줌

**선택 지원 (Phase 2)**:
- 머리글/바닥글
- 각주/미주
- 목차(TOC) 네비게이션
- 다크 모드
- 최근 파일 목록
- 파일 공유(Share Intent) 수신

---

## 2. 프로젝트 구조

```
mobile-word-viewer/
├── src/
│   ├── main.tsx                  # 앱 엔트리포인트
│   ├── App.tsx                   # 라우팅 및 레이아웃
│   ├── components/
│   │   ├── FileSelector.tsx      # 파일 선택 UI
│   │   ├── DocxRenderer.tsx      # docx 파싱 및 렌더링 핵심 컴포넌트
│   │   ├── DocumentView.tsx      # 렌더링된 HTML 표시 영역
│   │   ├── Toolbar.tsx           # 상단 툴바 (파일명, 줌, 설정)
│   │   ├── LoadingSpinner.tsx    # 로딩 인디케이터
│   │   └── ErrorBoundary.tsx     # 에러 핸들링
│   ├── hooks/
│   │   ├── useDocxParser.ts      # docx 파싱 커스텀 훅
│   │   ├── useFileAccess.ts      # 파일 접근 추상화 (웹/네이티브)
│   │   └── useZoomControl.ts     # 핀치 줌 / 버튼 줌
│   ├── utils/
│   │   ├── docxToHtml.ts         # mammoth.js 래퍼 + 커스텀 스타일 매핑
│   │   ├── imageExtractor.ts     # docx 내장 이미지 추출 (base64)
│   │   └── fileHelper.ts         # ArrayBuffer 변환 유틸
│   ├── styles/
│   │   ├── document.css          # 렌더링된 문서 전용 스타일
│   │   └── index.css             # 글로벌 스타일 + Tailwind
│   └── types/
│       └── index.ts              # TypeScript 타입 정의
├── public/
│   └── sample.docx               # 테스트용 샘플 파일
├── android/                       # Capacitor Android 프로젝트 (자동 생성)
├── ios/                           # Capacitor iOS 프로젝트 (자동 생성)
├── capacitor.config.ts            # Capacitor 설정
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 3. 개발 단계별 상세 지시

### Phase 1: 프로젝트 초기화 및 웹 뷰어 기본 구현

#### Step 1-1: 프로젝트 스캐폴딩

```bash
npm create vite@latest mobile-word-viewer -- --template react-ts
cd mobile-word-viewer
npm install
npm install mammoth jszip
npm install -D tailwindcss @tailwindcss/vite
```

#### Step 1-2: docx 파싱 엔진 구현

`useDocxParser.ts` 훅의 핵심 로직:

```typescript
// 이 구조를 참고하여 구현할 것
interface DocxParseResult {
  html: string;           // 변환된 HTML
  messages: string[];     // 변환 경고 메시지
  images: Map<string, string>; // 이미지 경로 → base64 매핑
  metadata: {
    title?: string;
    author?: string;
    pageCount?: number;
  };
}

// mammoth.js의 convertToHtml을 사용하되, 다음 옵션을 반드시 설정:
// 1. styleMap: 커스텀 스타일 매핑 (한글 스타일명 포함)
// 2. convertImage: 내장 이미지를 base64 data URI로 변환
// 3. ignoreEmptyParagraphs: false (레이아웃 유지)
```

**mammoth.js 커스텀 스타일 매핑 예시** (한글 문서 호환):

```typescript
const styleMap = [
  "p[style-name='제목 1'] => h1:fresh",
  "p[style-name='제목 2'] => h2:fresh",
  "p[style-name='제목 3'] => h3:fresh",
  "p[style-name='Heading 1'] => h1:fresh",
  "p[style-name='Heading 2'] => h2:fresh",
  "p[style-name='본문'] => p:fresh",
  "p[style-name='Normal'] => p:fresh",
  "r[style-name='강조'] => em",
  "r[style-name='Strong'] => strong",
  "p[style-name='List Paragraph'] => li:fresh",
];
```

#### Step 1-3: 문서 렌더링 컴포넌트

`DocumentView.tsx` 구현 시 필수 고려사항:

```
[필수 요구사항]
1. dangerouslySetInnerHTML 사용 시 DOMPurify로 HTML 새니타이징 적용
2. 렌더링된 HTML에 문서 전용 CSS 스코프 적용 (.doc-content 래퍼)
3. 이미지는 max-width: 100%로 모바일 뷰포트에 맞춤
4. 표(table)는 overflow-x: auto 래퍼로 가로 스크롤 지원
5. 폰트 크기는 rem 단위, 기본 16px 기준
```

**문서 전용 CSS (`document.css`) 핵심 규칙**:

```css
.doc-content {
  padding: 16px;
  line-height: 1.8;
  word-break: keep-all;        /* 한글 줄바꿈 */
  overflow-wrap: break-word;
}

.doc-content table {
  border-collapse: collapse;
  width: 100%;
  font-size: 0.875rem;
}

.doc-content table td,
.doc-content table th {
  border: 1px solid #d1d5db;
  padding: 8px;
  text-align: left;
}

.doc-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 8px 0;
}

/* 핀치 줌 지원 */
.doc-content-wrapper {
  touch-action: pan-x pan-y pinch-zoom;
  transform-origin: top left;
}
```

#### Step 1-4: 파일 선택기 구현

```
[구현 요구사항]
- 웹 환경: <input type="file" accept=".docx"> 사용
- 드래그 앤 드롭 지원 (onDragOver, onDrop 이벤트)
- 파일 유효성 검증:
  - MIME 타입: application/vnd.openxmlformats-officedocument.wordprocessingml.document
  - 파일 크기 제한: 50MB
  - ZIP 매직 바이트 검증 (PK 헤더, 0x504B)
- 로딩 상태 표시 (대용량 파일 파싱 시)
- 에러 시 사용자 친화적 메시지 표시
```

---

### Phase 2: 모바일 UX 최적화

#### Step 2-1: 반응형 레이아웃

```
[구현 요구사항]
1. 뷰포트 메타 태그 확인:
   <meta name="viewport" content="width=device-width, initial-scale=1.0, 
         maximum-scale=5.0, user-scalable=yes">

2. 레이아웃 구성:
   - 상단 고정 툴바 (48px 높이): 파일명 + 줌 컨트롤 + 메뉴
   - 나머지 영역: 문서 콘텐츠 (스크롤 가능)
   - 하단: 선택적 네비게이션 바

3. Safe Area 대응 (노치/홀 디스플레이):
   env(safe-area-inset-top), env(safe-area-inset-bottom) 적용

4. 세로/가로 모드 모두 지원
```

#### Step 2-2: 줌 기능

```
[구현 요구사항]
- 핀치 줌: touch 이벤트 기반, 50%~300% 범위
- 버튼 줌: 툴바에 +/- 버튼, 10% 단위 조절
- 더블 탭: 100% ↔ 적합한 너비(fit-width) 토글
- 줌 레벨 표시 (예: "120%")
- 줌 시 스크롤 위치 유지 (현재 보고 있는 영역 기준)
```

#### Step 2-3: 성능 최적화

```
[필수 적용 사항]
1. 대용량 문서(10MB+)는 Web Worker에서 파싱 처리
   - worker 파일: src/workers/docxParseWorker.ts
   - postMessage로 ArrayBuffer 전달 (Transferable)
   - 파싱 진행률 콜백 전달

2. 렌더링 최적화:
   - 긴 문서는 가상 스크롤 또는 섹션 단위 Lazy 렌더링 적용
   - IntersectionObserver로 뷰포트 밖 이미지 lazy load
   - 이미지는 ObjectURL 생성 후 컴포넌트 언마운트 시 revoke

3. 메모리 관리:
   - 파일 교체 시 이전 ObjectURL 및 파싱 결과 정리
   - ArrayBuffer는 파싱 완료 후 참조 해제
```

---

### Phase 3: 네이티브 앱 패키징 (Capacitor)

#### Step 3-1: Capacitor 설정

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Word Viewer" "com.example.wordviewer"
npm install @capacitor/android @capacitor/ios
npm install @capacitor/filesystem @capacitor/share
npm install @nicecode/docx-preview  # 대안 라이브러리 (필요 시)
```

`capacitor.config.ts`:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.wordviewer',
  appName: 'Word Viewer',
  webDir: 'dist',
  server: {
    androidScheme: 'https'   // Mixed Content 방지
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false,
    },
  },
  android: {
    allowMixedContent: false,
    minWebViewVersion: 60,
  }
};

export default config;
```

#### Step 3-2: 네이티브 파일 접근 추상화

`useFileAccess.ts` — 웹과 네이티브 환경을 통합하는 추상화 레이어:

```typescript
// 이 인터페이스를 구현할 것
interface FileAccessResult {
  data: ArrayBuffer;
  fileName: string;
  fileSize: number;
}

// 구현 로직:
// 1. Capacitor.isNativePlatform() 으로 환경 판별
// 2. 네이티브: @capacitor/filesystem의 readFile() 사용
// 3. 웹: <input type="file"> + FileReader 사용
// 4. 공통: 결과를 FileAccessResult로 통일
```

#### Step 3-3: Android 빌드 설정

```
[빌드 절차]
1. npm run build                    # Vite 빌드 (dist/ 생성)
2. npx cap sync android             # 웹 자산을 Android 프로젝트에 동기화
3. npx cap open android              # Android Studio에서 프로젝트 열기

[AndroidManifest.xml 추가 설정]
- 파일 읽기 권한:
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" 
                   android:maxSdkVersion="32"/>
  <uses-permission android:name="android.permission.READ_MEDIA_DOCUMENTS"/>  <!-- API 33+ -->
  
- Share Intent 수신 (docx 파일 열기):
  <intent-filter>
    <action android:name="android.intent.action.VIEW"/>
    <category android:name="android.intent.category.DEFAULT"/>
    <data android:mimeType="application/vnd.openxmlformats-officedocument.wordprocessingml.document"/>
  </intent-filter>

[build.gradle 설정]
- minSdkVersion: 24
- targetSdkVersion: 34
- compileSdkVersion: 34
```

#### Step 3-4: iOS 빌드 설정

```
[빌드 절차]
1. npm run build
2. npx cap sync ios
3. npx cap open ios                   # Xcode에서 프로젝트 열기

[Info.plist 추가 설정]
- UIFileSharingEnabled: YES
- LSSupportsOpeningDocumentsInPlace: YES
- CFBundleDocumentTypes에 docx UTI 등록:
  - com.microsoft.word.docx
  - org.openxmlformats.wordprocessingml.document
```

#### Step 3-5: APK 서명 및 릴리스 빌드

```bash
# 키스토어 생성 (최초 1회)
keytool -genkey -v -keystore word-viewer-release.keystore \
  -alias word-viewer -keyalg RSA -keysize 2048 -validity 10000

# 릴리스 빌드 (Android Studio 또는 CLI)
cd android
./gradlew assembleRelease

# 서명된 APK 위치:
# android/app/build/outputs/apk/release/app-release.apk
```

---

### Phase 4: 추가 기능 및 품질 개선

#### Step 4-1: 다크 모드

```
[구현 요구사항]
- prefers-color-scheme 미디어 쿼리 감지
- 수동 토글 버튼 (툴바 내)
- 문서 콘텐츠 영역:
  - 배경: #1a1a2e
  - 텍스트: #e0e0e0
  - 표 테두리: #4a4a6a
  - 이미지: 그대로 유지 (밝기 필터 적용하지 않음)
- 설정값 localStorage에 저장
```

#### Step 4-2: 최근 파일 목록

```
[구현 요구사항]
- 최근 열어본 파일 최대 20개 저장 (Capacitor Preferences 또는 localStorage)
- 저장 항목: 파일명, 마지막 열람일, 파일 경로(네이티브), 파일 크기
- 홈 화면에 목록 표시
- 스와이프로 삭제 가능
- 네이티브 환경에서는 파일 경로로 바로 재열기 시도
  (파일이 삭제된 경우 목록에서 자동 제거)
```

#### Step 4-3: 검색 기능

```
[구현 요구사항]
- 문서 내 텍스트 검색 (Ctrl+F / 툴바 검색 아이콘)
- 검색어 하이라이트 (배경색 #ffeb3b, 현재 위치는 #ff9800)
- 이전/다음 결과 이동 버튼
- 검색 결과 개수 표시 ("3 / 15")
- 대소문자 구분 토글
- 검색 시 해당 위치로 자동 스크롤
```

---

## 4. 테스트 체크리스트

### 4.1 기능 테스트

```
□ 일반 텍스트 문서 (.docx) 열기 및 렌더링
□ 서식 포함 문서 (굵게, 기울임, 밑줄, 색상) 정상 표시
□ 표(table) 포함 문서 렌더링 및 가로 스크롤
□ 이미지 포함 문서 (JPEG, PNG) 정상 표시
□ 한글 문서 (본문 스타일, 한글 폰트) 정상 렌더링
□ 대용량 문서 (10MB+, 100페이지+) 파싱 및 렌더링
□ 빈 문서 열기 시 안내 메시지 표시
□ 잘못된 파일 (txt를 docx로 변경 등) 에러 처리
□ 줌 인/아웃 (핀치, 버튼, 더블 탭)
□ 검색 기능 동작
□ 다크 모드 전환
□ 최근 파일 목록 저장 및 로드
```

### 4.2 성능 테스트

```
□ 1MB 문서: 3초 이내 렌더링
□ 10MB 문서: 10초 이내 렌더링 (로딩 인디케이터 표시)
□ 이미지 20장 포함 문서: 메모리 누수 없음
□ 파일 교체 반복 10회: 메모리 증가 없음
□ 저사양 기기 (2GB RAM): 크래시 없음
```

### 4.3 플랫폼 테스트

```
□ Chrome 모바일 (Android)
□ Safari 모바일 (iOS)
□ Samsung Internet
□ Android WebView (Capacitor)
□ iOS WKWebView (Capacitor)
□ Android APK 설치 및 실행
□ 외부에서 docx 파일 "공유" → 앱에서 열기
```

---

## 5. 알려진 제약사항 및 주의사항

### 5.1 mammoth.js 한계

- docx의 모든 서식을 100% 재현하지는 못함 (복잡한 텍스트 박스, 워드아트 등 미지원)
- 페이지 나누기 개념이 없음 (연속 스크롤로 표시)
- 차트/SmartArt는 이미지로 임베딩된 경우에만 표시 가능
- 수식(Equation)은 부분적으로만 지원

### 5.2 대안 라이브러리 (mammoth.js가 부족할 경우)

| 라이브러리 | 장점 | 단점 |
|-----------|------|------|
| docx-preview | 원본에 가까운 렌더링 | 번들 크기 큼, 설정 복잡 |
| docxjs | 세밀한 제어 가능 | 유지보수 활발하지 않음 |
| 자체 파서(JSZip) | 완전한 커스터마이징 | 개발 공수 매우 큼 |

**권장**: mammoth.js로 MVP 구현 후, 렌더링 품질이 부족하면 docx-preview로 교체 검토

### 5.3 보안 고려사항

```
- DOMPurify로 HTML 새니타이징 필수 (XSS 방지)
- docx 내 매크로/VBA는 무시 (실행하지 않음)
- 외부 리소스 로드 차단 (이미지 외부 URL 등)
- Content Security Policy 설정
```

---

## 6. 개발 우선순위 및 일정 가이드

```
[1주차] Phase 1 — 기본 웹 뷰어
  → 파일 선택, docx 파싱, HTML 렌더링, 기본 스타일링

[2주차] Phase 2 — 모바일 UX
  → 반응형 레이아웃, 줌, 성능 최적화, Web Worker

[3주차] Phase 3 — 네이티브 패키징
  → Capacitor 설정, 네이티브 파일 접근, APK 빌드

[4주차] Phase 4 — 품질 개선
  → 다크 모드, 검색, 최근 파일, 버그 수정, 테스트
```

---

## 7. 최종 산출물 목록

```
1. 웹 버전 (dist/) — 정적 호스팅 가능
2. Android APK — 릴리스 서명 완료
3. iOS 프로젝트 — Xcode에서 빌드 가능 상태
4. README.md — 빌드 방법, 사용법 문서화
5. 테스트 결과 보고서
```

---

## 부록 A: Qwen3-Coder 에게 전달할 초기 프롬프트 예시

> 아래 내용을 Qwen3-Coder 세션 시작 시 첫 프롬프트로 사용하세요.

```
당신은 모바일 Word 문서 뷰어 앱을 개발하는 시니어 프론트엔드 개발자입니다.

[프로젝트 요약]
- React 18 + TypeScript + Vite 기반 모바일 Word(.docx) 뷰어
- mammoth.js + JSZip으로 클라이언트 사이드 docx 파싱
- Tailwind CSS로 모바일 반응형 UI
- Capacitor로 Android/iOS 앱 패키징

[작업 규칙]
1. 각 Phase를 순서대로 진행하고, Phase 완료 시 동작 확인 후 다음으로 진행
2. 코드는 TypeScript로 작성하고 타입을 명시적으로 선언
3. 컴포넌트는 함수형 컴포넌트 + 커스텀 훅 패턴 사용
4. 에러 처리를 반드시 포함 (try-catch, ErrorBoundary)
5. 한글 문서 호환성을 항상 고려 (word-break, 스타일 매핑)
6. 각 단계 완료 후 테스트 체크리스트 항목을 확인

첨부된 명세서(mobile-word-viewer-spec.md)를 기반으로
Phase 1, Step 1-1부터 시작해주세요.
```

---

## 부록 B: 단계별 작업 분할 프롬프트

Phase가 길 경우, 아래처럼 단계별로 나눠서 지시할 수 있습니다:

```
Phase 1 완료 후 → "Phase 2로 진행해주세요. 반응형 레이아웃과 줌 기능을 구현합니다."
Phase 2 완료 후 → "Phase 3로 진행해주세요. Capacitor를 설치하고 Android 빌드를 설정합니다."
Phase 3 완료 후 → "Phase 4로 진행해주세요. 다크 모드와 검색 기능을 추가합니다."
전체 완료 후   → "테스트 체크리스트를 기반으로 전체 기능을 검증하고 누락 사항을 보완해주세요."
```

> **Tip**: 한 번에 전체를 시키기보다 Phase 단위로 나눠서 진행하면 품질이 더 좋습니다.
> 각 Phase 사이에 직접 동작을 확인하고 피드백을 주세요.
