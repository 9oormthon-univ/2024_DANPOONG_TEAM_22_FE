/**
 * 앱의 메인 컴포넌트
 *
 * 주요 기능:
 * - 네비게이션 설정
 * - 푸시 알림 처리
 * - 쿼리 클라이언트 설정
 */

import { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { CustomToast } from '@components/CustomToast';
import { PortalProvider } from '@gorhom/portal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {
  createNavigationContainerRef,
  NavigationContainer,
  type NavigationState,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type Role } from '@type/api/common';
import { type RootStackParamList } from '@type/nav/RootStackParamList';
import { navigateToVolunteerHomeScreen } from '@utils/navigateToVolunteerHomeScreen';
import { navigateToYouthListenScreen } from '@utils/navigateToYouthListenScreen';
import { pushNoti, type RemoteMessageData } from '@utils/pushNoti';
import { trackAppStart, trackEvent, trackScreenView } from '@utils/tracker';
import { AppInner } from 'AppInner';

// 쿼리 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30초 동안 데이터를 신선한 상태로 유지
    },
  },
});

const DEFAULT_YOUTH_ALARM_TITLE = '따뜻한 목소리가 도착했어요!';
const DEFAULT_VOLUNTEER_ALARM_TITLE = '청년들이 당신의 목소리를 기다려요!';

// 네비게이션 참조 생성
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function App(): React.JSX.Element {
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
      trackScreenView({ screenName: currentRouteName });
    }

    routeNameRef.current = currentRouteName;
  };

  // 포그라운드 상태에서 푸시 알림 처리
  useEffect(() => {
    (async () => {
      const role = (await AsyncStorage.getItem('role')) as Role;

      const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('Foreground Push in App', remoteMessage);

        const { alarmId } = remoteMessage.data as RemoteMessageData;

        const isYouthAlarm = role === 'YOUTH' && alarmId;
        const isVolunteerAlarm = role === 'HELPER' && !alarmId;

        if (isYouthAlarm) {
          pushNoti.displayNotification({
            title: '내일모래',
            body:
              remoteMessage.notification?.title ?? DEFAULT_YOUTH_ALARM_TITLE,
            data: { alarmId: Number(alarmId) },
          });

          return;
        }

        if (isVolunteerAlarm) {
          pushNoti.displayNotification({
            title: '내일모래',
            body:
              remoteMessage.notification?.title ??
              DEFAULT_VOLUNTEER_ALARM_TITLE,
            data: {},
          });
        }
      });

      return unsubscribe;
    })();
  }, []);

  // 앱 초기화 및 푸시 알림 설정
  useEffect(() => {
    (async () => {
      const role = (await AsyncStorage.getItem('role')) as Role;

      requestUserPermission();

      // 백그라운드에서 알림을 통해 앱이 실행된 경우
      messaging().onNotificationOpenedApp(remoteMessage => {
        (async () => {
          if (remoteMessage) {
            console.log('Background Push in App', remoteMessage);

            const { alarmId } = remoteMessage.data as RemoteMessageData;

            const isYouthAlarm = role === 'YOUTH' && alarmId;
            const isVolunteerAlarm = role === 'HELPER' && !alarmId;

            if (isYouthAlarm) {
              trackEvent('push_prefer', {
                entry_screen_name: 'YouthListenScreen',
                title: remoteMessage.notification?.title ?? '',
              });

              navigateToYouthListenScreen({
                alarmId: Number(alarmId),
              });

              return;
            }

            if (isVolunteerAlarm) {
              trackEvent('push_prefer', {
                entry_screen_name: 'VolunteerHomeScreen',
                title: remoteMessage.notification?.title ?? '',
              });

              navigateToVolunteerHomeScreen();
            }
          }
        })();
      });

      // 종료 상태에서 알림을 통해 앱이 실행된 경우
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          (async () => {
            if (remoteMessage) {
              console.log('Quit Push in App', remoteMessage);

              const { alarmId } = remoteMessage.data as RemoteMessageData;

              const isYouthAlarm = role === 'YOUTH' && alarmId;
              const isVolunteerAlarm = role === 'HELPER' && !alarmId;

              if (isYouthAlarm) {
                // AsyncStorage에 알림 데이터 저장
                await AsyncStorage.setItem('alarmId', alarmId);
                await AsyncStorage.setItem(
                  'alarmTitle',
                  remoteMessage.notification?.title ??
                    DEFAULT_YOUTH_ALARM_TITLE,
                );

                return;
              }

              if (isVolunteerAlarm) {
                // AsyncStorage에 alarmTitle 만 저장
                await AsyncStorage.setItem(
                  'alarmTitle',
                  remoteMessage.notification?.title ??
                    DEFAULT_VOLUNTEER_ALARM_TITLE,
                );
              }
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
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer
            ref={navigationRef}
            onStateChange={onStateChange}
            onReady={() => setIsNavigationReady(true)}>
            {isNavigationReady && <AppInner />}
            <Toast
              config={{ custom: CustomToast }}
              topOffset={0}
              bottomOffset={0}
            />
          </NavigationContainer>
        </GestureHandlerRootView>
      </PortalProvider>
    </QueryClientProvider>
  );
}
