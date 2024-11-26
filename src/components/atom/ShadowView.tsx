import React from 'react'
import { ImageBackground, StyleProp, View, ViewStyle } from 'react-native'

const ShadowView = ({ children,className}: { children: React.ReactNode,className?:string }) => {
  return (
    <View
      className={`w-full h-full rounded-card overflow-hidden ${className}`}
      style={{ backgroundColor: 'rgba(250,250,250,0.1)' }}
    >
      <ImageBackground
        source={require('../../../assets/pngs/ShadowBox.png')}
        className="w-full h-full"
        resizeMode='cover'
      >
        {children}
      </ImageBackground>
    </View>
  )
}

export default ShadowView

// props 로도 받아봤는데 className 이 적용안됨
//Txt component 와 같은 문제
// shadowView 앞뒤로 View 를 최소 두 개 추가 배치해야해서 해결방안 必