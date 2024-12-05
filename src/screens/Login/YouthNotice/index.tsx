import AlarmCircleIcon from '@assets/svgs/alarmCircle.svg';
import AppBar from '@components/atom/AppBar';
import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import Txt from '@components/atom/Txt';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {RootStackParamList} from '@type/nav/RootStackParamList';
import {ScrollView, View} from 'react-native';
import { useStatusBarStyle } from '@hooks/useStatusBarStyle';
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
];

const YouthNoticeScreen = ({navigation}: Readonly<Props>) => {
  // 상태바 스타일 설정
  const BackColorType = 'solid';
  useStatusBarStyle(BackColorType);

  const handleNext = () => {
    navigation.navigate('YouthStackNav', {
      screen: 'YouthHomeScreen',
      params: {},
    });
  };

  return (
    <BG type={BackColorType}>
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
              '시작하기에 앞서,\n원활한 서비스를 위해\n알람 수신 동의가 필요해요'
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

      <View className="absolute left-0 bottom-[30] w-full px-[40]">
        <Button text="시작하기" onPress={handleNext} />
      </View>
    </BG>
  );
};
export default YouthNoticeScreen;
