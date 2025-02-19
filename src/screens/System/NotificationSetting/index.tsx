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
import TimeSelectBottomSheet from "@components/atom/TimeSelectBottomSheet";
import ToggleSwitch from "@components/atom/ToggleSwitch";


const NotificationSettingScreen = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  const [role, setRole] = useState('YOUTH');
  // 알림 설정 켜짐 여부 , 시간, 분 배열
  const [isNotificationsOn, setIsNotificationsOn] = useState<boolean[]>(role === 'HELPER' ? [false, false] : [false, false, false, false, false, false]);
  const [notificationsHours, setNotificationsHours] = useState<string[]>(role === 'HELPER' ? ['오전 00시', '오전 00시'] : ['오전 00시', '오전 00시', '오전 00시', '오전 00시', '오전 00시', '오전 00시']);
  const [notificationsMinutes, setNotificationsMinutes] = useState<string[]>(role === 'HELPER' ? ['00분', '00분'] : ['00분', '00분', '00분', '00분', '00분', '00분']);
  // 알림 설정 시간 선택 모달
  const [showHourBottomSheet, setShowHourBottomSheet] = useState(false);
  const [showMinuteBottomSheet, setShowMinuteBottomSheet] = useState(false);
  const [hour, setHour] = useState('오전 00시');
  const [minute, setMinute] = useState('00분');
  const [index, setIndex] = useState<number | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const storedRole = await AsyncStorage.getItem('role');
      if (storedRole) setRole('YOUTH') 
        // setRole(storedRole);
    })();
    // 여기 밑에 초기화 하는 부분 api받아서 처리 할 예정
    if(role === 'HELPER'){
      setNotificationsHours(['오전 00시', '오전 00시']);
      setNotificationsMinutes(['00분', '00분']);
      setIsNotificationsOn([false, false]);
    }else{
      setNotificationsHours(['오전 00시', '오전 00시', '오전 00시', '오전 00시', '오전 00시', '오전 00시']);
      setNotificationsMinutes(['00분', '00분', '00분', '00분', '00분', '00분']);
      setIsNotificationsOn([false, false, false, false, false, false]);
    }
  }, []);

  const notiTimeHandler = (index: number) => {
    setShowHourBottomSheet(true);
    setIndex(index);
  };

  useEffect(() => {
    if(!showMinuteBottomSheet && index !== undefined){
      setNotificationsHours(prev => prev.map((time, i) => i === index ? `${hour}` : time));
      setNotificationsMinutes(prev => prev.map((time, i) => i === index ? `${minute}` : time));
    }
  }, [showMinuteBottomSheet]);

  return (
    <BG type="solid">
      <AppBar title="알림 설정" goBackCallbackFn={() => { navigation.goBack(); }} />
      {role === 'HELPER' ? (
        <>
          <SystemButton
            title="청년들이 당신의 목소리를 기다려요!"
            sub="지금 눌러서 목소리 녹음하기"
            type="toggle"
            isOn={isNotificationsOn[0]}
            onPress={() => {setIsNotificationsOn(prev => prev.map((_, index) => index === 0 ? !prev[0] : prev[index]));}}
          />
          <SystemButton
            title="청년들로부터 감사 편지가 도착했어요!"
            sub="지금 눌러서 확인하기"
            type="toggle"
            isOn={isNotificationsOn[1]}
            onPress={() => {setIsNotificationsOn(prev => prev.map((_, index) => index === 1 ? !prev[1] : prev[index]));}}
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
        </>
      )}
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
      {/* 토글 UI */}
      <ToggleSwitch isOn={isOn} onToggle={setIsOn} />
    </Pressable>
  );
};

export default NotificationSettingScreen;
