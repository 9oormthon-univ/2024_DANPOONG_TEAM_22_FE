// React 관련 import
import { useEffect, useState } from 'react';

// API 관련 import
import { postAlarmSettingToggleHelperByNotificationTypeAndBool } from '@apis/EditInformation/post/AlarmSettingToggleHelperByNotificationTypeAndBool/fetch';
import { getMemberInfoHelper } from '@apis/RetrieveMemberInformation/get/MemberInfoHelper/fetch';
// Components 관련 import
import { AppBar } from '@components/AppBar';
import { BG } from '@components/BG';
import { SystemButton } from '@components/SystemButton';
// Navigation 관련 import
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
// Type 관련 import
import type { SystemStackParamList } from '@type/nav/SystemStackParamList';

export const NotificationSettingHelper = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();

  // 알림 설정 켜짐 여부 배열
  const [isNotificationsOn, setIsNotificationsOn] = useState<boolean[]>([
    false,
    false,
  ]);

  // 헬퍼 정보 가져오기
  useEffect(() => {
    const fetchMemberInfo = async () => {
      const res = await getMemberInfoHelper();

      setIsNotificationsOn([res.welcomeReminder, res.thankYouMessage]);
    };

    fetchMemberInfo();
  }, []);

  return (
    <BG type="solid">
      <AppBar
        title="알림 설정"
        goBackCallbackFn={() => {
          navigation.goBack();
        }}
      />

      <SystemButton
        title="청년들이 당신의 목소리를 기다려요!"
        sub="지금 눌러서 목소리 녹음하기"
        type="toggle"
        isOn={isNotificationsOn[0]}
        onPress={() => {
          postAlarmSettingToggleHelperByNotificationTypeAndBool({
            alarmCategory: 'WELCOME_REMINDER',
            enabled: !isNotificationsOn[0],
          });
          setIsNotificationsOn(prev =>
            prev.map((_, index) => (index === 0 ? !prev[0] : prev[index])),
          );
        }}
      />
      <SystemButton
        title="청년들로부터 감사 편지가 도착했어요!"
        sub="지금 눌러서 확인하기"
        type="toggle"
        isOn={isNotificationsOn[1]}
        onPress={() => {
          postAlarmSettingToggleHelperByNotificationTypeAndBool({
            alarmCategory: 'THANK_YOU_MESSAGE',
            enabled: !isNotificationsOn[1],
          });
          setIsNotificationsOn(prev =>
            prev.map((_, index) => (index === 1 ? !prev[1] : prev[index])),
          );
        }}
      />
    </BG>
  );
};
