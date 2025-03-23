import AlarmIcon from '@assets/svgs/alarm.svg';
import AudioIcon from '@assets/svgs/audio.svg';
import {AppBar} from '@components/AppBar';
import {BG} from '@components/BG';
import {Button} from '@components/Button';
import {FlexableMargin} from '@components/FlexableMargin';
import {Toast} from '@components/Toast';
import {CustomText} from '@components/CustomText';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {RootStackParamList} from '@type/nav/RootStackParamList';
import {trackEvent} from '@utils/tracker';
import {navigationRef} from 'App';
import {useCallback, useRef, useState} from 'react';
import {Alert, Platform, View} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'VolunteerNoticeScreen'
>;
type RootProps = NativeStackScreenProps<RootStackParamList>;
type Props = CompositeScreenProps<AuthProps, RootProps>;

const NOTICE_CONTENTS = [
  {
    icon: <AudioIcon />,
    title: '오디오 녹음 동의',
    content:
      '청년의 일상 곳곳에 목소리를 전달하기 위해 필요해요\n서비스 외의 목적으로 사용되지 않아요',
  },
  {
    icon: <AlarmIcon />,
    title: '알림 권한 동의',
    content: '잊지 않고 목소리를 녹음할 수 있도록 도와줄게요',
  },
];

const VolunteerNoticeScreen = ({navigation}: Readonly<Props>) => {
  const [isToast, setIsToast] = useState(false); // 토스트 메시지 표시 상태
  const [toastMessage, setToastMessage] = useState(''); // 토스트 메시지
  const startTime = useRef(0);

  useFocusEffect(
    useCallback(() => {
      startTime.current = new Date().getTime();
    }, []),
  );

  // 오디오 녹음 권한 요청
  const requestAudioPermission = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.MICROPHONE
          : PERMISSIONS.ANDROID.RECORD_AUDIO;

      const status = await check(permission);
      if (status === RESULTS.GRANTED) {
        setIsToast(true);
        setToastMessage('오디오 녹음 권한이 이미 허용되었어요');
        return true;
      } else if (status === RESULTS.DENIED) {
        const result = await request(permission);
        if (result === RESULTS.GRANTED) {
          setIsToast(true);
          setToastMessage('오디오 녹음 권한이 허용되었어요');
          return true;
        } else {
          setIsToast(true);
          setToastMessage('오디오 녹음 권한이 거부되었어요');
          return false;
        }
      } else {
        setIsToast(true);
        setToastMessage('오디오 녹음 권한을 요청할 수 없어요');
        return false;
      }
    } catch (error) {
      console.error('오디오 녹음 권한 요청 중 오류 발생:', error);
      return false;
    }
  };

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

  // 시작하기 버튼 클릭 시 권한 요청
  const handleNext = async () => {
    const audioGranted = await requestAudioPermission();
    const notificationGranted = await requestNotificationPermission();

    trackEvent('permission_audio', {
      status: audioGranted ? 'GRANTED' : 'DENIED',
    });
    trackEvent('permission_push', {
      status: notificationGranted ? 'GRANTED' : 'DENIED',
    });

    if (!audioGranted) {
      Alert.alert(
        '권한 필요',
        '오디오 녹음 및 알림 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
        [
          {
            text: '확인',
            onPress: () => console.log('확인 버튼 클릭'),
          },
        ],
      );
      return;
    }

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

    const endTime = new Date().getTime();
    const viewTime = endTime - startTime.current;

    trackEvent('onboarding_viewtime', {
      step: '2.5',
      view_time: viewTime, // 밀리초 단위
    });

    navigationRef.reset({
      index: 0,
      routes: [{name: 'AppTabNav'}],
    });
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
        text={
          '내일모래에서\n목소리를 전달하기 위해\n오디오 녹음 동의가 필요해요'
        }
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

export {VolunteerNoticeScreen};
