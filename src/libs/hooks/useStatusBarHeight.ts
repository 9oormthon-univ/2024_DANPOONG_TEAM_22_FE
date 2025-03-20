import {Platform, StatusBar} from 'react-native';
import {useEffect, useState} from 'react';

/**
 * 상태 표시줄의 높이를 가져오는 커스텀 훅
 * @returns {number} 상태 표시줄의 높이 (픽셀)
 */
export const useStatusBarHeight = (): number => {
  const [statusBarHeight, setStatusBarHeight] = useState<number>(0);

  useEffect(() => {
    if (Platform.OS === 'android') {
      setStatusBarHeight(StatusBar.currentHeight ?? 0);
    } else {
      // iOS의 경우 기본값 44로 설정
      setStatusBarHeight(44);
    }
  }, []);

  return statusBarHeight;
};

