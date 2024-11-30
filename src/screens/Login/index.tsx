import {postLogin} from '@apis/auth';
import BG from '@components/atom/BG';
import Txt from '@components/atom/Txt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KakaoOAuthToken, login} from '@react-native-seoul/kakao-login';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {Image, Pressable, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import KakaoIcon from '@assets/svgs/kakao.svg';

type AuthProps = NativeStackScreenProps<AuthStackParamList, 'LoginScreen'>;

const LoginScreen = ({navigation}: Readonly<AuthProps>) => {
  const handleKakaoLogin = async () => {
    try {
      const token: KakaoOAuthToken = await login();

      const {result} = await postLogin({
        accessToken: token.accessToken,
        loginType: 'KAKAO',
      });

      const {accessToken, refreshToken, memberId, serviceMember} = result;
      console.log('serviceMember', serviceMember);

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('memberId', String(memberId));

      navigation.navigate('NicknameWriteScreen');
    } catch (error) {
      console.error('Kakao login error:', error);
    }
  };

  const handleUseWithoutLogin = () => {
    console.log('Use without login');
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <BG type="main">
        <View className="flex-1">
          <View className="items-center pt-[165]">
            <Txt type="body4" text="내일도 모레도," className="text-gray300" />
            <Txt
              type="body4"
              text="일상을 비추는 목소리"
              className="text-gray300"
            />
            <Image
              source={require('../../../assets/pngs/logo/typo/typo_logo_white.png')}
              style={{width: 200, height: 72, marginTop: 16}}
            />
          </View>
          <Image
            source={require('../../../assets/pngs/background/background1.png')}
            className="w-full h-auto flex-1"
          />
          <View className="absolute left-0 bottom-[72] w-full px-[40]">
            <Pressable
              className="h-[52.8] bg-[#FEE500] justify-center items-center flex-row"
              style={{borderRadius: 7}}
              onPress={handleKakaoLogin}>
              <KakaoIcon />
              <Txt
                type="body3"
                text="카카오 로그인"
                className="ml-[9.39] font-sb"
              />
            </Pressable>
            <Pressable onPress={handleUseWithoutLogin}>
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
