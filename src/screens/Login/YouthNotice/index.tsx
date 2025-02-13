import {postMember} from '@apis/member';
import AlarmCircleIcon from '@assets/svgs/alarmCircle.svg';
import LocationCircleIcon from '@assets/svgs/locationCircle.svg';
import AppBar from '@components/atom/AppBar';
import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import Txt from '@components/atom/Txt';
import useLoading from '@hooks/useLoading';
import Geolocation from '@react-native-community/geolocation';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {MemberDetailRequestData} from '@type/api/member';
import {RootStackParamList} from '@type/nav/RootStackParamList';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  ScrollView,
  View,
} from 'react-native';

type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'YouthNoticeScreen'
>;
type RootProps = NativeStackScreenProps<RootStackParamList>;
type Props = CompositeScreenProps<AuthProps, RootProps>;

const NOTICE_CONTENTS = [
  {
    icon: <AlarmCircleIcon />,
    content: '일상에 따뜻한 한 마디가 필요할 때\n알림을 받을 수 있어요',
  },
  {
    icon: <LocationCircleIcon />,
    content: '지자체의 자립 지원 통계 및 보고에\n소중한 위치 정보가 제공돼요',
  },
];

Geolocation.setRNConfiguration({skipPermissionRequests: false});

const YouthNoticeScreen = ({route, navigation}: Readonly<Props>) => {
  const {wakeUpTime, breakfast, lunch, dinner, sleepTime} = route.params;
  const {isLoading, setIsLoading} = useLoading();

  const requestPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        return await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleNext = async () => {
    (async () => {
      const permission = await requestPermission();
      console.log({permission});
      if (permission !== 'granted') {
        return;
      }

      Geolocation.getCurrentPosition(
        pos => {
          console.log('pos', pos);

          (async () => {
            const data: MemberDetailRequestData = {
              youthMemberInfoDto: {
                wakeUpTime,
                breakfast,
                lunch,
                dinner,
                sleepTime,
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                // latitude: 37.2750791,
                // longitude: 127.047405,
              },
            };

            try {
              const {result} = await postMember(data);
              console.log(result);

              navigation.navigate('YouthStackNav', {
                screen: 'YouthHomeScreen',
                params: {},
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
    })();
  };

  return (
    <BG type="solid">
      <AppBar
        title="주의사항"
        goBackCallbackFn={() => {
          navigation.goBack();
        }}
        className="absolute top-[0] w-full"
      />
      <ScrollView className="flex-1 px-px mt-[64]">
        <View className="flex-1">
          {/* header */}
          <View className="mt-[63]" />
          <Txt
            type="title2"
            text={
              '시작하기에 앞서,\n원활한 서비스를 위해\n권한 동의가 필요해요'
            }
            className="text-white"
          />
          <View className="mt-[25]" />
          {/* section */}
          {NOTICE_CONTENTS.map((item, index) => (
            <View key={index} className="w-full h-auto mt-[37]">
              {item.icon}
              <View className="mt-[20]" />
              <Txt type="body2" text={item.content} className="text-gray200" />
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="absolute left-0 bottom-[55] w-full px-[30]">
        <Button
          text="시작하기"
          onPress={handleNext}
          // disabled={isLoading || !currentLocation}
          isLoading={isLoading}
        />
      </View>
    </BG>
  );
};
export default YouthNoticeScreen;
