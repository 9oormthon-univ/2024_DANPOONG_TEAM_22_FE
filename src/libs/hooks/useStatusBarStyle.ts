import {StatusBar} from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { BackType } from "@type/BackType";
// 상태바 스타일 설정을 위한 커스텀 훅
export const useStatusBarStyle = (type: BackType) => {
  const color = {
    gradation: '#252738',
    solid: '#252738', 
    main: '#121320'
  }[type];
  
  // 상태바 스타일 설정 - 화면에 focus될 때마다 실행
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor(color);
    }, [color])
  );
};
