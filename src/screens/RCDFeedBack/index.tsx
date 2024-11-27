import { View, Animated, ImageBackground, ActivityIndicator } from 'react-native'
import Txt from '@components/atom/Txt'
import BG from '@components/atom/BG'
import Button from '@components/atom/button/Button'
//import { BarIndicator, DotIndicator } from 'react-native-indicators'
import { NavigationProp } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'

import { useState, useEffect, useRef } from 'react'
import AppBar from '@components/atom/AppBar'
import { HomeStackParamList } from '@type/HomeStackParamList'

const RCDFeedBackScreen = () => {
  const [isLoading,setIsLoading]=useState<boolean>(false);
  const opValue = useRef(new Animated.Value(0)).current
  const subColor = useRef(new Animated.Value(0)).current
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>()

  useEffect(() => {
    if(!isLoading){
    Animated.timing(opValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()

    Animated.timing(subColor, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start()
  }
  }, [isLoading])

  const interpolatedColor = subColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#a0a0a0', '#d0d0d0'],
  })

  return (
    <View className='flex-1'>
      {isLoading?(
  <>
  {/* loading */}
  <BG type='solid'>
  {/* content section */}
  <View className='absolute pt-[233] w-full'>
  <Txt type="title1" content="듣고 있어요..." color="gray_100" align='center'/>
  <View className='mb-[23]'/>
  <Animated.Text className='text-center' style={{ color: interpolatedColor }}>
    더 세심한 확인이 필요할 때는{'\n'}시간이 조금 더 소요될 수 있어요
  </Animated.Text>
  <View className='mb-[55]'/>
  <ActivityIndicator size="large" color="#f9f96c" />
  </View>
  </BG>
  </>
      ):(
        <>
        {/* 배경 section */}
        {/* 불 꺼진 배경 */}
        <BG type="solid">
          <View className='w-full h-full justify-center items-center'>
            <View className='w-[90%] h-[85%] justify-center items-center'>
              <ImageBackground
                source={require('../../../assets/pngs/starsOff.png')}
                resizeMode="contain"
                className='static w-full h-full'
              />
            </View>
          </View>
        </BG>
        {/* 불 켜진 배경 */}
        <Animated.View className='absolute w-full h-full justify-center items-center' style={{opacity: opValue}}>
          <BG type="gradation">
            <View className='w-full h-full justify-center items-center'>
              <View className='w-[90%] h-[85%] justify-center items-center'>
                <ImageBackground
                  source={require('../../../assets/pngs/starsOn.png')}
                  resizeMode="contain"
                  className='w-full h-full'
                />
              </View>
            </View>
          </BG>
        </Animated.View>
        {/* appbar section */}
        <AppBar
          title=''
          exitCallbackFn={() => {navigation.navigate('Home')}}
          className="absolute top-[0] w-full"
        />
        
        {/* content section */}
        <View className='absolute pt-[292] w-full'>
        <Txt type="title1" content="녹음 완료" color="gray_100" align='center'/>
        <View className='mb-[23]'/>
        <Animated.Text className='text-center' style={{ color: interpolatedColor, fontFamily: "WantedSans-Regular", fontSize: 18, lineHeight: 18*1.5, letterSpacing: 18 * -0.025 }}>
          바람돌이님의 목소리 덕분에{'\n'}나그네가 힘차게 여행할 수 있을거에요
        </Animated.Text>
        </View>
        </>
      )}
    </View>
  )
}

export default RCDFeedBackScreen
