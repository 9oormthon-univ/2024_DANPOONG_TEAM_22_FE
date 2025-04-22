import { useCallback, useRef, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { AppBar } from '@components/AppBar';
import { BG } from '@components/BG';
import { Button } from '@components/Button';
import { CustomText } from '@components/CustomText';
import { FlexableMargin } from '@components/FlexableMargin';
import { TimeSelectBottomSheet } from '@components/TimeSelectBottomSheet';
import { useFocusEffect } from '@react-navigation/native';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { DEFAULT_TIME } from '@screens/Login/YouthWakeUpTime';
import { type AuthStackParamList } from '@stackNav/Auth';
import { convertTimeFormat } from '@utils/convertFuncs';
import { trackEvent } from '@utils/tracker';

import ChevronBottomGrayIcon from '@assets/svgs/chevron/chevron_bottom_gray.svg';

type AuthProps = NativeStackScreenProps<AuthStackParamList, 'YouthEatScreen'>;

const YouthEatScreen = ({ route, navigation }: Readonly<AuthProps>) => {
  const { wakeUpTime } = route.params;
  const [breakfastHour, setBreakfastHour] = useState(
    DEFAULT_TIME.breakfast.hour,
  );
  const [breakfastMinute, setBreakfastMinute] = useState(
    DEFAULT_TIME.breakfast.minute,
  );
  const [lunchHour, setLunchHour] = useState(DEFAULT_TIME.lunch.hour);
  const [lunchMinute, setLunchMinute] = useState(DEFAULT_TIME.lunch.minute);
  const [dinnerHour, setDinnerHour] = useState(DEFAULT_TIME.dinner.hour);
  const [dinnerMinute, setDinnerMinute] = useState(DEFAULT_TIME.dinner.minute);
  const [showBreakfastHourBottomSheet, setShowBreakfastHourBottomSheet] =
    useState(false);
  const [showBreakfastMinuteBottomSheet, setShowBreakfastMinuteBottomSheet] =
    useState(false);
  const [showLunchHourBottomSheet, setShowLunchHourBottomSheet] =
    useState(false);
  const [showLunchMinuteBottomSheet, setShowLunchMinuteBottomSheet] =
    useState(false);
  const [showDinnerHourBottomSheet, setShowDinnerHourBottomSheet] =
    useState(false);
  const [showDinnerMinuteBottomSheet, setShowDinnerMinuteBottomSheet] =
    useState(false);
  const startTime = useRef(0);

  useFocusEffect(
    useCallback(() => {
      startTime.current = new Date().getTime();
    }, []),
  );

  const handleNext = async () => {
    const breakfast = convertTimeFormat(breakfastHour, breakfastMinute);
    const lunch = convertTimeFormat(lunchHour, lunchMinute);
    const dinner = convertTimeFormat(dinnerHour, dinnerMinute);

    const endTime = new Date().getTime();
    const viewTime = endTime - startTime.current;

    trackEvent('meal_time_set', {
      view_time: viewTime, // 밀리초 단위
    });

    navigation.navigate('YouthSleepTimeScreen', {
      wakeUpTime,
      breakfast,
      lunch,
      dinner,
    });
  };

  return (
    <BG type="main">
      <AppBar
        goBackCallbackFn={() => {
          navigation.goBack();
        }}
        className="absolute top-[0] w-full"
      />
      <View className="w-full h-[3] bg-white/5 absolute top-[60]" />
      <View className="w-[66%] h-[3] bg-yellowPrimary absolute top-[60]" />

      <FlexableMargin flexGrow={120} />

      <CustomText
        type="title2"
        text="식사 시간을 알려주세요"
        className="text-white text-center"
      />
      <FlexableMargin flexGrow={9} />
      <CustomText
        type="body3"
        text="식사 알림을 받고 싶은 시간을 입력해주세요"
        className="text-gray300 text-center"
      />

      <FlexableMargin flexGrow={60} />

      {/* 아침 */}
      <View className="px-[50]">
        <CustomText type="button" text="아침" className="text-gray300" />
        <FlexableMargin flexGrow={11} />
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => setShowBreakfastHourBottomSheet(true)}
            className="border-b border-b-gray300 flex-row items-center justify-between w-full shrink">
            <CustomText
              type="title2"
              text={
                breakfastHour.includes('자정') ? '오전 12시' : breakfastHour
              }
              className="text-white"
            />
            <ChevronBottomGrayIcon />
          </Pressable>
          <View className="w-[17]" />
          <Pressable
            onPress={() => setShowBreakfastMinuteBottomSheet(true)}
            className="border-b border-b-gray300 flex-row items-center justify-between w-full shrink">
            <CustomText
              type="title2"
              text={breakfastMinute}
              className="text-white"
            />
            <ChevronBottomGrayIcon />
          </Pressable>
        </View>
      </View>

      <FlexableMargin flexGrow={59} />

      {/* 점심 */}
      <View className="px-[50]">
        <CustomText type="button" text="점심" className="text-gray300" />
        <FlexableMargin flexGrow={11} />
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => setShowLunchHourBottomSheet(true)}
            className="border-b border-b-gray300 flex-row items-center justify-between w-full shrink">
            <CustomText
              type="title2"
              text={lunchHour.includes('자정') ? '오전 12시' : lunchHour}
              className="text-white"
            />
            <ChevronBottomGrayIcon />
          </Pressable>
          <View className="w-[17]" />
          <Pressable
            onPress={() => setShowLunchMinuteBottomSheet(true)}
            className="border-b border-b-gray300 flex-row items-center justify-between w-full shrink">
            <CustomText
              type="title2"
              text={lunchMinute}
              className="text-white"
            />
            <ChevronBottomGrayIcon />
          </Pressable>
        </View>
      </View>

      <FlexableMargin flexGrow={59} />

      {/* 저녁 */}
      <View className="px-[50]">
        <CustomText type="button" text="저녁" className="text-gray300" />
        <FlexableMargin flexGrow={11} />
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => setShowDinnerHourBottomSheet(true)}
            className="border-b border-b-gray300 flex-row items-center justify-between w-full shrink">
            <CustomText
              type="title2"
              text={dinnerHour.includes('자정') ? '오전 12시' : dinnerHour}
              className="text-white"
            />
            <ChevronBottomGrayIcon />
          </Pressable>
          <View className="w-[17]" />
          <Pressable
            onPress={() => setShowDinnerMinuteBottomSheet(true)}
            className="border-b border-b-gray300 flex-row items-center justify-between w-full shrink">
            <CustomText
              type="title2"
              text={dinnerMinute}
              className="text-white"
            />
            <ChevronBottomGrayIcon />
          </Pressable>
        </View>
      </View>

      <FlexableMargin flexGrow={140} />

      <View
        className={`absolute left-0 ${
          Platform.OS === 'ios' ? 'bottom-[79]' : 'bottom-[55]'
        } w-full px-[30]`}>
        <Button text="다음" onPress={handleNext} />
      </View>

      {/* 아침 */}
      <TimeSelectBottomSheet
        type="hour"
        value={breakfastHour}
        setValue={setBreakfastHour}
        onClose={() => setShowBreakfastHourBottomSheet(false)}
        onSelect={() => setShowBreakfastMinuteBottomSheet(true)}
        isShow={showBreakfastHourBottomSheet}
      />
      <TimeSelectBottomSheet
        type="minute"
        value={breakfastMinute}
        setValue={setBreakfastMinute}
        onClose={() => setShowBreakfastMinuteBottomSheet(false)}
        isShow={showBreakfastMinuteBottomSheet}
      />

      {/* 점심 */}
      <TimeSelectBottomSheet
        type="hour"
        value={lunchHour}
        setValue={setLunchHour}
        onClose={() => setShowLunchHourBottomSheet(false)}
        onSelect={() => setShowLunchMinuteBottomSheet(true)}
        isShow={showLunchHourBottomSheet}
      />
      <TimeSelectBottomSheet
        type="minute"
        value={lunchMinute}
        setValue={setLunchMinute}
        onClose={() => setShowLunchMinuteBottomSheet(false)}
        isShow={showLunchMinuteBottomSheet}
      />

      {/* 저녁 */}
      <TimeSelectBottomSheet
        type="hour"
        value={dinnerHour}
        setValue={setDinnerHour}
        onClose={() => setShowDinnerHourBottomSheet(false)}
        onSelect={() => setShowDinnerMinuteBottomSheet(true)}
        isShow={showDinnerHourBottomSheet}
      />
      <TimeSelectBottomSheet
        type="minute"
        value={dinnerMinute}
        setValue={setDinnerMinute}
        onClose={() => setShowDinnerMinuteBottomSheet(false)}
        isShow={showDinnerMinuteBottomSheet}
      />
    </BG>
  );
};

export { YouthEatScreen };
