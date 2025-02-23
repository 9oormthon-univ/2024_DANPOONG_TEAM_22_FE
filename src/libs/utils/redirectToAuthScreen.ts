import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigationRef } from "App";
import { CommonActions } from '@react-navigation/native';

//로그인 화면으로 이동
export const redirectToAuthScreen = async () => {
  if (!navigationRef.isReady()) {
    console.error('네비게이션이 준비되지 않았습니다.');
    return;
  }
  if (navigationRef) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: 'AuthStackNav' }],
    });}
  // 모든 인증 관련 데이터 제거
  // await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
};
