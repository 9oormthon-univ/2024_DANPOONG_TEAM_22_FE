import AlarmIcon from '@assets/svgs/alarm.svg';
import LocationIcon from '@assets/svgs/location.svg';
import AppBar from '@components/atom/AppBar';
import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import Toast from '@components/atom/Toast';
import Txt from '@components/atom/Txt';
import usePostYouth from '@hooks/auth/usePostYouth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {YouthRequestData} from '@type/api/member';
import {RootStackParamList} from '@type/nav/RootStackParamList';
import {useState} from 'react';
import {Alert, Platform, ScrollView, View} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'YouthNoticeScreen'
>;
type RootProps = NativeStackScreenProps<RootStackParamList>;
type Props = CompositeScreenProps<AuthProps, RootProps>;

const NOTICE_CONTENTS = [
  {
    icon: <AlarmIcon />,
    title: '알림 권한 동의',
    content: '일상에 곳곳에 따뜻한 목소리를 담은\n알림을 받을 수 있어요',
  },
  {
    icon: <LocationIcon />,
    title: '위치 정보 권한 동의',
    content:
      '지역 별 기상 상황에 맞는 날씨 알림을 받을 수 있어요\n서비스 외의 목적으로 사용되지 않아요',
  },
];

Geolocation.setRNConfiguration({skipPermissionRequests: false});

const YouthNoticeScreen = ({route, navigation}: Readonly<Props>) => {
  const {wakeUpTime, breakfast, lunch, dinner, sleepTime} = route.params;
  const [isToast, setIsToast] = useState(false); // 토스트 메시지 표시 상태
  const [toastMessage, setToastMessage] = useState(''); // 토스트 메시지
  const {mutate: postYouth} = usePostYouth();

  // 위치 정보 권한 요청
  const requestLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      const status = await check(permission);
      if (status === RESULTS.GRANTED) {
        setIsToast(true);
        setToastMessage('위치 정보 권한이 이미 허용되었어요');
        return true;
      } else if (status === RESULTS.DENIED) {
        const result = await request(permission);
        if (result === RESULTS.GRANTED) {
          setIsToast(true);
          setToastMessage('위치 정보 권한이 허용되었어요');
          return true;
        } else {
          setIsToast(true);
          setToastMessage('위치 정보 권한이 거부되었어요');
          return false;
        }
      } else {
        setIsToast(true);
        setToastMessage('위치 정보 권한을 요청할 수 없어요');
        return false;
      }
    } catch (error) {
      console.error('위치 정보 권한 요청 중 오류 발생:', error);
      return false;
    }
  };

  // 시작하기 버튼 클릭 시 권한 요청
  const handleNext = async () => {
    const locationGranted = await requestLocationPermission();

    if (!locationGranted) {
      Alert.alert(
        '권한 필요',
        '위치 정보 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
        [
          {
            text: '확인',
            onPress: () => console.log('확인 버튼 클릭'),
          },
        ],
      );
      return;
    }

    Geolocation.getCurrentPosition(
      pos => {
        console.log('pos', pos);

        (async () => {
          const data: YouthRequestData = {
            wakeUpTime,
            breakfast,
            lunch,
            dinner,
            sleepTime,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };

          try {
            // TODO: api 테스트
            postYouth(data);
            AsyncStorage.setItem('lat', pos.coords.latitude.toString());
            AsyncStorage.setItem('lng', pos.coords.longitude.toString());
            navigation.navigate('YouthStackNav', {
              screen: 'YouthHomeScreen',
            });
          } catch (error) {
            console.log(error);
            Alert.alert('오류', '회원가입 중 오류가 발생했어요');
          }
        })();
      },
      error => {
        console.log('error', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 3600,
      },
    );
  };

  return (
    <BG type="solid">
      <AppBar
        title="접근 권한 동의"
        goBackCallbackFn={() => {
          navigation.goBack();
        }}
        className="absolute top-[0] w-full"
      />
      <View className="h-[64]" />

      <ScrollView className="flex-1 px-px">
        <View className="flex-1">
          {/* header */}
          <View className="mt-[40]" />
          <Txt
            type="title2"
            text={'거의 다 왔어요!\n원활한 서비스를 위해\n권한 동의가 필요해요'}
            className="text-white"
          />
          {/* section */}
          {NOTICE_CONTENTS.map((item, index) => (
            <View key={index} className="w-full h-auto mt-[40]">
              {item.icon}
              <View className="mt-[24]" />
              <Txt
                type="title4"
                text={item.title}
                className="text-yellowPrimary"
              />
              <View className="mt-[10]" />
              <Txt type="body4" text={item.content} className="text-gray200" />
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="absolute left-0 bottom-[55] w-full px-[30]">
        <Button text="시작하기" onPress={handleNext} />
      </View>

      <Toast
        text={toastMessage}
        isToast={isToast}
        setIsToast={() => setIsToast(false)}
      />
    </BG>
  );
};
export default YouthNoticeScreen;
