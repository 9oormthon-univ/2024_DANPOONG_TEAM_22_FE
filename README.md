## ✨ 내일모래 : 사람의 목소리로 자립준비청년의 일상을 밝히는 서비스

![0 표지](https://github.com/user-attachments/assets/5c52cc72-0b46-49cf-88a0-406dbb1379ed)

## 🔥 프로젝트 개요

| 자립준비청년 정의 | 자립준비청년 사회 현상 |
|---|---|
| ![1 자립준비청년 정의](https://github.com/user-attachments/assets/0e94a7a6-f8c7-4e47-a358-a403b39f3840) | ![2 자립준비청년 사회 현상](https://github.com/user-attachments/assets/a3e9c742-f0a4-4647-a557-e1b8c8c9f63b) |

| 인터뷰_자립준비청년 | 데스크리서치_봉사자 |
|---|---|
| ![3 인터뷰](https://github.com/user-attachments/assets/138d4989-f3ee-4170-8b76-ed739005912e) | ![4 데스크리서치_ 봉사자](https://github.com/user-attachments/assets/348619de-43a2-4e36-bc2c-5f601e4b5d7f) |

| 인사이트 | 경쟁사 |
|---|---|
| ![5 인사이트](https://github.com/user-attachments/assets/2193d812-9586-4b58-9aa7-951a748ff4d8) | ![6 경쟁사](https://github.com/user-attachments/assets/bcd2f90f-91e8-4356-a822-6b389953ceb9) |

| 솔루션 | 서비스 소개 |
|---|---|
| ![8](https://github.com/user-attachments/assets/549dab24-23f2-45af-9366-19e0d8b1d717) | ![9](https://github.com/user-attachments/assets/b6895bdb-475a-416b-a015-769fa6bad5ef) |

| 디자인 컨셉 | [시연 영상](https://youtu.be/hEcB9O_u_yA?feature=shared) |
|---|---|
| ![10](https://github.com/user-attachments/assets/360cc5b0-2e16-4420-96e9-5c755e66f0db) | ![11](https://github.com/user-attachments/assets/52ff3aef-6ee8-4945-b75b-91e8692737f6) |

| 비즈니스 모델 | 비전 |
|---|---|
| ![12](https://github.com/user-attachments/assets/5b385c9f-d3d2-4a5a-adfc-f3d0b6663de6) | ![15](https://github.com/user-attachments/assets/29f7cf13-3334-487e-b22e-1b7863cd18fd) |

![16](https://github.com/user-attachments/assets/30f29d31-b870-4119-9ff3-827740843840)

<br>

## 📝 시스템 아키텍쳐

![시스템 아키텍쳐](https://github.com/user-attachments/assets/00362eb3-d84d-48c1-a41a-e08c0cf745f5)

<br>

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

<br>

## 📦 패키지 구조

```
src
└── nav
  ├── tabNav
  └── stackNav
├── screens
└── components
  ├── atom
  └── molcule
├── stories
├── types
├── contexts
└── libs
  ├── constants
  ├── apis
  ├── hooks
  └── utils
```

## 🧐 팀 소개

| 이름 | 학교 | 역할 |
| --- | --- | --- |
| 박주현 | 성신여자대학교 | PM |
| 김수연 | 성신여자대학교 | DE |
| 박정빈 | 국민대학교 | FE |
| 봉지수 | 아주대학교 | FE |
| 노유성 | 가천대학교 | BE |
| 심세원 | 가천대학교 | BE |

<br>

## ✅ 협업 방식

<details>
<summary><b>코드 컨벤션</b></summary>

<br>

**React Native: JavaScript**

| 구분 | 규칙 |
|------|------|
| Name | • 변수 선언 시 const를 기본으로 사용, 필요한 경우에만 let 사용<br>• 객체 및 배열에는 리터럴 표기법 사용<br>• 함수는 함수 표현식을 주로 사용 |
| Format | • 들여쓰기는 2칸 사용<br>• 여러 줄에 걸치는 객체는 쉼표 뒤에 줄 바뀜 적용 |
| 주석 | • 코드의 의도를 설명하는 주석 추가 |

</br>

</details>

<details>
<summary><b>커밋 규칙</b></summary>

</br>

**설명**

| 구분 | 규칙 |
|------|------|
| Name | • `<type>/<subject>`의 규칙으로 작성<br>• 작은 단위로 커밋을 작성하는 것을 기본으로 함 |
| Tag type | • `feat` : 새로운 기능 추가<br>• `style` : 주석 등 코드 포맷 수정<br>• `chore` : 사소한 코드 수정<br>• `fix` : 에러 및 버그 수정<br>• `docs` : 문서 수정<br>• `design` : 디자인 관련 코드 추가 및 수정<br>• `refactor` : 코드 리팩토링<br>• `deploy` : 배포 관련 설정 추가 및 수정 |

**예시**

```
feat/버튼 생성

버튼 컴포넌트 파일을 생성하고 UI를 작성
onClick이나 다른 기능은 구현하지 않았습니다!
```

</br>

</details>

<details>
<summary><b>브랜치 규칙</b></summary>

</br>

**설명**

| 구분 | 규칙 |
|------|------|
| Name | • `{feature name}/#{issue number}`의 규칙으로 작성<br>• 태그는 커밋 태그와 동일하게 사용<br>• 이슈를 해결하기 위한 브랜치를 만드는 것을 기본으로 함 |

**예시**

```
회원가입/#1
```

</br>

</details>

<details>
<summary><b>풀 리퀘스트(PR) 규칙</b></summary>

</br>

**설명**

| 구분 | 규칙 |
|------|------|
| Name | • `<type>/<subject>`의 규칙으로 작성<br>• 태그는 커밋 태그와 동일하게 사용<br>• 내용에는 자신이 작업했던 작업 기록 |

**예시**

```
refactor/회원가입
```

</br>

</details>

<details>
<summary><b>이렇게 협업했습니다!</b></summary>

</br>

| 항목               | 이미지                                                          | 설명                           |
|-------------------|----------------------------------------------------------------|--------------------------------|
| 회의록            | <img src="https://github.com/user-attachments/assets/05828601-f9bf-4d37-bb32-06b06051c226" style="width: 70%;" /> | 회의한 내용을 명시적으로 활용할 수 있도록 회의록을 작성해 공유했습니다|
| 할 일 정리        | <img src="https://github.com/user-attachments/assets/044c6c3f-0dca-4d25-ae00-7c889e9657ce" style="width: 70%;" /> | 해야 할 일을 정리해 놓아 일정관리를 하였고, 팀원들에게 진행도를 공유하였습니다 |
| API 명세          | <img src="https://github.com/user-attachments/assets/29be2e30-88e7-42d8-a523-49624161e718" style="width: 70%;" /> | 스웨거를 통해 API 명세를 확인하며, BackEnd분들과 의견을 나누었습니다.   |
| 와이어프레임      | <img src="https://github.com/user-attachments/assets/b8b096b6-8377-4344-8c21-2ed2a1e1aab6" style="width: 70%;" /> | 피그마에서 와이어프레임을 살펴보며 팀원들과 의견을 공유했습니다|
| 디자인            | <img src="https://github.com/user-attachments/assets/c0a605d1-3ba2-4402-9e5f-e1548f30d815" style="width: 70%;" /> | 최종 디자인을 살펴보며 팀원들과 의견을 공유했습니다|

</br>

</details>

<br>

<details>
<summary><h2>⭐️ 예선대비 개선점</h2></summary>

</br>

**1. Expo 환경에서 React Native CLI로의 개발 환경 변경**

개발 환경을 React Native CLI로 변경함으로써 빌드 시간을 약 20분에서 1분 미만으로 단축시켰습니다. 이로 인해 빌드 시간 95% 이상 단축되었으며, 개발 효율성을 크게 향상시킬 수 있었습니다.

초기에는 Expo Managed Workflow를 사용하여 빠른 시작과 개발을 목표로 했습니다. 하지만, 카카오 로그인 API와 같은 네이티브 기능을 사용하기 위해서는 EAS Build를 활용해야 했습니다. Expo Managed Workflow는 네이티브 모듈을 직접 사용할 수 없으며, EAS Build는 네이티브 코드와 관련된 작업을 처리하는 서비스였기 때문입니다.

하지만 EAS Build의 긴 빌드 시간은 개발 효율성을 낮추는 주요 원인이었습니다. 이를 해결하기 위해 React Native CLI로 환경을 전환하였고, 빌드 시간을 크게 단축시켜 개발 속도와 효율성을 향상시켰습니다.

또한, 네이티브 종속성을 직접 관리하면서 추가적인 커스터마이징이 가능해졌습니다. 구체적으로,

녹음 기능은 `expo-av`에서 `react-native-audio-recorder-player`로,
알림 기능은 `react-native-push-notification`에서 `notifee/react-native`로 변경하여 세부적인 설정을 할 수 있었습니다.

**2. 앱 완성도 및 안정성 향상**

기존에 구현하지 못했던 기능들을 추가하고, API 연결 안정성을 높여 앱의 완성도와 안정성을 크게 향상시켰습니다.

특히, 알림 기능의 완성도를 높이기 위해 알림 수신 조건과 앱 상태에 따른 분기 처리를 구현하였습니다. 이를 통해 사용자가 앱을 열지 않은 상태에서도 알림을 받을 수 있도록 안정성을 강화했습니다.

**3. 에셋 최적화**

+ 이미지 최적화

이미지 파일 확장자를 png, webp, svg로 통일하였습니다.
간단한 아이콘은 svg 사용.
svg로 표현 불가한 이미지는 webp 사용.
배경화면처럼 webp로 변환 시 품질 손상이 발생하는 이미지는 png로 유지.

+ 오디오 최적화
  
백엔드 음성 인식을 위해 wav 형식으로 녹음 후 API 요청을 합니다.
추후 ADPCM 형식을 사용해 데이터 손실 없이 파일 크기를 줄일 계획입니다.

+ 폰트 최적화
  
사용하지 않는 폰트를 삭제해 용량 축소.
향후 가장 자주 사용하는 wantedsans 외의 폰트를 서브셋 폰트로 제작할 계획입니다.

<br>

</details>
