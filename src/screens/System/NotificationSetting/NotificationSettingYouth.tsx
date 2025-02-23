// React 관련 import
import { useEffect, useState } from "react";
import { View, Pressable } from "react-native";

// Navigation 관련 import
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";

// Type, Constants 관련 import
import { SystemStackParamList } from "@type/nav/SystemStackParamList";
import { COLORS } from "@constants/Colors";

// Components 관련 import
import AppBar from "@components/atom/AppBar";
import BG from "@components/atom/BG";
import Txt from "@components/atom/Txt";
import TimeSelectBottomSheet from "@components/atom/TimeSelectBottomSheet";
import ToggleSwitch from "@components/atom/ToggleSwitch";
// API 관련 import
import { getMemberInfoYouth } from "@apis/SystemApis/getMemberInfoYouth";
import { postAlarmSettingToggle } from "@apis/SystemApis/postAlarm-settingToggle";

const NotificationSettingYouth = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  
  // 알림 설정 켜짐 여부, 시간, 분 배열
  const [isNotificationsOn, setIsNotificationsOn] = useState<boolean[]>([false, false, false, false, false, false]);
  const [notificationsHours, setNotificationsHours] = useState<string[]>(['오전 00시', '오전 00시', '오전 00시', '오전 00시', '오전 00시', '오전 00시']);
  const [notificationsMinutes, setNotificationsMinutes] = useState<string[]>(['00분', '00분', '00분', '00분', '00분', '00분']);
  
  // 알림 설정 시간 선택 모달
  const [showHourBottomSheet, setShowHourBottomSheet] = useState(false);
  const [showMinuteBottomSheet, setShowMinuteBottomSheet] = useState(false);
  const [hour, setHour] = useState('오전 00시');
  const [minute, setMinute] = useState('00분');
  const [index, setIndex] = useState<number | undefined>(undefined);

  const notiTimeHandler = (index: number) => {
    setShowHourBottomSheet(true);
    setIndex(index);
  };

  // 알림 설정 시간 선택 모달 종료 시 시간 설정
  useEffect(() => {
    if(!showMinuteBottomSheet && index !== undefined){
      setNotificationsHours(prev => prev.map((time, i) => i === index ? `${hour}` : time));
      setNotificationsMinutes(prev => prev.map((time, i) => i === index ? `${minute}` : time));
    }
  }, [showMinuteBottomSheet]);

  useEffect(() => {
    const fetchMemberInfo = async () => {
      const res = await getMemberInfoYouth();
      
      // 알림 설정 상태 업데이트
      setIsNotificationsOn([
        res.wakeUpAlarm,
        res.outgoingAlarm,
        res.breakfastAlarm, 
        res.lunchAlarm,
        res.dinnerAlarm,
        res.sleepAlarm
      ]);

      // 시간 설정 업데이트
      setNotificationsHours([
        `${res.wakeUpTime.hour < 12 ? '오전' : '오후'} ${res.wakeUpTime.hour % 12 || 12}시`,
        `${res.outgoingTime.hour < 12 ? '오전' : '오후'} ${res.outgoingTime.hour % 12 || 12}시`,
        `${res.breakfast.hour < 12 ? '오전' : '오후'} ${res.breakfast.hour % 12 || 12}시`,
        `${res.lunch.hour < 12 ? '오전' : '오후'} ${res.lunch.hour % 12 || 12}시`, 
        `${res.dinner.hour < 12 ? '오전' : '오후'} ${res.dinner.hour % 12 || 12}시`,
        `${res.sleepTime.hour < 12 ? '오전' : '오후'} ${res.sleepTime.hour % 12 || 12}시`
      ]);

      // 분 설정 업데이트 
      setNotificationsMinutes([
        `${String(res.wakeUpTime.minute).padStart(2, '0')}분`,
        `${String(res.outgoingTime.minute).padStart(2, '0')}분`,
        `${String(res.breakfast.minute).padStart(2, '0')}분`,
        `${String(res.lunch.minute).padStart(2, '0')}분`,
        `${String(res.dinner.minute).padStart(2, '0')}분`, 
        `${String(res.sleepTime.minute).padStart(2, '0')}분`
      ]);
    };
    fetchMemberInfo();
  }, []);

  return (
    <BG type="solid">
      <AppBar title="알림 설정" goBackCallbackFn={() => { navigation.goBack(); }} />
      {/* 알림 설정 버튼 목록 */}
      {[
        { sub: "기상" },
        { sub: "날씨" }, 
        { sub: "아침 식사" },
        { sub: "점심 식사" },
        { sub: "저녁 식사" },
        { sub: "취침" }
      ].map((item,i) => (
        <NotiButton
          key={item.sub}
          title={notificationsHours[i] + ' ' + notificationsMinutes[i]}
          sub={item.sub}
          onPress={() => {notiTimeHandler(i)}}
          isOn={isNotificationsOn[i]}
          setIsOn={() => {setIsNotificationsOn(prev => prev.map((_, index) => index === i ? !prev[i] : prev[index]));}}
        />
      ))}

      {showHourBottomSheet && (
        <TimeSelectBottomSheet
          type="hour"
          value={'오전 12시'}
          setValue={setHour}
          onClose={() => setShowHourBottomSheet(false)}
          onSelect={() => setShowMinuteBottomSheet(true)}
        />
      )}

      {showMinuteBottomSheet && (
        <TimeSelectBottomSheet
          type="minute"
          value={'00'}
          setValue={setMinute}
          onClose={() => setShowMinuteBottomSheet(false)}
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
        <Txt type="title3" text={title} className="text-white" />
        <Txt type="button" text={sub} className="text-gray300" />
      </View>
      <ToggleSwitch isOn={isOn} onToggle={setIsOn} />
    </Pressable>
  );
};

export default NotificationSettingYouth;
