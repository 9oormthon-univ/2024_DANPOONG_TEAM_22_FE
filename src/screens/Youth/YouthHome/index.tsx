import {getAlarmCategoryByAlarmCategoryId} from '@apis/alarm';
import Txt from '@components/atom/Txt';
import useGetAlarmComfort from '@hooks/alarm/useGetAlarmComfort';
import useGetHelperNum from '@hooks/member/useGetHelperNum';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {YouthStackParamList} from '@stackNav/Youth';
import {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  View,
} from 'react-native';
import CancelIcon from '@assets/svgs/cancel.svg';

type YouthProps = NativeStackScreenProps<
  YouthStackParamList,
  'YouthHomeScreen'
>;

const YouthHomeScreen = ({navigation}: Readonly<YouthProps>) => {
  const [clicked, setClicked] = useState(false);
  const {data: helperNumData, isError: isHelperNumError} = useGetHelperNum();
  const [nickname, setNickname] = useState('');
  const {
    data: alarmComfortData,
    isError: isAlarmComfortError,
    error: alarmComfortError,
  } = useGetAlarmComfort();

  useEffect(() => {
    (async () => {
      const nickname = await AsyncStorage.getItem('nickname');
      setNickname(nickname ?? '');
    })();
  }, []);

  const handleButtonClick = (label: string) => {
    if (!alarmComfortData) {
      return;
    }

    const alarms = alarmComfortData.result.find(alarm => alarm.name === label);
    console.log(label, alarms);
    const alarmCategoryId = alarms?.children[0].id;

    (async () => {
      if (!alarmCategoryId) {
        return;
      }

      try {
        const {result} = await getAlarmCategoryByAlarmCategoryId({
          alarmCategoryId,
        });
        const {alarmId, title} = result;
        console.log('alarmComfortData', alarmComfortData);
        console.log('getAlarmCategory', result);
        navigation.navigate('YouthListenScreen', {
          alarmId,
          script: title,
        });
      } catch (error) {
        console.error(error);
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
      console.error(alarmComfortError);
      Alert.alert('오류', '위로 알람을 불러오는 중 오류가 발생했어요');
    }
  }, [isAlarmComfortError, alarmComfortError]);

  // return <LoadingScreen />;
  return (
    <SafeAreaView className="flex-1">
      <ImageBackground
        source={require('../../../../assets/pngs/background/background_youth1.png')}
        className="flex-1 items-center">
        <View className="self-start">
          <Txt
            type="title3"
            text={`${nickname ?? '모래바람'}님, 반가워요!`}
            className="text-gray300 pt-[117] px-[30]"
          />
          <View className="mt-[9] px-[30]">
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
                <Pressable
                  className="mb-[15] bg-tabIcon border border-gray100 h-[59] px-[22] justify-center items-center"
                  style={{borderRadius: 100}}
                  onPress={() => handleButtonClick('위로')}>
                  <Txt type="title3" text="위로" className="text-gray100" />
                </Pressable>
                <Pressable
                  className="mb-[15] bg-tabIcon border border-gray100 h-[59] px-[22] justify-center items-center"
                  style={{borderRadius: 100}}
                  onPress={() => handleButtonClick('칭찬과 격려')}>
                  <Txt
                    type="title3"
                    text="칭찬과 격려"
                    className="text-gray100"
                  />
                </Pressable>
                <Pressable
                  className="bg-tabIcon border border-gray100 h-[59] px-[22] justify-center items-center"
                  style={{borderRadius: 100}}
                  onPress={() => handleButtonClick('우울과 불안')}>
                  <Txt
                    type="title3"
                    text="우울과 불안"
                    className="text-gray100"
                  />
                </Pressable>
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
                clicked ? 'bg-solid' : 'bg-bottomNavigation'
              } flex-row justify-center items-center h-[61] w-[160]`}
              style={{borderRadius: 100}}
              onPress={() => setClicked(prev => !prev)}>
              {clicked ? (
                <CancelIcon />
              ) : (
                <Image
                  source={require('../../../../assets/pngs/logo/vector/vector_logo_white.png')}
                  className="w-[43] h-[43]"
                />
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
    </SafeAreaView>
  );
};

export default YouthHomeScreen;