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
import {SafeAreaView} from 'react-native-safe-area-context';

type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'YouthWakeUpTimeScreen'
>;

const YouthWakeUpTimeScreen = ({route, navigation}: Readonly<AuthProps>) => {
  const {nickname, imageUri, role, birthday, gender} = route.params;
  const [wakeUpTime, setWakeUpTime] = useState(new Date());
  const [wakeUpTimeString, setWakeUpTimeString] = useState('');
  const [show, setShow] = useState(false);

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || wakeUpTime;
    if (!currentDate) {
      return;
    }

    setShow(false);
    setWakeUpTime(currentDate);
    // 선택한 시간을 문자열로 변환하여 저장
    const formattedTime = currentDate.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    });
    setWakeUpTimeString(formattedTime);
  };

  const handleNext = async () => {
    navigation.navigate('YouthEatScreen', {
      nickname,
      imageUri,
      role,
      birthday,
      gender,
      wakeUpTime: wakeUpTime.toISOString(),
    });
  };

  const handleInputTouch = () => {
    console.log('handleInputTouch');
    setShow(true);
  };

  return (
    <SafeAreaView className="flex-1">
      <BG type="main">
        <>
          <AppBar
            goBackCallbackFn={() => {
              navigation.goBack();
            }}
            className="absolute top-[0] w-full"
          />
          <View className="w-[50%] h-[3] bg-yellowPrimary absolute top-[63]" />
          <View className="flex-1 mt-[50]">
            <View className="items-center pt-[100]">
              <Txt
                type="title2"
                text={'몇 시에\n일어나시나요?'}
                className="text-white text-center"
              />
              <Txt
                type="body3"
                text="평소 기상 시간을 알려주세요"
                className="text-gray300 mt-[16] text-center"
              />

              <View className="mt-[60] px-[46]">
                <Pressable onPress={handleInputTouch}>
                  <TextInput
                    value={wakeUpTimeString}
                    placeholder="시간을 선택해주세요"
                    placeholderTextColor={'#717171'}
                    className={`text-yellowPrimary px-[8] font-r border-b ${
                      wakeUpTimeString
                        ? 'border-b-yellow200'
                        : 'border-b-gray400'
                    } mt-[31] text-center`}
                    style={{fontSize: 32}}
                    editable={false}
                  />
                </Pressable>
                {show && (
                  <DateTimePicker
                    value={wakeUpTime}
                    mode="time" // 시간 선택 모드
                    is24Hour={true} // 24시간 형식
                    display="spinner"
                    onChange={onChangeDate}
                  />
                )}
              </View>
            </View>
          </View>
          <Image
            source={require('@assets/pngs/background/background_youth5.png')}
            className="w-full h-auto flex-1 mt-[177]"
          />
          <View className="absolute left-0 bottom-[30] w-full px-[40]">
            <Button text="다음" onPress={handleNext} disabled={!wakeUpTime} />
          </View>
        </>
      </BG>
    </SafeAreaView>
  );
};

export default YouthWakeUpTimeScreen;
