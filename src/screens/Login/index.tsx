import { useState } from 'react';
import { Image, Linking, Platform, Pressable, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { postAuthLoginWithAccessTokenAndLoginType } from '@apis/AuthenticationAPI/post/AuthLoginWithAccessTokenAndLoginType/fetch';
import { BG } from '@components/BG';
import { CustomText } from '@components/CustomText';
import { useGetMember } from '@hooks/auth/useGetMember';
import appleAuth from '@invertase/react-native-apple-authentication';
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

  /** 로그인 로직 처리를 위한 공통 함수 */
  const handleLogin = async ({
    token,
    loginType,
  }: {
    token: string;
    loginType: 'ANOYMOUS' | 'KAKAO' | 'APPLE';
  }) => {
    try {
      // iOS에서는 macAddress를 가져오는 것이 정책상 허용되지 않음
      const { result } = await postAuthLoginWithAccessTokenAndLoginType({
        accessToken:
          loginType === 'ANOYMOUS'
            ? DeviceInfo.getDeviceId() + (await DeviceInfo.getMacAddress())
            : token,
        loginType,
      });

      const {
        accessToken,
        refreshToken,
        memberId,
        role,
        infoRegistered,
        pushTimeRegistered,
        nickname,
      } = result;

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('memberId', String(memberId));

      if (role) {
        await AsyncStorage.setItem('role', role);
      }

      if (nickname) {
        await AsyncStorage.setItem('nickname', nickname);
      }

      setToken(accessToken);
      await refetchMember();

      if (!infoRegistered) {
        navigation.navigate('RoleSelectScreen');

        return;
      }

      if (role === 'HELPER') {
        navigation.navigate('AppTabNav');

        return;
      }

      if (role === 'YOUTH') {
        if (pushTimeRegistered) {
          navigation.navigate('YouthStackNav', { screen: 'YouthHomeScreen' });
        } else {
          navigation.navigate('YouthOnboardingScreen');
        }
      }
    } catch (error) {
      console.log('login error in handleLogin:', error);
    }
  };

  /** 카카오 로그인 */
  const handleLoginWithKakao = async () => {
    try {
      const token: KakaoOAuthToken = await login();

      await handleLogin({ token: token.accessToken, loginType: 'KAKAO' });

      const profile: KakaoProfile = await getProfile();

      await AsyncStorage.setItem('email', profile.email);
      await AsyncStorage.setItem('loginType', 'KAKAO');
    } catch (error) {
      console.error('login error:', error);
    }
  };

  /** 애플로 로그인 */
  const handleLoginWithApple = async () => {
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
      const { identityToken, email } = appleAuthRequestResponse;

      if (identityToken) {
        await handleLogin({ token: identityToken, loginType: 'APPLE' });
      }

      if (email) {
        await AsyncStorage.setItem('email', email);
      }

      await AsyncStorage.setItem('loginType', 'APPLE');
    }
  };

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
              trackEvent('signup_start', { loginType: 'KAKAO' });
              handleLoginWithKakao();
            }}>
            <KakaoIcon />
            <CustomText
              type="body3"
              text="카카오 로그인"
              className="ml-[9.39] font-[AppleSDGothicNeoR]"
              style={{ fontSize: 17.6 }}
            />
          </Pressable>
          {/* 애플로 로그인 버튼 */}
          {Platform.OS === 'ios' && (
            <>
              <View className="h-[18.2]" />
              <Pressable
                className="h-[52.8] bg-black justify-center items-center flex-row"
                style={{ borderRadius: 7 }}
                onPress={() => {
                  trackEvent('signup_start', { loginType: 'APPLE' });
                  handleLoginWithApple();
                }}>
                <Image
                  source={{
                    uri: 'https://ip-file-upload-test.s3.ap-northeast-2.amazonaws.com/assets/apple_logo_white_32.png',
                  }}
                  className="w-[21] h-[21]"
                  resizeMode="contain"
                />
                <CustomText
                  type="body3"
                  text="Apple로 로그인"
                  className="ml-[9.39] font-[AppleSDGothicNeoR] text-white"
                  style={{ fontSize: 17.6 }}
                />
              </Pressable>
            </>
          )}
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
