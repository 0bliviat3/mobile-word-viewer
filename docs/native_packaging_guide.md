# 네이티브 앱 패키징 가이드: Mobile Word Viewer

## 1. 패키징 개요
이 문서는 Mobile Word Viewer 애플리케이션을 네이티브 Android/iOS 앱으로 패키징하는 가이드입니다. 애플리케이션은 Capacitor를 사용하여 웹 기반 React 애플리케이션을 네이티브 모바일 앱으로 변환합니다.

## 2. 패키징 전 준비
### 2.1 시스템 요구사항
- Node.js 16 이상
- npm 8 이상
- Android Studio (Android 패키징용)
- Xcode (iOS 패키징용)
- Java 17 (Android 패키징용)

### 2.2 프로젝트 설정
1. Capacitor 설치:
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Word Viewer" "com.example.wordviewer"
```

2. 네이티브 플랫폼 추가:
```bash
npm install @capacitor/android @capacitor/ios
npm install @capacitor/filesystem @capacitor/share
```

3. Capacitor 설정 파일 생성 (`capacitor.config.ts`):
```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.wordviewer',
  appName: 'Word Viewer',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
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

## 3. Android APK 패키징
### 3.1 Android 빌드 준비
1. 웹 빌드 생성:
```bash
npm run build
```

2. Capacitor 동기화:
```bash
npx cap sync android
```

3. Android Studio 열기:
```bash
npx cap open android
```

### 3.2 Android 설정
1. `AndroidManifest.xml`에 필요한 권한 추가:
```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" 
                 android:maxSdkVersion="32"/>
<uses-permission android:name="android.permission.READ_MEDIA_DOCUMENTS"/>
```

2. `AndroidManifest.xml`에 Share Intent 수신 설정:
```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW"/>
  <category android:name="android.intent.category.DEFAULT"/>
  <data android:mimeType="application/vnd.openxmlformats-officedocument.wordprocessingml.document"/>
</intent-filter>
```

3. `build.gradle` 설정:
```gradle
android {
  compileSdkVersion 34
  buildToolsVersion "34.0.0"
  defaultConfig {
    minSdkVersion 24
    targetSdkVersion 34
  }
}
```

### 3.3 APK 생성
1. 키스토어 생성 (최초 1회):
```bash
keytool -genkey -v -keystore word-viewer-release.keystore \
  -alias word-viewer -keyalg RSA -keysize 2048 -validity 10000
```

2. 릴리스 빌드:
```bash
cd android
./gradlew assembleRelease
```

3. 서명된 APK 위치:
```
android/app/build/outputs/apk/release/app-release.apk
```

## 4. iOS IPA 패키징
### 4.1 iOS 빌드 준비
1. 웹 빌드 생성:
```bash
npm run build
```

2. Capacitor 동기화:
```bash
npx cap sync ios
```

3. Xcode 열기:
```bash
npx cap open ios
```

### 4.2 iOS 설정
1. `Info.plist`에 추가 설정:
```xml
<key>UIFileSharingEnabled</key>
<true/>
<key>LSSupportsOpeningDocumentsInPlace</key>
<true/>
```

2. `CFBundleDocumentTypes`에 docx UTI 등록:
```xml
<dict>
  <key>CFBundleTypeName</key>
  <string>Word Document</string>
  <key>CFBundleTypeRole</key>
  <string>Viewer</string>
  <key>LSItemContentTypes</key>
  <array>
    <string>com.microsoft.word.docx</string>
    <string>org.openxmlformats.wordprocessingml.document</string>
  </array>
</dict>
```

### 4.3 IPA 생성
1. Xcode에서 빌드 설정:
   - Build Configuration: Release
   - Deployment Target: iOS 14+

2. 빌드 및 앱 생성:
   - Product → Archive
   - Archive 윈도우에서 Distribute App 선택

## 5. 테스트 및 배포
### 5.1 테스트 절차
1. APK/IPA 파일을 실제 기기에서 설치 테스트
2. 문서 열기 및 렌더링 테스트
3. 줌 기능 및 기타 기능 테스트

### 5.2 배포 가이드
1. Google Play Store에 APK 업로드
2. Apple App Store에 IPA 업로드
3. 배포 전 최종 테스트 수행

## 6. 패키징 검증 체크리스트
- [ ] Capacitor 설정 정상 적용
- [ ] Android 빌드 성공 여부
- [ ] iOS 빌드 성공 여부
- [ ] APK/IPA 파일 생성 완료
- [ ] 네이티브 기기에서 정상 동작
- [ ] 문서 로드 및 렌더링 정상 작동
- [ ] 줌 기능 정상 작동
- [ ] 파일 공유 기능 작동 여부
- [ ] 권한 설정 정상 적용

## 7. 문제 해결
### 7.1 일반적인 문제
- **문서 열기 실패**: 파일 포맷 또는 권한 문제 확인
- **렌더링 불일치**: 스타일 매핑 설정 확인
- **APK 빌드 오류**: Android SDK 버전 확인

### 7.2 Android 특화 문제
- **Permission 오류**: AndroidManifest.xml 권한 확인
- **WebView 오류**: minWebViewVersion 설정 확인

### 7.3 iOS 특화 문제
- **File Sharing 오류**: Info.plist 설정 확인
- **Document Types 오류**: UTI 등록 확인

## 8. 최적화 팁
1. APK/IPA 파일 크기 최적화
2. 앱 시작 시간 최적화
3. 메모리 사용량 모니터링
4. 사용자 경험 개선을 위한 UI 튜닝