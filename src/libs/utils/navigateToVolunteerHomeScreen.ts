import { navigationRef } from 'App';

/**
 * 봉사자 홈 화면으로 네비게이션하는 유틸리티 함수
 *
 * 설명:
 * 이 함수는 봉사자 홈 화면으로 이동합니다.
 *
 * 출력:
 * @returns {void} - 반환값 없음, 화면 이동 수행
 */
export const navigateToVolunteerHomeScreen = () => {
  navigationRef.navigate('AppTabNav');
};
