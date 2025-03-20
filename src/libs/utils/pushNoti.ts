import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {navigateToYouthListenScreen} from '@utils/navigateToYouthListenScreen';
import {trackEvent} from '@utils/tracker';

export type RemoteMessageData = {alarmId: string};

const displayNotification = async ({
  title,
  body,
  data,
}: Readonly<{title: string; body: string; data: {alarmId: number}}>) => {
  const channelAnoucement = await notifee.createChannel({
    id: 'default',
    name: '내일모래',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: channelAnoucement,
      // smallIcon: 'ic_launcher',
      largeIcon: 'ic_launcher',
      circularLargeIcon: true,
      color: '#555555',
    },
    data,
  });
};

// 포그라운드 알림 클릭 이벤트 처리
notifee.onForegroundEvent(({type, detail}) => {
  console.log('notifee onForegroundEvent', {type, detail});
  if (type === EventType.PRESS) {
    if (!detail.notification) {
      return;
    }
    const {data} = detail.notification;
    const {alarmId} = data as {alarmId: string};
    if (!alarmId) return;

    navigateToYouthListenScreen({
      alarmId: Number(alarmId),
    });
    trackEvent('push_prefer', {
      entry_screen_name: 'YouthListenScreen',
      title: detail.notification?.title ?? '',
    });
  } else if (type === EventType.DISMISSED) {
    // noti 삭제
    notifee.cancelNotification(detail.notification?.id ?? '');
    notifee.cancelDisplayedNotification(detail.notification?.id ?? '');
  }
});

// 백그라운드 알림 클릭 이벤트 처리
notifee.onBackgroundEvent(async ({type, detail}) => {
  console.log('notifee onBackgroundEvent', {type, detail});
});

export const pushNoti = {
  displayNotification,
};
