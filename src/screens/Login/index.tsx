import {postLogin} from '@apis/auth';
import KakaoIcon from '@assets/svgs/kakao.svg';
import BG from '@components/atom/BG';
import Txt from '@components/atom/Txt';
import { useStatusBarStyle } from '@hooks/useStatusBarStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KakaoOAuthToken, login} from '@react-native-seoul/kakao-login';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {Image, Pressable, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {SafeAreaView} from 'react-native-safe-area-context';

type AuthProps = NativeStackScreenProps<AuthStackParamList, 'LoginScreen'>;

const LoginScreen = ({navigation}: Readonly<AuthProps>) => {  
  // 상태바 스타일 설정
  const BackColorType = 'main';
  useStatusBarStyle(BackColorType);

  const handleLogin = async ({loginType}: {loginType: string}) => {
    try {
      const token: KakaoOAuthToken = await login();
      console.log('token', token);

      // iOS에서는 macAddress를 가져오는 것이 정책상 허용되지 않음
      const {result} = await postLogin({
        accessToken:
          loginType === 'ANOYMOUS'
            ? DeviceInfo.getDeviceId() + (await DeviceInfo.getMacAddress())
            : token.accessToken,
        loginType,
      });

      const {accessToken, refreshToken, memberId, serviceMember} = result;
      console.log('serviceMember', serviceMember);

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('memberId', String(memberId));

      navigation.navigate('NicknameWriteScreen');
    } catch (error) {
      console.error('login error:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <BG type={BackColorType}>
        <View className="flex-1">
          <View className="items-center mt-[185]">
            <Txt type="body4" text="내일도 모레도," className="text-gray300" />
            <Txt
              type="body4"
              text="일상을 비추는 목소리"
              className="text-gray300"
            />
            <Image
              source={require('@assets/pngs/logo/typo/typo_logo_white.png')}
              style={{width: 200, height: 72, marginTop: 16}}
            />
          </View>
          <Image
            source={require('@assets/pngs/background/background1.png')}
            className="w-full h-auto flex-1 mt-[124]"
          />
          <View className="absolute left-0 bottom-[72] w-full px-[40]">
            <Pressable
              className="h-[52.8] bg-[#FEE500] justify-center items-center flex-row"
              style={{borderRadius: 7}}
              onPress={() => handleLogin({loginType: 'KAKAO'})}>
              <KakaoIcon />
              <Txt
                type="body3"
                text="카카오 로그인"
                className="ml-[9.39] font-[AppleSDGothicNeoR]"
                style={{fontSize: 17.6}}
              />
            </Pressable>
            <Pressable onPress={() => handleLogin({loginType: 'ANOYMOUS'})}>
              <Txt
                type="body4"
                text="가입 없이 써볼래요"
                className="mt-[16.2] text-gray300 text-center underline"
              />
            </Pressable>
          </View>
        </View>
      </BG>
    </SafeAreaView>
  );
};

export default LoginScreen;
