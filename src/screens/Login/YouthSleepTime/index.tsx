import AppBar from '@components/atom/AppBar';
import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import Txt from '@components/atom/Txt';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {useState} from 'react';
import {Image, Pressable, TextInput, View} from 'react-native';
type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'YouthSleepTimeScreen'
>;

const YouthSleepTimeScreen = ({route, navigation}: Readonly<AuthProps>) => {
  const {wakeUpTime, breakfast, lunch, dinner} = route.params;
  const [sleepTime, setSleepTime] = useState(new Date());
  const [sleepTimeString, setSleepTimeString] = useState('');
  const [show, setShow] = useState(false);

  // 시간 선택 함수
  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || sleepTime;
    if (!currentDate) {
      return;
    }

    setShow(false);
    setSleepTime(currentDate);
    // 선택한 시간을 문자열로 변환하여 저장
    const formattedTime = currentDate.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    });
    setSleepTimeString(formattedTime);
  };

  const handleNext = async () => {
    navigation.navigate('YouthNoticeScreen', {
      wakeUpTime,
      breakfast,
      lunch,
      dinner,
      sleepTime: sleepTime.toISOString(),
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
        <View className="w-[50%] h-[3] bg-yellowPrimary absolute top-[83]" />
        <View className="items-center pt-[100] flex-1 mt-[50]">
          <Txt
            type="title2"
            text={'몇 시에\n취침하시나요?'}
            className="text-white text-center"
          />
          <Txt
            type="body3"
            text="하루를 마무리하는 시간이 궁금해요"
            className="text-gray300 mt-[16] text-center"
          />

          <View className="mt-[60] px-[46]">
            <Pressable onPress={() => setShow(true)}>
              <TextInput
                value={sleepTimeString}
                placeholder="시간을 선택해주세요"
                placeholderTextColor={'#717171'}
                className={`text-yellowPrimary px-[8] font-r border-b ${
                  sleepTimeString ? 'border-b-yellow200' : 'border-b-gray400'
                } mt-[31] text-center`}
                style={{fontSize: 32}}
                editable={false}
              />
            </Pressable>
            {show && (
              <DateTimePicker
                value={sleepTime}
                mode="time" // 시간 선택 모드
                is24Hour={true} // 24시간 형식
                display="spinner"
                onChange={onChangeDate}
              />
            )}
          </View>
          <Image
            source={require('@assets/pngs/background/background_youth5.png')}
            className="mt-[92]"
          />
          <View className="absolute left-0 bottom-[30] w-full px-[40]">
            <Button
              text="다음"
              onPress={handleNext}
              disabled={!sleepTimeString}
            />
          </View>
        </View>
      </>
    </BG>
  );
};

export default YouthSleepTimeScreen;
