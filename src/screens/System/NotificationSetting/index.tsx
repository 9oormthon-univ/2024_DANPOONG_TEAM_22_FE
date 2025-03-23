// React 관련 import
import { useEffect, useState } from "react";
// Storage 관련 import
import AsyncStorage from "@react-native-async-storage/async-storage";
// Components 관련 import
import { NotificationSettingHelper } from "./NotificationSettingHelper";
import { NotificationSettingYouth } from "./NotificationSettingYouth";

export const NotificationSettingScreen = () => {
  const [role, setRole] = useState('YOUTH');

  // 역할 가져오기
  useEffect(() => {
    (async () => {
      const storedRole = await AsyncStorage.getItem('role');
      if (storedRole) setRole(storedRole);
    })();
  }, []);

  return role === 'HELPER' ? (
    <NotificationSettingHelper />
  ) : (
    <NotificationSettingYouth />
  );
};
