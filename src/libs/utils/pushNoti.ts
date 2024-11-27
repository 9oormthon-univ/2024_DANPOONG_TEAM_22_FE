import notifee, {AndroidImportance} from '@notifee/react-native';

const displayNotification = async message => {
  const channelAnoucement = await notifee.createChannel({
    id: 'default',
    name: '내일모래',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title: message.title,
    body: message.body,
    android: {
      channelId: channelAnoucement,
      smallIcon: 'ic_launcher',
    },
  });
};

export default {
  displayNoti: remoteMessage => displayNotification(remoteMessage),
};
