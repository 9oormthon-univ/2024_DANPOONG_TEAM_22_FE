import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigationRef} from 'App';

/**
 * 인증 화면으로 리다이렉트하는 유틸리티 함수
 * 
 * 설명:
 * 이 함수는 사용자를 로그인 화면으로 리다이렉트하고 인증 관련 데이터를 제거합니다.
 * 
 * 입력:
 * 없음
 * 
 * 출력:
 * @returns {Promise<void>} - 반환값 없음, 화면 이동 및 데이터 제거 수행
 */
export const redirectToAuthScreen = async () => {
  if (!navigationRef.isReady()) {
    console.error('네비게이션이 준비되지 않았습니다.');
    return;
  }
  if (navigationRef) {
    navigationRef.reset({
      index: 0,
      routes: [{name: 'AuthStackNav'}],
    });
  }
  // 모든 인증 관련 데이터 제거
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'role']);
};
