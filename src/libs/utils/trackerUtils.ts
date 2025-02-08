import AsyncStorage from '@react-native-async-storage/async-storage';
import encryptUserId from '@utils/encryptUserId';
import {Platform} from 'react-native';

const getCommonParams = async () => {
  try {
    const memberId = await AsyncStorage.getItem('memberId');
    const userId = memberId ?? 'guest'; // 실제 사용자 ID
    const hashedUserId = encryptUserId(userId);

    return {
      timestamp: new Date().toISOString(), // 공통 매개변수: 앱 시작 시간
      user_id: hashedUserId, // 공통 매개변수: 사용자 ID (SHA256 암호화)
      app_version: '1.0.0', // 공통 매개변수: 앱 버전
      platform: Platform.OS, // 공통 매개변수: 플랫폼 (iOS/Android)
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

export default getCommonParams;
