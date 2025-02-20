import ChevronBottomGrayIcon from '@assets/svgs/chevron/chevron_bottom_gray.svg';
import AppBar from '@components/atom/AppBar';
import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import TimeSelectBottomSheet from '@components/atom/TimeSelectBottomSheet';
import Txt from '@components/atom/Txt';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DEFAULT_TIME} from '@screens/Login/YouthWakeUpTime';
import {AuthStackParamList} from '@stackNav/Auth';
import {joinTime} from '@utils/convertToDate';
import {useState} from 'react';
import {Pressable, View} from 'react-native';

type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'YouthSleepTimeScreen'
>;

const YouthSleepTimeScreen = ({route, navigation}: Readonly<AuthProps>) => {
  const {wakeUpTime, breakfast, lunch, dinner} = route.params;
  const [hour, setHour] = useState(DEFAULT_TIME.sleepTime.hour);
  const [minute, setMinute] = useState(DEFAULT_TIME.sleepTime.minute);
  const [showHourBottomSheet, setShowHourBottomSheet] = useState(false);
  const [showMinuteBottomSheet, setShowMinuteBottomSheet] = useState(false);

  const handleNext = async () => {
    const sleepTime = joinTime(hour, minute);

    navigation.navigate('YouthNoticeScreen', {
      wakeUpTime,
      breakfast,
      lunch,
      dinner,
      sleepTime,
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
        <View className="w-full h-[3] bg-yellowPrimary absolute top-[60]" />

        <View className="h-[180]" />

        <View className="items-center flex-1">
          <Txt
            type="title2"
            text="취침 시간을 알려주세요"
            className="text-white text-center"
          />
          <View className="h-[9]" />
          <Txt
            type="body3"
            text="취침 알림을 받고 싶은 시간을 입력해주세요"
            className="text-gray300 text-center"
          />

          <View className="h-[100]" />

          <View className="px-[50] flex-row items-center justify-between">
            <Pressable
              onPress={() => setShowHourBottomSheet(true)}
              className="border-b border-b-gray300 flex-row items-center justify-between w-[147]">
              <Txt
                type="title2"
                text={hour.includes('자정') ? '오전 12시' : hour}
                className="text-white"
              />
              <ChevronBottomGrayIcon />
            </Pressable>
            <View className="w-[17]" />
            <Pressable
              onPress={() => setShowMinuteBottomSheet(true)}
              className="border-b border-b-gray300 flex-row items-center justify-between w-[147]">
              <Txt type="title2" text={minute} className="text-white" />
              <ChevronBottomGrayIcon />
            </Pressable>
          </View>

          <View className="absolute left-0 bottom-[55] w-full px-[30]">
            <Button text="다음" onPress={handleNext} />
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
        </View>
      </>
    </BG>
  );
};

export default YouthSleepTimeScreen;
