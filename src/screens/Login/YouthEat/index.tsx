import AppBar from '@components/atom/AppBar';
import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import Txt from '@components/atom/Txt';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {useState} from 'react';
import {Image, Pressable, TextInput, View} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
type AuthProps = NativeStackScreenProps<AuthStackParamList, 'YouthEatScreen'>;

const YouthEatScreen = ({route, navigation}: Readonly<AuthProps>) => {
  const {nickname, imageUri, role, birthday, gender, wakeUpTime} = route.params;
  const [breakfast, setBreakfast] = useState(new Date());
  const [lunch, setLunch] = useState(new Date());
  const [dinner, setDinner] = useState(new Date());
  const [breakfastString, setBreakfastString] = useState('');
  const [lunchString, setLunchString] = useState('');
  const [dinnerString, setDinnerString] = useState('');
  const [showBreakfast, setShowBreakfast] = useState(false);
  const [showLunch, setShowLunch] = useState(false);
  const [showDinner, setShowDinner] = useState(false);

  const onChangeDateBreakfast = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    const currentDate = selectedDate || breakfast;
    if (!currentDate) {
      return;
    }

    setShowBreakfast(false);
    setBreakfast(currentDate);
    // 선택한 시간을 문자열로 변환하여 저장
    const formattedTime = currentDate.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    });
    setBreakfastString(formattedTime);
  };

  const onChangeDateLunch = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    const currentDate = selectedDate || lunch;
    if (!currentDate) {
      return;
    }

    setShowLunch(false);
    setLunch(currentDate);
    // 선택한 시간을 문자열로 변환하여 저장
    const formattedTime = currentDate.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    });
    setLunchString(formattedTime);
  };

  const onChangeDateDinner = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    const currentDate = selectedDate || breakfast;
    if (!currentDate) {
      return;
    }

    setShowDinner(false);
    setDinner(currentDate);
    // 선택한 시간을 문자열로 변환하여 저장
    const formattedTime = currentDate.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    });
    setDinnerString(formattedTime);
  };

  const handleNext = async () => {
    navigation.navigate('YouthSleepTimeScreen', {
      nickname,
      imageUri,
      role,
      birthday,
      gender,
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
        <View className="w-[75%] h-[3] bg-yellowPrimary absolute top-[83]" />
        <View className="flex-1 mt-[50]">
          <View className="items-center pt-[100]">
            <Txt
              type="title2"
              text={'몇 시에\n식사하시나요?'}
              className="text-white text-center"
            />
            <Txt
              type="body3"
              text="평소 식사 시간이 궁금해요"
              className="text-gray300 mt-[16] text-center"
            />

            <View className="mt-[60] px-[24] flex-row justify-between w-full">
              <View className="items-center">
                <Txt
                  type="body3"
                  text="아침"
                  className="text-gray300 mb-[-16]"
                />
                <Pressable onPress={() => setShowBreakfast(true)}>
                  <TextInput
                    value={breakfastString}
                    placeholder="00:00"
                    placeholderTextColor={'#717171'}
                    className={`text-yellowPrimary px-[8] font-r border-b ${
                      breakfastString
                        ? 'border-b-yellow200'
                        : 'border-b-gray400'
                    } mt-[31] text-center`}
                    style={{fontSize: 32}}
                    editable={false}
                  />
                </Pressable>
              </View>
              <View className="items-center">
                <Txt
                  type="body3"
                  text="점심"
                  className="text-gray300 mb-[-16]"
                />
                <Pressable onPress={() => setShowLunch(true)}>
                  <TextInput
                    value={lunchString}
                    placeholder="00:00"
                    placeholderTextColor={'#717171'}
                    className={`text-yellowPrimary px-[8] font-r border-b ${
                      lunchString ? 'border-b-yellow200' : 'border-b-gray400'
                    } mt-[31] text-center`}
                    style={{fontSize: 32}}
                    editable={false}
                  />
                </Pressable>
              </View>
              <View className="items-center">
                <Txt
                  type="body3"
                  text="저녁"
                  className="text-gray300 mb-[-16]"
                />
                <Pressable onPress={() => setShowDinner(true)}>
                  <TextInput
                    value={dinnerString}
                    placeholder="00:00"
                    placeholderTextColor={'#717171'}
                    className={`text-yellowPrimary px-[8] font-r border-b ${
                      dinnerString ? 'border-b-yellow200' : 'border-b-gray400'
                    } mt-[31] text-center`}
                    style={{fontSize: 32}}
                    editable={false}
                  />
                </Pressable>
              </View>
              {showBreakfast && (
                <DateTimePicker
                  value={breakfast}
                  mode="time" // 시간 선택 모드
                  is24Hour={true} // 24시간 형식
                  display="spinner"
                  onChange={onChangeDateBreakfast}
                />
              )}
              {showLunch && (
                <DateTimePicker
                  value={lunch}
                  mode="time" // 시간 선택 모드
                  is24Hour={true} // 24시간 형식
                  display="spinner"
                  onChange={onChangeDateLunch}
                />
              )}
              {showDinner && (
                <DateTimePicker
                  value={dinner}
                  mode="time" // 시간 선택 모드
                  is24Hour={true} // 24시간 형식
                  display="spinner"
                  onChange={onChangeDateDinner}
                />
              )}
            </View>
          </View>
          <Image
            source={require('@assets/pngs/background/background_youth5.png')}
            className="w-full h-auto flex-1 mt-[177]"
          />
          <View className="absolute left-0 bottom-[30] w-full px-[40]">
            <Button
              text="다음"
              onPress={handleNext}
              disabled={!breakfastString || !lunchString || !dinnerString}
            />
          </View>
        </View>
      </>
    </BG>
  );
};

export default YouthEatScreen;
