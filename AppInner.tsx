// 네비게이션 관련 라이브러리 및 타입 임포트
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '@type/nav/RootStackParamList';

// 네비게이션 스택 컴포넌트 임포트
import AuthStackNav from '@stackNav/Auth';
import YouthStackNav from '@stackNav/Youth';
import AppTabNav from './src/nav/tabNav/App';

// React 관련 임포트
import {useEffect, useState} from 'react';
import {Alert} from 'react-native';

// API 및 타입 임포트
import useGetMember from '@hooks/auth/useGetMember';
import SplashScreen from '@screens/Splash';
import {Role} from '@type/api/member';
import navigateToYouthListenScreen from '@utils/navigateToYouthListenScreen';
import navigateToYouthOnboardingScreen from '@utils/navigateToYouthOnboardingScreen';
import {navigationRef} from 'App';
import {default as RNSplashScreen} from 'react-native-splash-screen';

// 네비게이션 스택 생성
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppInner = () => {
  // 상태 관리
  const [isInitializing, setIsInitializing] = useState(true); // 초기 로딩 상태 추가
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [role, setRole] = useState<Role | null>(null); // 사용자 역할
  const [token, setToken] = useState<string | null>(null); // 액세스 토큰
  const {data: memberData, isError: isErrorMember} = useGetMember(token);
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  // 로그인 상태 및 사용자 정보 확인
  useEffect(() => {
    /**
     * react-native-splash-screen에서 제공하는 hide 함수를 사용해도 스택 쌓이는 게 보이는 문제가 있어서,
     * isInitializing 상태로 관리해서 페이지 이동 로직 전까지 스플래시 스크린 컴포넌트를 표시하도록 함.
     */
    (async () => {
      /** 로그아웃 테스트용 - 주석 해제해서 사용 */
      // await AsyncStorage.removeItem('accessToken');
      // await AsyncStorage.removeItem('role');

      const token = await AsyncStorage.getItem('accessToken');
      setIsLoggedIn(!!token);
      setToken(token);
      if (!token) {
        setIsInitializing(false); // 비로그인 상태에서도 스플래시 숨기기
        RNSplashScreen.hide();
      }
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', () => {
      setIsNavigationReady(true);
    });

    return unsubscribe;
  }, [navigationRef]);

  useEffect(() => {
    if (role === 'HELPER' || !isNavigationReady || !memberData) return;

    const isSignupAllCompleted =
      memberData?.result.youthMemberInfoDto?.latitude;
    if (!isSignupAllCompleted) {
      navigateToYouthOnboardingScreen(); // 네비게이션 준비 후 실행
    }
  }, [role, isNavigationReady, memberData]);

  useEffect(() => {
    if (!isErrorMember) return;
    Alert.alert('오류', '사용자 정보를 가져오는데 실패했어요');
    setIsInitializing(false); // 데이터 로드 완료 후 스플래시 숨기기
    RNSplashScreen.hide();
  }, [isErrorMember]);

  useEffect(() => {
    if (!memberData) return;
    setRole(memberData.result.role);
    setIsInitializing(false); // 데이터 로드 완료 후 스플래시 숨기기
    RNSplashScreen.hide();
  }, [memberData]);

  // 알람 처리 및 청년 리스닝 화면 이동
  useEffect(() => {
    if (!isLoggedIn || role === 'HELPER' || !isNavigationReady) return;

    (async () => {
      // 알람 관련 데이터 가져오기
      const alarmId = await AsyncStorage.getItem('alarmId');

      if (alarmId) {
        // 청년 리스닝 화면으로 이동
        navigateToYouthListenScreen({
          alarmId: Number(alarmId),
        });

        // 알람 데이터 삭제
        await AsyncStorage.removeItem('alarmId');
      }
    })();
  }, [isLoggedIn, role, isNavigationReady]);

  // 초기 로딩 중이면 스플래시 화면 유지
  if (isInitializing) {
    return <SplashScreen />;
  }

  // 네비게이션 스택 렌더링
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {isLoggedIn ? (
        // 로그인 상태일 때
        <Stack.Group>
          {role === 'HELPER' ? (
            // 헬퍼인 경우
            <Stack.Group>
              <Stack.Screen name="AppTabNav" component={AppTabNav} />
              <Stack.Screen name="AuthStackNav" component={AuthStackNav} />
            </Stack.Group>
          ) : (
            // 청년인 경우
            <Stack.Group>
              <Stack.Screen name="YouthStackNav" component={YouthStackNav} />
              <Stack.Screen name="AuthStackNav" component={AuthStackNav} />
            </Stack.Group>
          )}
        </Stack.Group>
      ) : (
        // 비로그인 상태일 때
        <Stack.Group>
          <Stack.Screen name="AuthStackNav" component={AuthStackNav} />
          <Stack.Screen name="AppTabNav" component={AppTabNav} />
          <Stack.Screen name="YouthStackNav" component={YouthStackNav} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default AppInner;
