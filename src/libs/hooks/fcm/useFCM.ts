import messaging from '@react-native-firebase/messaging';
import { navigationRef } from 'App';
import { useEffect } from 'react';
import { Alert } from 'react-native';

const useFCM = () => {
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  };

  const navigateToYouthListenScreen = ({
    alarmId,
    script,
  }: Readonly<{ alarmId: number; script: string }>) => {
    navigationRef.navigate('YouthStackNav', {
      screen: 'YouthListenScreen',
      params: {
        alarmId,
        script,
      },
    });
  };

  useEffect(() => {
    (async () => {
      const enabled = await requestUserPermission();

      if (!enabled) {
        console.log('Permission not granted');
        return;
      }

      messaging()
        .getToken()
        .then((token) => {
          console.log('FCM Token:', token);
        });

      // Check whether an initial notification is available
      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (!remoteMessage) return;

          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification
          );
          const data = remoteMessage.data as { alarmId: string };
          const notification = remoteMessage.notification as { body: string };
          navigateToYouthListenScreen({
            alarmId: Number(data.alarmId),
            script: notification.body,
          });
        });

      // Assume a message-notification contains a "type" property in the data payload of the screen to open
      messaging().onNotificationOpenedApp((remoteMessage) => {
        if (!remoteMessage) return;

        console.log(
          'Notification caused app to open from background state:',
          remoteMessage
        );
        const data = remoteMessage.data as { alarmId: string };
        const notification = remoteMessage.notification as { body: string };
        navigateToYouthListenScreen({
          alarmId: Number(data.alarmId),
          script: notification.body,
        });
      });

      // Register background handler
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        if (!remoteMessage) return;

        console.log('Message handled in the background!', remoteMessage);
        const data = remoteMessage.data as { alarmId: string };
        const notification = remoteMessage.notification as { body: string };
        navigateToYouthListenScreen({
          alarmId: Number(data.alarmId),
          script: notification.body,
        });
      });

      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        Alert.alert(
          'A new FCM message arrived!',
          JSON.stringify(remoteMessage)
        );
      });

      return unsubscribe;
    })();
  }, []);
};

export default useFCM;
