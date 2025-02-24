/**
 * 앱의 메인 컴포넌트
 *
 * 주요 기능:
 * - 네비게이션 설정
 * - 푸시 알림 처리
 * - 쿼리 클라이언트 설정
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {
  createNavigationContainerRef,
  NavigationContainer,
  NavigationState,
} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {RootStackParamList} from '@type/nav/RootStackParamList';
import navigateToYouthListenScreen from '@utils/navigateToYouthListenScreen';
import pushNoti from '@utils/pushNoti';
import AppInner from 'AppInner';
import {useEffect, useRef, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {PortalProvider} from '@gorhom/portal';
import notifee, {EventType} from '@notifee/react-native';
import {trackAppStart, trackScreenView} from '@utils/tracker';

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

type RemoteMessageData = {alarmId: string};

function App(): React.JSX.Element {
  const routeNameRef = useRef<string | undefined>();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

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
      trackScreenView({screenName: currentRouteName});
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
        const {alarmId} = remoteMessage.data as RemoteMessageData;

        pushNoti.displayNotification({
          title: '내일모래',
          body:
            remoteMessage.notification?.title ?? '따뜻한 목소리가 도착했어요',
          data: {alarmId: Number(alarmId)},
        });
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

      notifee.onForegroundEvent(async ({type, detail}) => {
        console.log('notifee onForegroundEvent', type, detail);
        if (type === EventType.PRESS) {
          // 처리할 이벤트 추가
          console.log({
            data: detail.notification?.data,
            title: detail.notification?.title,
          });
        } else if (type === EventType.DISMISSED) {
          // noti 삭제
          notifee.cancelNotification(detail.notification?.id ?? '');
          notifee.cancelDisplayedNotification(detail.notification?.id ?? '');
        }
      });

      // 백그라운드에서 알림을 통해 앱이 실행된 경우
      messaging().onNotificationOpenedApp(remoteMessage => {
        (async () => {
          if (remoteMessage) {
            const {alarmId} = remoteMessage.data as RemoteMessageData;
            navigateToYouthListenScreen({
              alarmId: Number(alarmId),
            });
          }
        })();
      });

      notifee.onBackgroundEvent(async ({type, detail}) => {
        console.log('notifee onBackgroundEvent', type, detail);
        if (type === EventType.PRESS) {
          // 처리할 이벤트 추가
          console.log({
            data: detail.notification?.data,
            title: detail.notification?.title,
          });
        } else if (type === EventType.DISMISSED) {
          // noti 삭제
          notifee.cancelNotification(detail.notification?.id ?? '');
          notifee.cancelDisplayedNotification(detail.notification?.id ?? '');
        }
      });

      // 종료 상태에서 알림을 통해 앱이 실행된 경우
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          (async () => {
            if (remoteMessage) {
              const {alarmId} = remoteMessage.data as RemoteMessageData;
              // AsyncStorage에 알림 데이터 저장
              await AsyncStorage.setItem('alarmId', alarmId);
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
      <PortalProvider>
        <GestureHandlerRootView style={{flex: 1}}>
          <NavigationContainer
            ref={navigationRef}
            onStateChange={onStateChange}
            onReady={() => setIsNavigationReady(true)}>
            {isNavigationReady && <AppInner />}
          </NavigationContainer>
        </GestureHandlerRootView>
      </PortalProvider>
    </QueryClientProvider>
  );
}

export default App;
