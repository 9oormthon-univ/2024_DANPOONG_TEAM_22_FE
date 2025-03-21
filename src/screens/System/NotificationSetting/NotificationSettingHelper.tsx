// React 관련 import
import { useEffect, useState } from "react";
import { View } from "react-native";

// Navigation 관련 import
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";

// Type 관련 import
import { SystemStackParamList } from "@type/nav/SystemStackParamList";

// Components 관련 import
import AppBar from "@components/atom/AppBar";
import BG from "@components/atom/BG";
import SystemButton from "@components/atom/SystemButton";
// API 관련 import
import { getMemberInfoHelper } from "@apis/SystemApis/getMemberInfoHelper";
import { postAlarmSettingToggle } from "@apis/SystemApis/postAlarm-settingToggleHelper";
const NotificationSettingHelper = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  
  // 알림 설정 켜짐 여부 배열
  const [isNotificationsOn, setIsNotificationsOn] = useState<boolean[]>([false, false]);

  // 헬퍼 정보 가져오기
  useEffect(() => {
    const fetchMemberInfo = async () => {
      const res = await getMemberInfoHelper();
      setIsNotificationsOn([res.welcomeReminder, res.thankYouMessage]);
    }
    fetchMemberInfo();
  }, []);

  return (
    <BG type="solid">
      <AppBar title="알림 설정" goBackCallbackFn={() => { navigation.goBack(); }} />
      <SystemButton
        title="청년들이 당신의 목소리를 기다려요!"
        sub="지금 눌러서 목소리 녹음하기"
        type="toggle"
        isOn={isNotificationsOn[0]}
        onPress={() => {
          postAlarmSettingToggle({ alarmCategory: 'WELCOME_REMINDER', enabled: !isNotificationsOn[0] });
          setIsNotificationsOn(prev => prev.map((_, index) => index === 0 ? !prev[0] : prev[index]));
        }}
      />
      <SystemButton
        title="청년들로부터 감사 편지가 도착했어요!"
        sub="지금 눌러서 확인하기"
        type="toggle"
        isOn={isNotificationsOn[1]}
        onPress={() => {
          postAlarmSettingToggle({ alarmCategory: 'THANK_YOU_MESSAGE', enabled: !isNotificationsOn[1] });
          setIsNotificationsOn(prev => prev.map((_, index) => index === 1 ? !prev[1] : prev[index]));
        }}
      />
    </BG>
  );
};

export default NotificationSettingHelper;
