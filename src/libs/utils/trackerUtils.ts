import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptUserId } from '@utils/encryptUserId';
import {Platform} from 'react-native';

/**
 * 이벤트 추적에 사용되는 공통 매개변수를 가져오는 유틸리티 함수
 * 
 * 설명:
 * 이 함수는 이벤트 추적 시 필요한 사용자 ID, 타임스탬프, 앱 버전 등의 공통 매개변수를 제공합니다.
 * 
 * 입력:
 * 없음
 * 
 * 출력:
 * @returns {Promise<object>} - 이벤트 추적에 사용할 공통 매개변수 객체
 */
export const getCommonParams = async () => {
  try {
    const memberId = await AsyncStorage.getItem('memberId');
    const userId = memberId ?? 'guest'; // 실제 사용자 ID
    const hashedUserId = encryptUserId(userId);
    const role = await AsyncStorage.getItem('role');

    return {
      timestamp: new Date().toISOString(), // 공통 매개변수: 앱 시작 시간
      user_id: hashedUserId, // 공통 매개변수: 사용자 ID (SHA256 암호화)
      app_version: '1.0.0', // 공통 매개변수: 앱 버전
      platform: Platform.OS, // 공통 매개변수: 플랫폼 (iOS/Android)
      user_type: role,
    };
  } catch (error) {
    console.error('Error getting common params:', error);
    return {
      timestamp: new Date().toISOString(),
      user_id: 'guest', // 에러 발생 시 기본값
      app_version: '1.0.0',
      platform: Platform.OS,
    };
  }
};
