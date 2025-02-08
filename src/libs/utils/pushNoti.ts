import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import navigateToYouthListenScreen from '@utils/navigateToYouthListenScreen';

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
  console.log({type, detail});
  if (type === EventType.PRESS) {
    const {data} = detail.notification;
    const {alarmId} = data;
    if (!alarmId) return;

    navigateToYouthListenScreen({
      alarmId: Number(alarmId),
    });
  }
});

export default {
  displayNotification,
};
