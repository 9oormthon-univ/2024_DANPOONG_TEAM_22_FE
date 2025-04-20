import { useEffect, useState } from 'react';
import { Image, Linking, Pressable, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { postAuthLoginWithAccessTokenAndLoginType } from '@apis/AuthenticationAPI/post/AuthLoginWithAccessTokenAndLoginType/fetch';
import { BG } from '@components/BG';
import { CustomText } from '@components/CustomText';
import { useGetMember } from '@hooks/auth/useGetMember';
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getProfile,
  type KakaoOAuthToken,
  type KakaoProfile,
  login,
} from '@react-native-seoul/kakao-login';
import { type CompositeScreenProps } from '@react-navigation/native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { type AuthStackParamList } from '@stackNav/Auth';
import { type RootStackParamList } from '@type/nav/RootStackParamList';
import { trackEvent } from '@utils/tracker';

import KakaoIcon from '@assets/svgs/kakao.svg';

type AuthProps = NativeStackScreenProps<AuthStackParamList, 'LoginScreen'>;

type RootProps = NativeStackScreenProps<RootStackParamList>;

type Props = CompositeScreenProps<AuthProps, RootProps>;

export const LoginScreen = ({ navigation }: Readonly<Props>) => {
  const [token, setToken] = useState<string | null>(null); // 액세스 토큰
  const { refetch: refetchMember } = useGetMember(token);

  const handleLogin = async ({ loginType }: { loginType: string }) => {
    try {
      const token: KakaoOAuthToken = await login();

      // iOS에서는 macAddress를 가져오는 것이 정책상 허용되지 않음
      const { result } = await postAuthLoginWithAccessTokenAndLoginType({
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

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('memberId', String(memberId));

      setToken(accessToken);
      await refetchMember();

      const profile: KakaoProfile = await getProfile();

      await AsyncStorage.setItem('email', profile.email);

      if (!infoRegistered) {
        navigation.navigate('RoleSelectScreen');

        return;
      }

      if (role === 'YOUTH') {
        if (locationRegistered) {
          navigation.navigate('YouthStackNav', { screen: 'YouthHomeScreen' });
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

  async function handleAppleLogin() {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // Note: it appears putting FULL_NAME first is important, see issue #293
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      const { identityToken } = appleAuthRequestResponse;

      console.log({ identityToken });

      // TODO: 서버와 api 스펙 맞춰봐야 함
    }
  }

  useEffect(() => {
    // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    return appleAuth.onCredentialRevoked(async () => {
      console.warn(
        'If this function executes, User Credentials have been Revoked',
      );
    });
  }, []); // passing in an empty array as the second argument ensures this is only ran once when component mounts initially.

  return (
    <BG type="main">
      <View className="flex-1">
        <View className="h-[132]" />
        {/* 상단 텍스트 및 로고 섹션 */}
        <View className="items-center">
          <CustomText
            type="body4"
            text="내일도 모레도,"
            className="text-gray300"
          />
          <CustomText
            type="body4"
            text="일상을 비추는 목소리"
            className="text-gray300"
          />
          {/* 로고 이미지 */}
          <Image
            source={require('@assets/pngs/logo/typo/typo_logo_white.png')}
            style={{ width: 200, height: 72, marginTop: 16 }}
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
            style={{ borderRadius: 7 }}
            onPress={() => {
              handleLogin({ loginType: 'KAKAO' });
              trackEvent('signup_start', { loginType: 'KAKAO' });
            }}>
            <KakaoIcon />
            <CustomText
              type="body3"
              text="카카오 로그인"
              className="ml-[9.39] font-[AppleSDGothicNeoR]"
              style={{ fontSize: 17.6 }}
            />
          </Pressable>
          <View className="h-[30]" />
          {/* 애플로 로그인 버튼 */}
          {/* TODO: 로그인 버튼 위치 조정 */}
          <AppleButton
            buttonStyle={AppleButton.Style.WHITE}
            buttonType={AppleButton.Type.SIGN_IN}
            style={{
              width: '100%',
              height: 52.8,
              borderRadius: 7,
            }}
            onPress={() => {
              handleAppleLogin();
              trackEvent('signup_start', { loginType: 'APPLE' });
            }}
          />
          <View className="h-[18.2]" />
          {/* 서비스이용약관, 개인정보처리방침 */}
          <View className="flex-row justify-center">
            <View className="flex-row justify-center">
              <CustomText
                type="caption2"
                text="계속 진행함에 따라 "
                className="text-gray300"
              />
              <Pressable
                onPress={() =>
                  Linking.openURL('https://www.naeilmorae.co.kr/terms')
                }>
                <CustomText
                  type="caption2"
                  text="이용약관"
                  className="text-white"
                />
              </Pressable>
              <CustomText type="caption2" text="과 " className="text-gray300" />
              <Pressable
                onPress={() =>
                  Linking.openURL('https://www.naeilmorae.co.kr/privacy')
                }>
                <CustomText
                  type="caption2"
                  text="개인정보 처리방침"
                  className="text-white"
                />
              </Pressable>
              <CustomText
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
