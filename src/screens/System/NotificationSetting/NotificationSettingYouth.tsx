// React 관련 import
import React, { useEffect, useState } from "react";
import { View, Pressable } from "react-native";

// Navigation 관련 import
import { useNavigation, NavigationProp } from "@react-navigation/native";

// Type, Constants 관련 import
import { SystemStackParamList } from "@type/nav/SystemStackParamList";
import { COLORS } from "@constants/Colors";

// Components 관련 import
import {AppBar} from "@components/AppBar";
import {BG} from "@components/BG";
import {Text} from "@components/CostumText";
import {TimeSelectBottomSheet} from "@components/TimeSelectBottomSheet";
import {ToggleSwitch} from "@components/ToggleSwitch";
// API 관련 import
import { getMemberInfoYouth, GetMemberInfoYouthResponse} from "@apis/SystemApis/getMemberInfoYouth";
import { postAlarmSettingToggle ,PostAlarmSettingToggleRequest} from "@apis/SystemApis/postAlarm-settingToggle";
import { patchMemberInfoYouth , PatchMemberInfoYouthRequest} from "@apis/SystemApis/patchMemberInfoYouth";
import { convertTimeFormat } from "@utils/convertFuncs";
import { parseTimeString } from "@utils/parseTimeString";

type MemberInfoYouthResponse = GetMemberInfoYouthResponse['result']
type AlarmCategory = PostAlarmSettingToggleRequest['alarmCategory']

// 알림 설정에 대한 기본 인터페이스 정의
type NotificationSetting ={
  sub: string;                // 알림 제목 (예: 기상, 취침 등)
  alarmCategory: AlarmCategory; // 알림 카테고리 (API 요청용)  'WAKE_UP' | 'GO_OUT' | 'MEAL_BREAKFAST' | 'MEAL_LUNCH' | 'MEAL_DINNER' | 'SLEEP'
  isOn: boolean;             // 현재 알림 활성화 상태
  hour: string;              // 현재 설정된 시간
  minute: string;            // 현재 설정된 분
  initialIsOn: boolean;      // 초기 알림 활성화 상태 (변경 감지용)
  initialHour: string;       // 초기 설정 시간 (변경 감지용)
  initialMinute: string;     // 초기 설정 분 (변경 감지용)
}

// 알림 설정 구성을 위한 인터페이스
type NotificationConfig ={
  sub: string;               // 알림 제목
  alarmCategory: AlarmCategory; // API 요청시 사용할 알림 카테고리
  timeField: keyof Omit<MemberInfoYouthResponse, "wakeUpAlarm" | "sleepAlarm" | "breakfastAlarm" | "lunchAlarm" | "dinnerAlarm" | "outgoingAlarm">; // API 응답에서 시간 정보를 가져올 키
  alarmField: keyof Omit<MemberInfoYouthResponse, "wakeUpTime" | "sleepTime" | "breakfast" | "lunch" | "dinner" | "outgoingTime">; // API 응답에서 알림 활성화 상태를 가져올 키
}

// 알림 설정 목록 정의
const notificationsConfig: NotificationConfig[] = [
  { sub: "기상", alarmCategory: "WAKE_UP", timeField: "wakeUpTime", alarmField: "wakeUpAlarm" },
  { sub: "날씨", alarmCategory: "GO_OUT", timeField: "outgoingTime", alarmField: "outgoingAlarm" },
  { sub: "아침 식사", alarmCategory: "MEAL_BREAKFAST", timeField: "breakfast", alarmField: "breakfastAlarm" },
  { sub: "점심 식사", alarmCategory: "MEAL_LUNCH", timeField: "lunch", alarmField: "lunchAlarm" },
  { sub: "저녁 식사", alarmCategory: "MEAL_DINNER", timeField: "dinner", alarmField: "dinnerAlarm" },
  { sub: "취침", alarmCategory: "SLEEP", timeField: "sleepTime", alarmField: "sleepAlarm" },
];

