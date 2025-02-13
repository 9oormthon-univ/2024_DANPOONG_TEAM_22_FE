import AppBar from "@components/atom/AppBar";
import BG from "@components/atom/BG";
import SystemButton from "@components/atom/SystemButton";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { SystemStackParamList } from "@type/nav/SystemStackParamList";
const NotificationSettingScreen = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  const [NotiStateArray, setNotiStateArray] = useState<boolean[]>([true, false]);
  return <BG type="solid">
    <AppBar title="알림 설정" goBackCallbackFn={() => {navigation.goBack();}} />
    <SystemButton title="청년들이 당신의 목소리를 기다려요!" sub="지금 눌러서 목소리 녹음하기" onPress={() => {setNotiStateArray([!NotiStateArray[0], NotiStateArray[1]])}} type="toggle" isOn={NotiStateArray[0]} />
    <SystemButton title="청년들로부터 감사 편지가 도착했어요!" sub="지금 눌러서 확인하기" onPress={() => {setNotiStateArray([NotiStateArray[0], !NotiStateArray[1]])}} type="toggle" isOn={NotiStateArray[1]} />

  </BG>;
};

export default NotificationSettingScreen;
