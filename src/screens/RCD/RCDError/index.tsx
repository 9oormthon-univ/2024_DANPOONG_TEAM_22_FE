import { View } from 'react-native';
import BG from '@components/atom/BG';
import AppBar from '@components/atom/AppBar';
import Txt from '@components/atom/Txt';
import Button from '@components/atom/Button';
import Notice1 from '@assets/svgs/Notice1.svg';
import Notice2 from '@assets/svgs/Notice2.svg';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '@type/nav/HomeStackParamList';

const RCDErrorScreen = ({
  route,
}: {
  route: RouteProp<HomeStackParamList, 'RCDError'>;
}) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const {type} = route.params;

  return (
    <BG type="solid">
      <AppBar
        title=""
        exitCallbackFn={() => {
          navigation.goBack();
    }}
    className="absolute top-[0] w-full"
  />
  <View className="flex-1 items-center justify-between mt-[65]">
    <View className="absolute top-[194] items-center">
      {type === 'bad' ? <Notice1 /> : <Notice2 />}
      <View className="mt-[43]" />
      <Txt
        type="title2"
        text={
          type === 'bad'
            ? '부적절한 표현이 감지되어\n녹음을 전송할 수 없어요'
            : type === 'noisy'
            ? '주변 소음이 크게 들려서\n녹음을 전송할 수 없었어요'
            : '서버에 문제가 생겨\n녹음을 전송할 수 없었어요'
        }
        className="text-white text-center"
      />
      <View className="mt-[25]" />
      <Txt
        type="body4"
        text={
          type === 'bad'
            ? '적절한 언어로 다시 녹음해 주시겠어요?'
            : type === 'noisy'
            ? '조용한 장소에서 다시 녹음해 주시겠어요?'
            : '다시 시도해 주시겠어요?'
        }
        className="text-gray300 text-center"
      />
    </View>
    <View className="px-px w-full absolute bottom-[50]">
      <Button
        text="다시 녹음하기"
        onPress={() => {
          if (type === 'bad') {
            navigation.navigate('Home');
          } else {
            navigation.goBack();
          }
        }}
        disabled={false}
      />
    </View>
      </View>
    </BG>
  );
};

export default RCDErrorScreen;
