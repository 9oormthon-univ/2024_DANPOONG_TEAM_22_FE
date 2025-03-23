import AlarmIcon from '@assets/svgs/alarm.svg';
import LocationIcon from '@assets/svgs/location.svg';
import {AppBar} from '@components/AppBar';
import {BG} from '@components/BG';
import {Button} from '@components/Button';
import {FlexableMargin} from '@components/FlexableMargin';
import {Toast} from '@components/Toast';
import {CustomText} from '@components/CustomText';
import {usePostYouth} from '@hooks/auth/usePostYouth';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {YouthRequestData} from '@type/api/member';
import {RootStackParamList} from '@type/nav/RootStackParamList';
import {trackEvent} from '@utils/tracker';
import {useCallback, useRef, useState} from 'react';
import {Alert, Platform, View} from 'react-native';
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

  const startTime = useRef(0);

  useFocusEffect(
    useCallback(() => {
      startTime.current = new Date().getTime();
    }, []),
  );

  // 알림 권한 요청
  const requestNotificationPermission = async () => {
    try {
      const settings = await notifee.requestPermission();
      if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        setIsToast(true);
        setToastMessage('알림 권한이 허용되었어요');
        return true;
      } else {
        setIsToast(true);
        setToastMessage('알림 권한이 거부되었어요');
        return false;
      }
    } catch (error) {
      console.error('알림 권한 요청 중 오류 발생:', error);
      return false;
    }
  };

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
    const notificationGranted = await requestNotificationPermission();
    const locationGranted = await requestLocationPermission();

    trackEvent('permission_push', {
      status: notificationGranted ? 'GRANTED' : 'DENIED',
    });
    trackEvent('permission_location', {
      status: locationGranted ? 'GRANTED' : 'DENIED',
    });

    if (!notificationGranted) {
      Alert.alert(
        '권한 필요',
        '알림 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
        [
          {
            text: '확인',
            onPress: () => console.log('확인 버튼 클릭'),
          },
        ],
      );
      return;
    }

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
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            wakeUpTime,
            sleepTime,
            breakfast,
            lunch,
            dinner,
          };

          try {
            postYouth(data);

            if (pos.coords.latitude && pos.coords.longitude) {
              await AsyncStorage.setItem('lat', String(pos.coords.latitude));
              await AsyncStorage.setItem('lng', String(pos.coords.longitude));
            }

            const endTime = new Date().getTime();
            const viewTime = endTime - startTime.current;

            trackEvent('onboarding_viewtime', {
              step: '3.8',
              view_time: viewTime, // 밀리초 단위
            });

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
        enableHighAccuracy: false,
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

      <FlexableMargin flexGrow={80} />

      {/* header */}
      <CustomText        type="title2"
        text={'거의 다 왔어요!\n원활한 서비스를 위해\n권한 동의가 필요해요'}
        className="text-white px-px"
      />
      {/* section */}
      {NOTICE_CONTENTS.map((item, index) => (
        <View key={index} className="px-px flex-grow-[55]">
          <FlexableMargin flexGrow={40} />
          {item.icon}
          <FlexableMargin flexGrow={24} />
          <CustomText type="title4" text={item.title} className="text-yellowPrimary" />
          <FlexableMargin flexGrow={10} />
          <CustomText type="body4" text={item.content} className="text-gray200" />
        </View>
      ))}

      <FlexableMargin flexGrow={140} />

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

export {YouthNoticeScreen};
