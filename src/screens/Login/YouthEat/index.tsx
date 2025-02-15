import ChevronBottomGrayIcon from '@assets/svgs/chevron/chevron_bottom_gray.svg';
import AppBar from '@components/atom/AppBar';
import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import TimeSelectBottomSheet from '@components/atom/TimeSelectBottomSheet';
import Txt from '@components/atom/Txt';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DEFAULT_TIME} from '@screens/Login/YouthWakeUpTime';
import {AuthStackParamList} from '@stackNav/Auth';
import convertToDate from '@utils/convertToDate';
import {useState} from 'react';
import {Pressable, View} from 'react-native';

type AuthProps = NativeStackScreenProps<AuthStackParamList, 'YouthEatScreen'>;

const YouthEatScreen = ({route, navigation}: Readonly<AuthProps>) => {
  const {wakeUpTime} = route.params;
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

  const handleNext = async () => {
    const breakfast = convertToDate(breakfastHour, breakfastMinute);
    const lunch = convertToDate(lunchHour, lunchMinute);
    const dinner = convertToDate(dinnerHour, dinnerMinute);

    navigation.navigate('YouthSleepTimeScreen', {
      wakeUpTime,
      breakfast: breakfast.toISOString(),
      lunch: lunch.toISOString(),
      dinner: dinner.toISOString(),
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
        <View className="w-[66%] h-[3] bg-yellowPrimary absolute top-[60]" />

        <View className="h-[120]" />

        <View className="items-center flex-1">
          <Txt
            type="title2"
            text="식사 시간을 알려주세요"
            className="text-white text-center"
          />
          <View className="h-[9]" />
          <Txt
            type="body3"
            text="식사 알림을 받고 싶은 시간을 입력해주세요"
            className="text-gray300 text-center"
          />

          <View className="h-[60]" />

          <View>
            {/* 아침 */}
            <View className="px-[50]">
              <Txt type="button" text="아침" className="text-gray300" />
              <View className="h-[11]" />
              <View className="flex-row items-center justify-between">
                <Pressable
                  onPress={() => setShowBreakfastHourBottomSheet(true)}
                  className="border-b border-b-gray300 flex-row items-center justify-between w-[147]">
                  <Txt
                    type="title1"
                    text={
                      breakfastHour.includes('자정')
                        ? '오전 12시'
                        : breakfastHour
                    }
                    className="text-white"
                  />
                  <ChevronBottomGrayIcon />
                </Pressable>
                <View className="w-[17]" />
                <Pressable
                  onPress={() => setShowBreakfastMinuteBottomSheet(true)}
                  className="border-b border-b-gray300 flex-row items-center justify-between w-[147]">
                  <Txt
                    type="title1"
                    text={breakfastMinute}
                    className="text-white"
                  />
                  <ChevronBottomGrayIcon />
                </Pressable>
              </View>
            </View>

            <View className="h-[59]" />

            {/* 점심 */}
            <View className="px-[50]">
              <Txt type="button" text="점심" className="text-gray300" />
              <View className="h-[11]" />
              <View className="flex-row items-center justify-between">
                <Pressable
                  onPress={() => setShowLunchHourBottomSheet(true)}
                  className="border-b border-b-gray300 flex-row items-center justify-between w-[147]">
                  <Txt
                    type="title1"
                    text={lunchHour.includes('자정') ? '오전 12시' : lunchHour}
                    className="text-white"
                  />
                  <ChevronBottomGrayIcon />
                </Pressable>
                <View className="w-[17]" />
                <Pressable
                  onPress={() => setShowLunchMinuteBottomSheet(true)}
                  className="border-b border-b-gray300 flex-row items-center justify-between w-[147]">
                  <Txt
                    type="title1"
                    text={lunchMinute}
                    className="text-white"
                  />
                  <ChevronBottomGrayIcon />
                </Pressable>
              </View>
            </View>

            <View className="h-[59]" />

            {/* 저녁 */}
            <View className="px-[50]">
              <Txt type="button" text="저녁" className="text-gray300" />
              <View className="h-[11]" />
              <View className="flex-row items-center justify-between">
                <Pressable
                  onPress={() => setShowDinnerHourBottomSheet(true)}
                  className="border-b border-b-gray300 flex-row items-center justify-between w-[147]">
                  <Txt
                    type="title1"
                    text={
                      dinnerHour.includes('자정') ? '오전 12시' : dinnerHour
                    }
                    className="text-white"
                  />
                  <ChevronBottomGrayIcon />
                </Pressable>
                <View className="w-[17]" />
                <Pressable
                  onPress={() => setShowDinnerMinuteBottomSheet(true)}
                  className="border-b border-b-gray300 flex-row items-center justify-between w-[147]">
                  <Txt
                    type="title1"
                    text={dinnerMinute}
                    className="text-white"
                  />
                  <ChevronBottomGrayIcon />
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <View className="absolute left-0 bottom-[55] w-full px-[30]">
          <Button text="다음" onPress={handleNext} />
        </View>

        {/* 아침 */}
        {showBreakfastHourBottomSheet && (
          <TimeSelectBottomSheet
            type="hour"
            value={breakfastHour}
            setValue={setBreakfastHour}
            onClose={() => setShowBreakfastHourBottomSheet(false)}
            onSelect={() => setShowBreakfastMinuteBottomSheet(true)}
          />
        )}
        {showBreakfastMinuteBottomSheet && (
          <TimeSelectBottomSheet
            type="minute"
            value={breakfastMinute}
            setValue={setBreakfastMinute}
            onClose={() => setShowBreakfastMinuteBottomSheet(false)}
          />
        )}

        {/* 점심 */}
        {showLunchHourBottomSheet && (
          <TimeSelectBottomSheet
            type="hour"
            value={lunchHour}
            setValue={setLunchHour}
            onClose={() => setShowLunchHourBottomSheet(false)}
            onSelect={() => setShowLunchMinuteBottomSheet(true)}
          />
        )}
        {showLunchMinuteBottomSheet && (
          <TimeSelectBottomSheet
            type="minute"
            value={lunchMinute}
            setValue={setLunchMinute}
            onClose={() => setShowLunchMinuteBottomSheet(false)}
          />
        )}

        {/* 저녁 */}
        {showDinnerHourBottomSheet && (
          <TimeSelectBottomSheet
            type="hour"
            value={dinnerHour}
            setValue={setDinnerHour}
            onClose={() => setShowDinnerHourBottomSheet(false)}
            onSelect={() => setShowDinnerMinuteBottomSheet(true)}
          />
        )}
        {showDinnerMinuteBottomSheet && (
          <TimeSelectBottomSheet
            type="minute"
            value={dinnerMinute}
            setValue={setDinnerMinute}
            onClose={() => setShowDinnerMinuteBottomSheet(false)}
          />
        )}
      </>
    </BG>
  );
};

export default YouthEatScreen;
