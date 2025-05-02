import { useEffect, useState } from 'react';
import { Image, View } from 'react-native';

import { AppBar } from '@components/AppBar';
import { BG } from '@components/BG';
import { CustomText } from '@components/CustomText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import { type SystemStackParamList } from '@type/nav/SystemStackParamList';

import KakaoLogo from '@assets/svgs/KakaoLogo.svg';

export const ConnectedAccountScreen = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  const [email, setEmail] = useState('');
  const [loginType, setLoginType] = useState('');

  useEffect(() => {
    (async () => {
      const storedEmail = await AsyncStorage.getItem('email');
      const storedLoginType = await AsyncStorage.getItem('loginType');

      if (storedEmail) setEmail(storedEmail);

      if (storedLoginType) setLoginType(storedLoginType);
    })();
  }, []);

  return (
    <BG type="solid">
      <AppBar
        title="연결된 소셜 계정"
        goBackCallbackFn={() => {
          navigation.goBack();
        }}
      />
      {/* 전체 컨테이너 */}
      <View className="flex-1 items-center px-px  pt-[28]">
        {/* 연결된 소셜 계정 컨테이너 */}
        <View className="w-full h-[89] bg-blue600 rounded-[10px] px-[27] py-[17] justify-center">
          <View className="flex-row items-center">
            {loginType == 'KAKAO' && <KakaoLogo />}
            {loginType == 'APPLE' && (
              <Image
                source={{
                  uri: 'https://ip-file-upload-test.s3.ap-northeast-2.amazonaws.com/assets/apple_logo_white_32.png',
                }}
                className="w-[16] h-[16]"
                resizeMode="contain"
              />
            )}
            <View className="w-[8.64]" />
            <CustomText
              type="caption1"
              text={loginType === 'KAKAO' ? '카카오 계정' : '애플 계정'}
              className="text-gray200"
            />
          </View>
          <View className="h-[6]" />
          <View className="w-full h-[27] overflow-hidden">
            <CustomText type="body3" text={email} className="text-white" />
          </View>
        </View>
      </View>
    </BG>
  );
};