// 알림 설정 화면 컴포넌트
export const NotificationSettingYouth = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  const [notifications, setNotifications] = useState<NotificationSetting[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 모달 관련 임시 상태
  const [showHourBottomSheet, setShowHourBottomSheet] = useState(false);
  const [showMinuteBottomSheet, setShowMinuteBottomSheet] = useState(false);
  const [tempHour, setTempHour] = useState("오전 00시");
  const [tempMinute, setTempMinute] = useState("00분");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // API에서 정보를 가져와 notifications 상태를 세팅합니다.
  const fetchMemberInfo = async () => {
    const res = await getMemberInfoYouth();

    const fetchedNotifications = notificationsConfig.map((config) => {
      const parsedTime = parseTimeString(res[config.timeField]);
      const formattedHour = `${parsedTime.hour < 12 ? "오전" : "오후"} ${parsedTime.hour % 12 || 12}시`;
      const formattedMinute = `${String(parsedTime.minute).padStart(2, "0")}분`;
      return {
        sub: config.sub,
        alarmCategory: config.alarmCategory,
        isOn: res[config.alarmField],
        hour: formattedHour,
        minute: formattedMinute,
        initialIsOn: res[config.alarmField],
        initialHour: formattedHour,
        initialMinute: formattedMinute,
      };
    });
    setNotifications(fetchedNotifications);
  };

  useEffect(() => {
    fetchMemberInfo();
  }, []);

  // 모달에서 시간 선택 후 값 업데이트
  useEffect(() => {
    if (!showMinuteBottomSheet) {
      setNotifications((prev) =>
        prev.map((notif, i) =>
          i === selectedIndex ? { ...notif, hour: tempHour, minute: tempMinute } : notif
        )
      );
    }
  }, [showMinuteBottomSheet]);

  // 상태 변경 여부 체크
  const isStateChanged = () => {
    return notifications.some(
      (notif) =>
        notif.isOn !== notif.initialIsOn ||
        notif.hour !== notif.initialHour ||
        notif.minute !== notif.initialMinute
    );
  };

  // 저장 버튼 클릭 시 API 호출
  const confirmCallbackFn = async () => {
    if (!isStateChanged()) return;
    setIsLoading(true);
    try {
      // Promise.all 대신 순차적으로 처리
      for (const notif of notifications) {
        await postAlarmSettingToggle({
          alarmCategory: notif.alarmCategory,
          enabled: notif.isOn,
        });
      }
      
      // patchMemberInfoYouth 함수는 모든 키가 포함된 객체를 요구합니다.
      const patchData: PatchMemberInfoYouthRequest = {
        wakeUpTime: "",
        sleepTime: "",
        breakfast: "",
        lunch: "",
        dinner: "",
        outgoingTime: "",
      };
      notificationsConfig.forEach((config, index) => {
        patchData[config.timeField] = convertTimeFormat(
          notifications[index].hour,
          notifications[index].minute
        );
      });
      await patchMemberInfoYouth(patchData);
      navigation.goBack();
    } catch (error) {
      console.error("알림 설정 저장 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 모달을 통해 특정 알림 시간 변경
  const notiTimeHandler = (index: number) => {
    setSelectedIndex(index);
    setShowHourBottomSheet(true);
  };

  return (
    <BG type="solid">
      <AppBar
        title="알림 설정"
        goBackCallbackFn={() => navigation.goBack()}
        confirmCallbackFn={isStateChanged() ? confirmCallbackFn : undefined}
        isLoading={isLoading}
      />
      {notifications.map((notif, i) => (
        <NotiButton
          key={notif.sub}
          title={`${notif.hour} ${notif.minute}`}
          sub={notif.sub}
          onPress={() => notiTimeHandler(i)}
          isOn={notif.isOn}
          setIsOn={() =>
            setNotifications((prev) =>
              prev.map((n, idx) => (idx === i ? { ...n, isOn: !n.isOn } : n))
            )
          }
        />
      ))}
      {showHourBottomSheet && (
        <TimeSelectBottomSheet
          type="hour"
          value={notifications[selectedIndex]?.hour || "오전 00시"}
          setValue={setTempHour}
          onClose={() => setShowHourBottomSheet(false)}
          onSelect={() => setShowMinuteBottomSheet(true)}
        />
      )}
      {showMinuteBottomSheet && (
        <TimeSelectBottomSheet
          type="minute"
          value={notifications[selectedIndex]?.minute || "00분"}
          setValue={setTempMinute}
          onClose={() => setShowMinuteBottomSheet(false)}
        />
      )}
    </BG>
  );
};

const NotiButton = ({
  title,    // 시간 표시 (예: "오전 7시 00분")
  sub,      // 알림 제목 (예: "기상")
  onPress,  // 버튼 클릭 핸들러
  isOn,     // 알림 활성화 상태
  setIsOn,  // 알림 활성화 상태 변경 함수
}: {
  title: string;
  sub: string;
  onPress: () => void;
  isOn: boolean;
  setIsOn: () => void;
}) => {
  return (
    <Pressable
      className="w-full flex-row justify-between items-center px-px py-[21]"
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? COLORS.blue600 : "transparent",
      })}
      android_ripple={{ color: COLORS.blue600 }}
    >
      <View className="flex-row justify-start items-end gap-x-[13]">
        <CustomText type="title3" text={title} className="text-white" />
        <CustomText type="button" text={sub} className="text-gray300" />
      </View>
      <ToggleSwitch isOn={isOn} onToggle={setIsOn} />
    </Pressable>
  );
};

