import AppBar from '@components/atom/AppBar';
import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import Txt from '@components/atom/Txt';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {useState} from 'react';
import {Alert, Image, Pressable, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import useLoading from '@hooks/useLoading';
import uploadImageToS3 from '@apis/util';
import {Gender, MemberInfoResponseData, Role} from '@type/api/member';
import formatBirth from '@utils/formatBirth';
import {postMemberYouth} from '@apis/member';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStatusBarStyle } from '@hooks/useStatusBarStyle';
type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'YouthSleepTimeScreen'
>;

const YouthSleepTimeScreen = ({route, navigation}: Readonly<AuthProps>) => {
  const {
    nickname,
    imageUri,
    role,
    birthday,
    gender,
    wakeUpTime,
    breakfast,
    lunch,
    dinner,
  } = route.params;
  const [sleepTime, setSleepTime] = useState(new Date());
  const [sleepTimeString, setSleepTimeString] = useState('');
  const [show, setShow] = useState(false);
  const {isLoading, setIsLoading} = useLoading();

  // 상태바 스타일 설정
  const BackColorType = 'main';
  useStatusBarStyle(BackColorType);

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
    let imageLocation;
    try {
      setIsLoading(true);
      imageLocation = (await uploadImageToS3(imageUri)) as string;
      console.log('imageLocation', imageLocation);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

    const data: MemberInfoResponseData = {
      gender: gender as Gender,
      name: nickname,
      profileImage: imageLocation ?? '',
      role: role as Role,
      birth: formatBirth(birthday),
      youthMemberInfoDto: {
        wakeUpTime,
        breakfast,
        lunch,
        dinner,
        sleepTime: sleepTime.toISOString(),
      },
    };

    try {
      const {result} = await postMemberYouth(data);
      console.log(result);

      await AsyncStorage.setItem('nickname', nickname);
      navigation.navigate('YouthNoticeScreen');
    } catch (error) {
      console.log(error);
      Alert.alert('오류', '회원가입 중 오류가 발생했어요');
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <BG type={BackColorType}>
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
                      sleepTimeString
                        ? 'border-b-yellow200'
                        : 'border-b-gray400'
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
            </View>
            <Image
              source={require('@assets/pngs/background/background_youth5.png')}
              className="w-full h-auto flex-1 mt-[177]"
            />
            <View className="absolute left-0 bottom-[30] w-full px-[40]">
              <Button
                text="다음"
                onPress={handleNext}
                disabled={!wakeUpTime || isLoading}
                isLoading={isLoading}
              />
            </View>
          </View>
        </>
      </BG>
    </SafeAreaView>
  );
};

export default YouthSleepTimeScreen;
