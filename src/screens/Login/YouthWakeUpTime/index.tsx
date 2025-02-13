import ChevronBottomGrayIcon from '@assets/svgs/chevron/chevron_bottom_gray.svg';
import AppBar from '@components/atom/AppBar';
import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import TimeSelectBottomSheet from '@components/atom/TimeSelectBottomSheet';
import Txt from '@components/atom/Txt';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {useState} from 'react';
import {Pressable, View} from 'react-native';

type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'YouthWakeUpTimeScreen'
>;

const YouthWakeUpTimeScreen = ({navigation}: Readonly<AuthProps>) => {
  const [hour, setHour] = useState('오전 8시');
  const [minute, setMinute] = useState('00분');
  const [showHourBottomSheet, setShowHourBottomSheet] = useState(false);
  const [showMinuteBottomSheet, setShowMinuteBottomSheet] = useState(false);

  const convertToDate = (hour: string, minute: string): Date => {
    const now = new Date();
    const isPM = hour.includes('오후');
    let hourValue = parseInt(hour.replace(/[^0-9]/g, ''), 10); // 숫자만 추출

    // 오전 12시는 0으로 변환, 오후 12시는 그대로 12 유지
    if (hourValue === 12) {
      hourValue = isPM ? 12 : 0;
    } else {
      hourValue = isPM ? hourValue + 12 : hourValue;
    }

    const minuteValue = parseInt(minute.replace(/[^0-9]/g, ''), 10); // 숫자만 추출

    // 현재 날짜에 시, 분을 설정한 Date 객체 생성
    now.setHours(hourValue, minuteValue, 0, 0);
    return now;
  };

  const handleNext = async () => {
    const wakeUpTime = convertToDate(hour, minute);

    navigation.navigate('YouthEatScreen', {
      wakeUpTime: wakeUpTime.toISOString(),
    });
  };

  return (
    <BG type="main">
      <>
        <AppBar
          goBackCallbackFn={() => {
            navigation.goBack();
          }}
          className="absolute top-[0] w-full"
        />
        <View className="w-full h-[3] bg-white/5 absolute top-[60]" />
        <View className="w-[50%] h-[3] bg-yellowPrimary absolute top-[60]" />

        <View className="h-[180]" />

        <View className="items-center flex-1">
          <Txt
            type="title2"
            text="기상 시간을 알려주세요"
            className="text-white text-center"
          />
          <View className="h-[9]" />
          <Txt
            type="body3"
            text="기상 알림을 받고 싶은 시간을 입력해주세요"
            className="text-gray300 text-center"
          />

          <View className="h-[100]" />

          <View className="px-[50] flex-row items-center justify-between">
            <Pressable
              onPress={() => setShowHourBottomSheet(true)}
              className="border-b border-b-gray300 flex-row items-center justify-between w-[147]">
              <Txt
                type="title1"
                text={hour.includes('자정') ? '오전 12시' : hour}
                className="text-white"
              />
              <ChevronBottomGrayIcon />
            </Pressable>
            <View className="w-[17]" />
            <Pressable
              onPress={() => setShowMinuteBottomSheet(true)}
              className="border-b border-b-gray300 flex-row items-center justify-between w-[147]">
              <Txt type="title1" text={minute} className="text-white" />
              <ChevronBottomGrayIcon />
            </Pressable>
          </View>
        </View>

        <View className="absolute left-0 bottom-[55] w-full px-[30]">
          <Button
            text="다음"
            onPress={handleNext}
            disabled={!hour || !minute}
          />
        </View>

        {showHourBottomSheet && (
          <TimeSelectBottomSheet
            type="hour"
            value={hour}
            setValue={setHour}
            onClose={() => setShowHourBottomSheet(false)}
            onSelect={() => setShowMinuteBottomSheet(true)}
          />
        )}

        {showMinuteBottomSheet && (
          <TimeSelectBottomSheet
            type="minute"
            value={minute}
            setValue={setMinute}
            onClose={() => setShowMinuteBottomSheet(false)}
          />
        )}
      </>
    </BG>
  );
};

export default YouthWakeUpTimeScreen;
