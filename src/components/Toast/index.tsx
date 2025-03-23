// 필요한 컴포넌트 및 아이콘 import
import Bang from '@assets/svgs/Bang.svg';
import CheckYellowIcon from '@assets/svgs/checkYellow.svg';
import {CustomText} from '@components/CustomText';
import {useEffect} from 'react';
import {Animated, View} from 'react-native';

// Toast 컴포넌트의 props 타입 정의
export const Toast = ({
  text,
  isToast,
  setIsToast,
  position = 'top',
  type = 'notice',
}: {
  text: string; // 토스트 메시지 텍스트
  isToast: boolean; // 토스트 표시 여부
  setIsToast: () => void; // 토스트 상태 변경 함수
  position?: 'top' | 'bottom' | 'left'; // 토스트 표시 위치
  type?: 'notice' | 'check'; // 토스트 타입
}) => {
  // 애니메이션을 위한 opacity 값
  const opacity = new Animated.Value(0);

  // 토스트 표시 상태가 변경될 때마다 실행
  useEffect(() => {
    if (isToast) {
      // 토스트가 표시될 때 페이드인 애니메이션 실행
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // 3초 후 페이드아웃 애니메이션 실행 후 토스트 숨기기
      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setIsToast();
        });
      }, 3000);

      // 컴포넌트 언마운트 시 타이머 정리
      return () => clearTimeout(timer);
    } else {
      // 토스트가 숨겨질 때 opacity 초기화
      opacity.setValue(0);
    }
  }, [isToast]);

  // 토스트가 숨겨진 상태면 null 반환
  if (!isToast) {
    return null;
  }

  // 토스트 UI 렌더링
  return (
    <View
      className={`w-full items-center justify-center absolute ${
        position === 'top'
          ? 'top-[100]'
          : position === 'left'
          ? 'top-[88] left-[25] items-start'
          : 'bottom-[89] '
      }`}>
      <Animated.View
        className="w-auto h-auto flex-row bg-blue400 px-[25] py-[16] z-50"
        style={{
          borderRadius: 50,
          opacity,
        }}>
        {type === 'check' ? <CheckYellowIcon /> : <Bang />}
        <View className="ml-[14]" />
        <CustomText type="body4" text={text} className="text-white text-center" />
      </Animated.View>
    </View>
  );
};
