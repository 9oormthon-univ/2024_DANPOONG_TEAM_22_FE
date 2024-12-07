# 2024_DANPOONG_TEAM_22_FE

내일 모래 - 사람의 목소리로 자립 준비 청년의 일상을 밝히는 서비스

## ⚙️ FE 사용 도구
| 도구 | 도입 이유 |
|---|---|
| TypeScript | JavaScript에 타입을 명시함으로써 에러를 미연에 방지한다. 타입 명시로 인해 코드 에디터(VS Code) 내 자동완성 기능을 제공한다. 유지보수성과 편의성이 높아 선택했다. |
| Yarn | 개발에 필요한 패키지를 설치하고 업데이트하는 작업을 편리하게 도와주는 패키지 매니저다. npm에 비해 패키지 설치와 실행 속도가 빨라서 선택했다. |
| React Native | JavaScript를 iOS랑 Android 코드로 변환해주는 크로스플랫폼 프레임워크다. Flutter를 쓸까 고민했지만 웹 개발을 하다보면 JavaScript를 쓰는데, React Native도 JavaScript 기반이라 익숙하다는 점에서 선택했다. React와 유사하게 JSX 문법을 지원한다. |
| React Query | 데이터 fetching, caching, 서버 데이터와의 동기화를 지원하는 라이브러리다. Redux와 비교했을 때 캐싱 기능을 지원하고 Hook을 통해 데이터 fetching 과 상태 관리를 선언적으로 표현하여 가독성을 높여서 선택했다. |
| Context API | React 내장 전역 상태관리 도구다. Props Drilling 문제를 간편하게 해결하고자 사용했다. |
| Tailwind CSS | 유틸리티 기반의 CSS 프레임워크다. Styled-components, Emotion과 같은 CSS in JS 프레임워크와 비교했을 때 CSS 코드의 재사용성이 높으며, 컴포넌트에 스타일을 입힐 때 클래스명을 고민하는 일을 줄여준다. Bootstrap과 비교했을 때 사용자 정의 클래스를 동적으로 생성해주어 클래스를 직접 선언 하는 번거로움을 줄여줘서 선택했다. |
| FCM (Firebase Cloud Messaging) | Google에서 지원하는 무료 메시지 전송 서비스다. 메시지 서버를 직접 구축할 수도 있지만 간편하게 푸시알림 기능을 구현하고자 사용했다. |
| lottie-react-native | 적은 용량으로 부드러운 애니메이션을 적용하기 위해 사용했다. 청년의 녹음 듣기 화면에서 파형 애니메이션과 로딩 애니메이션을 재생하는 데 적용했다.  |
