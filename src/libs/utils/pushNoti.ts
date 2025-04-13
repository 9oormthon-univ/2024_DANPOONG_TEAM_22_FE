/**
 * 푸시 알림 관련 기능을 제공하는 모듈
 *
 * 설명:
 * 이 모듈은 앱 내 푸시 알림 표시, 알림 클릭 이벤트 처리 등의 기능을 제공합니다.
 */

import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { navigateToVolunteerHomeScreen } from '@utils/navigateToVolunteerHomeScreen';
import { navigateToYouthListenScreen } from '@utils/navigateToYouthListenScreen';
import { trackEvent } from '@utils/tracker';

export type RemoteMessageData = { alarmId: string };

/**
 * 푸시 알림을 화면에 표시하는 함수
 *
 * 입력:
 * @param {object} params - 알림 표시에 필요한 매개변수
 * @param {string} params.title - 알림 제목
 * @param {string} params.body - 알림 내용
 * @param {object} params.data - 알림 관련 데이터
 * @param {number} params.data.alarmId - 알람 ID
 *
 * 출력:
 * @returns {Promise<void>} - 알림 표시 작업 완료 Promise
 */
const displayNotification = async ({
  title,
  body,
  data,
}: Readonly<{ title: string; body: string; data: { alarmId?: number } }>) => {
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

/**
 * 포그라운드 상태에서 알림 이벤트를 처리하는 리스너
 *
 * 설명:
 * 알림 클릭 시 해당 화면으로 이동하고 이벤트를 추적합니다.
 * 알림 삭제 시 알림을 취소합니다.
 */
notifee.onForegroundEvent(({ type, detail }) => {
  console.log('notifee onForegroundEvent', { type, detail });

  if (type === EventType.PRESS) {
    if (!detail.notification) {
      return;
    }

    const { data } = detail.notification;
    const { alarmId } = data as { alarmId?: string };

    if (!alarmId) {
      // 봉사자 알림인 경우 - 홈으로 이동
      trackEvent('push_prefer', {
        entry_screen_name: 'VolunteerHomeScreen',
        title: detail.notification?.title ?? '',
      });

      navigateToVolunteerHomeScreen();

      return;
    }

    // 청년 알림인 경우 - 녹음듣기 화면으로 이동
    trackEvent('push_prefer', {
      entry_screen_name: 'YouthListenScreen',
      title: detail.notification?.title ?? '',
    });

    navigateToYouthListenScreen({
      alarmId: Number(alarmId),
    });
  } else if (type === EventType.DISMISSED) {
    // noti 삭제
    notifee.cancelNotification(detail.notification?.id ?? '');
    notifee.cancelDisplayedNotification(detail.notification?.id ?? '');
  }
});

/**
 * 백그라운드 상태에서 알림 이벤트를 처리하는 리스너
 *
 * 설명:
 * 백그라운드에서 발생하는 알림 이벤트를 처리합니다.
 */
notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('notifee onBackgroundEvent', { type, detail });
});

/**
 * 푸시 알림 관련 기능을 외부로 노출하는 객체
 */
export const pushNoti = {
  displayNotification,
};
