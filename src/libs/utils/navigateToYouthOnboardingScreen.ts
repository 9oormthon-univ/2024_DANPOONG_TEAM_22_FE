import {navigationRef} from 'App';

/**
 * 청소년 온보딩 화면으로 네비게이션하는 유틸리티 함수
 * 
 * 설명:
 * 이 함수는 청소년 온보딩 화면으로 이동합니다.
 * 
 * 입력:
 * 없음
 * 
 * 출력:
 * @returns {void} - 반환값 없음, 화면 이동 수행
 */
export const navigateToYouthOnboardingScreen = () => {
  navigationRef.navigate('AuthStackNav', {
    screen: 'YouthOnboardingScreen',
  });
};
