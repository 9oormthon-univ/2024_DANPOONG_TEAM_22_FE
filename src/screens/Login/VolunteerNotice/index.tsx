import MoraeCircleIcon from '@assets/svgs/moraeCircle.svg';
import VoiceCircleIcon from '@assets/svgs/voiceCircle.svg';
import AppBar from '@components/atom/AppBar';
import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import Txt from '@components/atom/Txt';
import { useStatusBarStyle } from '@hooks/useStatusBarStyle';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {RootStackParamList} from '@type/nav/RootStackParamList';
import {ScrollView, View} from 'react-native';

type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'VolunteerNoticeScreen'
>;
type RootProps = NativeStackScreenProps<RootStackParamList>;
type Props = CompositeScreenProps<AuthProps, RootProps>;

const NOTICE_CONTENTS = [
  {
    icon: <VoiceCircleIcon />,
    content: '청년의 일상에 도착할\n다정한 한 마디를 전할 수 있어요',
  },
  {
    icon: <MoraeCircleIcon />,
    content: '청년의 삶에 건네줄\n위로와 조언의 이야기를 전할 수 있어요',
  },
];

const VolunteerNoticeScreen = ({navigation}: Readonly<Props>) => {
  // 상태바 스타일 설정
  const BackColorType = 'solid';
  useStatusBarStyle(BackColorType); 

  const handleNext = () => {
    navigation.navigate('AppTabNav');
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
              '시작하기에 앞서,\n청년에게 목소리를 전하기 위해\n오디오 녹음 동의가 필요해요'
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
export default VolunteerNoticeScreen;
