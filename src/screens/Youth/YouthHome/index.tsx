import {getAlarmCategoryDetail} from '@apis/alarm';
import CancelIcon from '@assets/svgs/cancel.svg';
import LogoIcon from '@assets/svgs/Main2.svg';
import SettingSmallIcon from '@assets/svgs/settingSmall.svg';
import Txt from '@components/atom/Txt';
import useGetAlarmComfort from '@hooks/alarm/useGetAlarmComfort';
import useGetHelperNum from '@hooks/member/useGetHelperNum';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {YouthStackParamList} from '@stackNav/Youth';
import {useEffect, useState} from 'react';
import {Alert, ImageBackground, Pressable, View} from 'react-native';

type YouthProps = NativeStackScreenProps<
  YouthStackParamList,
  'YouthHomeScreen'
>;

const VOICE_MENU = [
  {alarmCategory: 'CONSOLATION', alarmCategoryKoreanName: '위로'},
  {alarmCategory: 'PRAISE', alarmCategoryKoreanName: '칭찬과 격려'},
  {alarmCategory: 'SADNESS', alarmCategoryKoreanName: '우울과 불안'},
];

const YouthHomeScreen = ({navigation}: Readonly<YouthProps>) => {
  const [clicked, setClicked] = useState(false);
  const {data: helperNumData, isError: isHelperNumError} = useGetHelperNum();
  const [nickname, setNickname] = useState('');
  const {
    data: alarmComfortData,
    isError: isAlarmComfortError,
    error: alarmComfortError,
  } = useGetAlarmComfort();
  console.log('alarmComfortData', alarmComfortData);
  useEffect(() => {
    (async () => {
      const nickname = await AsyncStorage.getItem('nickname');
      setNickname(nickname ?? '');
    })();
  }, []);

  const handleButtonClick = (alarmCategory: string) => {
    if (!alarmComfortData) {
      return;
    }

    const alarms = alarmComfortData.result.find(
      alarm => alarm.alarmCategory === alarmCategory,
    );
    console.log('children', alarms?.children);
    const childrenAlarmCategory = alarms?.children[0].alarmCategory;

    (async () => {
      if (!childrenAlarmCategory) {
        return;
      }

      try {
        const {result} = await getAlarmCategoryDetail({
          childrenAlarmCategory,
        });
        const {alarmId} = result;
        console.log('getAlarmCategory', result);
        navigation.navigate('YouthListenScreen', {
          alarmId,
        });
      } catch (error) {
        console.log(error);
        Alert.alert('오류', '위로 알람을 불러오는 중 오류가 발생했어요');
      }
    })();
  };

  useEffect(() => {
    if (isHelperNumError) {
      Alert.alert('오류', '조력자 수를 불러오는 중 오류가 발생했어요');
    }
  }, [isHelperNumError]);

  useEffect(() => {
    if (isAlarmComfortError) {
      console.log(alarmComfortError);
      Alert.alert('오류', '위로 알람을 불러오는 중 오류가 발생했어요');
    }
  }, [isAlarmComfortError, alarmComfortError]);

  // return <LoadingScreen />;
  return (
    <ImageBackground
      source={require('@assets/pngs/background/youthMain.png')}
      className="flex-1 items-center">
      <Pressable
        className="flex-row self-start items-center px-[33.5] pt-[32.5]"
        onPress={() => navigation.navigate('SystemStackNav')}>
        <SettingSmallIcon />
        <View className="w-[6.5]" />
        <Txt type="caption1" text="설정" className="text-blue200" />
      </Pressable>

      <View className="self-start">
        <Txt
          type="body2"
          text={`${nickname}님, 반가워요!`}
          className="text-gray300 pt-[60.5] px-[30]"
        />
        <View className="h-[12]" />
        <View className="px-[30]">
          <View className="flex-row items-center">
            <Txt
              type="title2"
              text={`${helperNumData?.result.youthMemberNum}명의 목소리`}
              className="text-yellowPrimary"
            />
            <Txt type="title2" text="가" className="text-white" />
          </View>
          <Txt
            type="title2"
            text="당신의 일상을 비추고 있어요"
            className="text-white"
          />
        </View>
      </View>

      <View
        className={`absolute items-center w-full h-full ${
          clicked ? 'bg-black/50' : ''
        }`}>
        <View className="absolute bottom-[88] items-center">
          {clicked ? (
            <View className="mb-[29] items-center">
              {VOICE_MENU.map(({alarmCategory, alarmCategoryKoreanName}) => (
                <Pressable
                  key={alarmCategory}
                  className="mb-[15] bg-blue400 border border-gray100 h-[59] px-[22] justify-center items-center"
                  style={{borderRadius: 100}}
                  onPress={() => handleButtonClick(alarmCategory)}>
                  <Txt
                    type="title3"
                    text={alarmCategoryKoreanName}
                    className="text-gray100"
                  />
                </Pressable>
              ))}
            </View>
          ) : (
            <View className="mb-[24]">
              <Txt
                type="body3"
                text="당신을 응원하는 목소리를"
                className="text-gray300 text-center"
              />
              <Txt
                type="body3"
                text="들을 수 있어요"
                className="text-gray300 text-center"
              />
            </View>
          )}
          <Pressable
            className={`${
              clicked ? 'bg-blue700' : 'bg-blue500'
            } flex-row justify-center items-center h-[61] w-[160]`}
            style={{borderRadius: 100}}
            onPress={() => setClicked(prev => !prev)}>
            {clicked ? (
              <CancelIcon />
            ) : (
              <View className="w-[43] h-[43] justify-center items-center pr-[5]">
                <LogoIcon />
              </View>
            )}
            {!clicked && (
              <Txt
                type="button"
                text="위로 받기"
                className="text-gray100 pr-[12]"
              />
            )}
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};

export default YouthHomeScreen;
