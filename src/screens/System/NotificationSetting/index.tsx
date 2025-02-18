import AppBar from "@components/atom/AppBar";
import BG from "@components/atom/BG";
import SystemButton from "@components/atom/SystemButton";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { SystemStackParamList } from "@type/nav/SystemStackParamList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Pressable } from "react-native";
import Txt from "@components/atom/Txt";
import { COLORS } from "@constants/Colors";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { postAlarmSettingToggle, PostAlarmSettingToggleRequest } from "@apis/SystemApis/postAlarm-settingToggle";
type Notification = {
  id: string;
  title: string;
  sub: string;
  time: Date;
  isOn: boolean;
};

const NotificationSettingScreen = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [role, setRole] = useState('');
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    (async () => {
      const storedRole = await AsyncStorage.getItem('role');
      if (storedRole) setRole(storedRole);
    })();
  }, []);

  // NotiButton의 토글 상태 변경 함수
  const toggleNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(noti =>
        noti.id === id ? { ...noti, isOn: !noti.isOn } : noti
      )
    );
  };

  // NotiButton 클릭 시 해당 알림의 시간을 조정하기 위한 DateTimePicker 표시
  const handleNotiButtonPress = (id: string) => {
    setSelectedNotificationId(id);
    setShowTimePicker(true);
  };

  // DateTimePicker에서 시간 변경 시 호출되는 함수
  const onChangeTime = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate && selectedNotificationId) {
      setNotifications(prev =>
        prev.map(noti =>
          noti.id === selectedNotificationId ? { ...noti, time: selectedDate } : noti
        )
      );
      // 변경된 시간을 서버에 업데이트하는 API 요청 추가 가능
    }
    setSelectedNotificationId(null);
  };

  // 선택된 알림의 정보를 찾습니다.
  const selectedNotification = notifications.find(noti => noti.id === selectedNotificationId);

  return (
    <BG type="solid">
      <AppBar title="알림 설정" goBackCallbackFn={() => { navigation.goBack(); }} />
      {role !== 'HELPER' ? (
        <>
          <SystemButton
            title="청년들이 당신의 목소리를 기다려요!"
            sub="지금 눌러서 목소리 녹음하기"
            onPress={() => {}}
            type="toggle"
            isOn={true}
          />
          <SystemButton
            title="청년들로부터 감사 편지가 도착했어요!"
            sub="지금 눌러서 확인하기"
            onPress={() => {}}
            type="toggle"
            isOn={false}
          />
        </>
      ) : (
        <>      
        {[
          { sub: "기상" },
          { sub: "날씨" }, 
          { sub: "아침 식사" },
          { sub: "점심 식사" },
          { sub: "저녁 식사" },
          { sub: "취침" }
        ].map((item) => (
          <NotiButton
            key={item.sub}
            title="00시 00분"
            sub={item.sub}
            onPress={() => {}}
            isOn={false}
            setIsOn={() => {}}
          />
        ))}
        </>
      )}
      {/* 시간 변경용 DateTimePicker */}
      {showTimePicker && selectedNotification && (
        <DateTimePicker
          value={selectedNotification.time}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={onChangeTime}
        />
      )}
    </BG>
  );
};

const NotiButton = ({ title, sub, onPress, isOn, setIsOn }:
  { title: string, sub: string, onPress: () => void, isOn: boolean, setIsOn: () => void }) => {
  return (
    <Pressable
      className="w-full flex-row justify-between items-center px-px py-[21]"
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? COLORS.blue600 : 'transparent'
      })}
      android_ripple={{ color: COLORS.blue600 }}
    >
      <View className="flex-row justify-start items-end gap-x-[13]">
        <Txt type="title2" text={title} className="text-white" />
        <Txt type="button" text={sub} className="text-gray300" />
      </View>
      {/* 토글 UI */}
      <View
        className={`w-[51px] h-[29px] rounded-[89.5px] ${isOn ? 'bg-yellowPrimary' : 'bg-gray400'} justify-center px-[2px]`}
        onTouchEnd={(e) => { 
          e.stopPropagation();
          setIsOn(); 
        }}>
        <View
          className={`w-[25px] h-[25px] rounded-full bg-white transition-all duration-200 ${isOn ? 'ml-[22px]' : 'ml-0'}`}
        />
      </View>
    </Pressable>
  );
};

export default NotificationSettingScreen;
