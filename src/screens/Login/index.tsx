import {postLogin} from '@apis/auth';
import KakaoIcon from '@assets/svgs/kakao.svg';
import BG from '@components/atom/BG';
import Txt from '@components/atom/Txt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getProfile,
  KakaoOAuthToken,
  KakaoProfile,
  login,
} from '@react-native-seoul/kakao-login';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {RootStackParamList} from '@type/nav/RootStackParamList';
import {Image, Linking, Pressable, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';

type AuthProps = NativeStackScreenProps<AuthStackParamList, 'LoginScreen'>;
type RootProps = NativeStackScreenProps<RootStackParamList>;
type Props = CompositeScreenProps<AuthProps, RootProps>;

const LoginScreen = ({navigation}: Readonly<Props>) => {
  const handleLogin = async ({loginType}: {loginType: string}) => {
    try {
      const token: KakaoOAuthToken = await login();

      // iOS에서는 macAddress를 가져오는 것이 정책상 허용되지 않음
      const {result} = await postLogin({
        accessToken:
          loginType === 'ANOYMOUS'
            ? DeviceInfo.getDeviceId() + (await DeviceInfo.getMacAddress())
            : token.accessToken,
        loginType,
      });

      const {
        accessToken,
        refreshToken,
        memberId,
        role,
        infoRegistered,
        locationRegistered,
      } = result;
      console.log({role, locationRegistered});

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('memberId', String(memberId));
      await AsyncStorage.setItem('role', role);
      // 닉네임도 저장

      const profile: KakaoProfile = await getProfile();
      await AsyncStorage.setItem('email', profile.email);

      if (!infoRegistered) {
        navigation.navigate('RoleSelectScreen');
        return;
      }

      if (role === 'YOUTH') {
        if (locationRegistered) {
          navigation.navigate('YouthStackNav', {screen: 'YouthHomeScreen'});
        } else {
          navigation.navigate('YouthOnboardingScreen');
        }
      } else if (role === 'HELPER') {
        navigation.navigate('AppTabNav');
      }
    } catch (error) {
      console.error('login error:', error);
    }
  };

  return (
    <BG type="main">
      <View className="flex-1">
        <View className="h-[132]" />
        {/* 상단 텍스트 및 로고 섹션 */}
        <View className="items-center">
          <Txt type="body4" text="내일도 모레도," className="text-gray300" />
          <Txt
            type="body4"
            text="일상을 비추는 목소리"
            className="text-gray300"
          />
          {/* 로고 이미지 */}
          <Image
            source={require('@assets/pngs/logo/typo/typo_logo_white.png')}
            style={{width: 200, height: 72, marginTop: 16}}
          />
        </View>
        {/* 배경 이미지 */}
        <Image
          source={require('@assets/pngs/background/signup1.png')}
          className="w-full h-auto flex-1 absolute bottom-[-30]"
        />
        {/* 로그인 버튼 섹션 */}
        <View className="absolute left-0 bottom-[51] w-full px-[30]">
          {/* 카카오 로그인 버튼 */}
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
          {/* 이용약관, 개인정보처리방침 */}
          <View className="mt-[18.2] flex-row justify-center">
            <View className="flex-row justify-center">
              <Txt
                type="caption2"
                text="계속 진행함에 따라 "
                className="text-gray300"
              />
              {/* TODO: 이용약관 링크 변경 */}
              <Pressable
                onPress={() =>
                  Linking.openURL('https://www.naeilmorae.co.kr/privacy')
                }>
                <Txt type="caption2" text="이용약관" className="text-white" />
              </Pressable>
              <Txt type="caption2" text="과 " className="text-gray300" />
              <Pressable
                onPress={() =>
                  Linking.openURL('https://www.naeilmorae.co.kr/privacy')
                }>
                <Txt
                  type="caption2"
                  text="개인정보 처리방침"
                  className="text-white"
                />
              </Pressable>
              <Txt
                type="caption2"
                text="에 동의합니다."
                className="text-gray300"
              />
            </View>
          </View>
        </View>
      </View>
    </BG>
  );
};

export default LoginScreen;
