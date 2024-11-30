/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import AppInner, {navigateToYouthListenScreen} from 'AppInner';
import {RootStackParamList} from '@type/nav/RootStackParamList';
import messaging from '@react-native-firebase/messaging';
import {useEffect} from 'react';
import pushNoti from '@utils/pushNoti';
import AsyncStorage from '@react-native-async-storage/async-storage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
    },
  },
});

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

function App(): React.JSX.Element {
  useEffect(() => {
    // Foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground', remoteMessage);
      pushNoti.displayNoti(remoteMessage);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    requestUserPermission();

    // Quit -> Foreground : Check if the app was opened from a notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const {alarmId, script} = remoteMessage.data;
          // navigateToYouthListenScreen({
          //   alarmId: Number(alarmId),
          //   script: script,
          // });
          (async () => {
            await AsyncStorage.setItem('alarmId', alarmId);
            await AsyncStorage.setItem('script', script);
          })();
        }
      });

    // Background -> Foreground : Check if the app was opened from a notification
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        const {alarmId, script} = remoteMessage.data;
        navigateToYouthListenScreen({
          alarmId: Number(alarmId),
          script: script,
        });
      }
    });
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      return getToken();
    }
  };

  const getToken = async () => {
    const fcmToken = await messaging().getToken();
    console.log('디바이스 토큰값', fcmToken);
    await AsyncStorage.setItem('fcmToken', fcmToken);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer ref={navigationRef}>
          <AppInner />
        </NavigationContainer>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

export default App;
