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
import {getMember} from '@apis/member';
import {Role} from '@type/api/member';
import navigateToYouthListenScreen from '@utils/navigateToYouthListenScreen';
import SplashScreen from 'react-native-splash-screen';

// 네비게이션 스택 생성
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppInner = () => {
  // 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [role, setRole] = useState<Role | null>(null); // 사용자 역할
  const [isNavigationReady, setIsNavigationReady] = useState(false); // 네비게이션 준비 상태

  // 로그인 상태 및 사용자 정보 확인
  useEffect(() => {
    (async () => {
      try {
        // await AsyncStorage.removeItem('accessToken');
        // await AsyncStorage.removeItem('role');
        // await AsyncStorage.setItem('role', 'YOUTH');
        // await AsyncStorage.setItem('role', 'HELPER');
        console.log('role: ', await AsyncStorage.getItem('role'));
        const token = await AsyncStorage.getItem('accessToken');
        setIsLoggedIn(!!token);

        if (!token) {
          return;
        }

        // 사용자 정보 가져오기
        const {result} = await getMember();
        console.log('getMember(): ', result);
        setRole(result.role);
      } catch (error) {
        console.error(error);
        Alert.alert(
          '오류',
          `회원 정보를 불러오는 중 오류가 발생했어요\n${error}`,
        );
      }
    })();
  }, []);

  // 네비게이션 준비 상태 설정
  useEffect(() => {
    // console.log('isLoggedIn: ', isLoggedIn);
    // console.log('role: ', role);
    if (isLoggedIn && role) {
      setIsNavigationReady(true);
    }
  }, [isLoggedIn, role]);

  // 스플래시 스크린 숨기기
  useEffect(() => {
    SplashScreen.hide();
    // if (isNavigationReady && role) {
    //   SplashScreen.hide();
    // }
  }, [isNavigationReady, role]);

  // 알람 처리 및 청년 리스닝 화면 이동
  useEffect(() => {
    if (!isNavigationReady || role === 'HELPER') {
      return;
    }

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
  }, [isNavigationReady, role]);

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
            <Stack.Screen name="AppTabNav" component={AppTabNav} />
          ) : (
            // 청년인 경우
            <Stack.Screen name="YouthStackNav" component={YouthStackNav} />
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
