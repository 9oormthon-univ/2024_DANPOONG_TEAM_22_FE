/**
 * 앱의 메인 컴포넌트
 *
 * 주요 기능:
 * - 네비게이션 설정
 * - 푸시 알림 처리
 * - 쿼리 클라이언트 설정
 */

import messaging from '@react-native-firebase/messaging';
import {
  createNavigationContainerRef,
  NavigationContainer,
  NavigationState,
} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {RootStackParamList} from '@type/nav/RootStackParamList';
import AppInner, {navigateToYouthListenScreen} from 'AppInner';
import {useEffect, useRef} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
// import pushNoti from '@utils/pushNoti';
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import {trackAppStart, trackScreenView} from '@utils/gtmTracker';
import {StatusBar} from 'react-native';

// 쿼리 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30초 동안 데이터를 신선한 상태로 유지
    },
  },
});

// 네비게이션 참조 생성
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

function App(): React.JSX.Element {
  const routeNameRef = useRef<string | undefined>();

  // GTM 초기화
  useEffect(() => {
    trackAppStart();
  }, []);

  // GA 트래킹 설정
  useEffect(() => {
    const state = navigationRef.current?.getRootState();
    if (state) {
      routeNameRef.current = getActiveRouteName(state);
    }
  }, []);

  const getActiveRouteName = (state: NavigationState) => {
    const route = state.routes[state.index];
    if (route.state) {
      return getActiveRouteName(route.state as NavigationState);
    }
    return route.name;
  };

  const onStateChange = async (state: NavigationState | undefined) => {
    if (state === undefined) return;
    const previousRouteName = routeNameRef.current;
    const currentRouteName = getActiveRouteName(state);

    if (previousRouteName !== currentRouteName) {
      // Google Analytics에 스크린 전송
      trackScreenView(currentRouteName);
    }

    routeNameRef.current = currentRouteName;
  };

  // 포그라운드 상태에서 푸시 알림 처리
  useEffect(() => {
    (async () => {
      const role = await AsyncStorage.getItem('role');
      if (role !== 'YOUTH') {
        return;
      }

      const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('Foreground', remoteMessage);
        // pushNoti.displayNoti(remoteMessage);
      });

      return unsubscribe;
    })();
  }, []);

  // 앱 초기화 및 푸시 알림 설정
  useEffect(() => {
    (async () => {
      const role = await AsyncStorage.getItem('role');
      if (role !== 'YOUTH') {
        return;
      }

      requestUserPermission();

      // 종료 상태에서 알림을 통해 앱이 실행된 경우
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          (async () => {
            if (remoteMessage) {
              const {alarmId} = remoteMessage.data;
              // AsyncStorage에 알림 데이터 저장
              await AsyncStorage.setItem('alarmId', alarmId);
            }
          })();
        });

      // 백그라운드에서 알림을 통해 앱이 실행된 경우
      messaging().onNotificationOpenedApp(remoteMessage => {
        (async () => {
          if (remoteMessage) {
            const {alarmId} = remoteMessage.data;
            navigateToYouthListenScreen({
              alarmId: Number(alarmId),
            });
          }
        })();
      });
    })();
  }, []);

  //푸시 알림 권한 요청 함수
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      return getToken();
    }
  };

  /**
   * FCM 토큰 가져오기 및 저장
   */
  const getToken = async () => {
    const fcmToken = await messaging().getToken();
    console.log('디바이스 토큰값', fcmToken);
    await AsyncStorage.setItem('fcmToken', fcmToken);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer ref={navigationRef} onStateChange={onStateChange}>
          <StatusBar
            translucent={true}
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <AppInner />
        </NavigationContainer>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

export default App;
