import {RCD} from '@apis/RCDApis/getRCDList';
import {getTopText} from '@apis/RCDApis/getTopText';
import {postAskGPT} from '@apis/RCDApis/postAskGPT';
import BackIcon from '@assets/svgs/Back.svg';
import AppBar from '@components/atom/AppBar';
import BG from '@components/atom/BG';
import ShadowView from '@components/atom/ShadowView';
import StarPNG from '@components/atom/StarPNG';
import Txt from '@components/atom/Txt';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {HomeStackParamList} from '@type/nav/HomeStackParamList';
import {useEffect, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';

type SelectButtonProps = {
  head: string;
  sub: string;
  gpt: boolean;
  alarmId: number;
  item: RCD;
  type: 'DAILY' | 'COMFORT';
};

const SelectButton = ({
  head,
  sub,
  gpt,
  alarmId,
  item,
  type,
}: SelectButtonProps) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  const gptApiHandler = async () => {
    setIsLoading(true);
    try {
      if (gpt) {
        console.log('alarmId:', alarmId);
        const res = await postAskGPT(alarmId);
        console.log(res);
        navigation.navigate('RCDText', {
          item: item,
          gptRes: res,
          alarmId,
          type,
        });
      } else {
        navigation.navigate('RCDText', {
          item: item,
          gptRes: null,
          alarmId,
          type,
        });
      }
    } catch (e) {
      console.log('err:', e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <TouchableOpacity
      onPress={gptApiHandler}
      className="w-full h-[133] mb-[20]">
      <ShadowView>
        <View className="pl-[33] pr-[20] py-[37] flex-row justify-between items-center">
          <View>
            <Txt type="title4" text={head} className="text-yellowPrimary" />
            <View className="mt-[5]" />
            <Txt type="body4" text={sub} className="text-gray200" />
          </View>
          {isLoading && gpt ? (
            <ActivityIndicator size="small" color="#fafafa" />
          ) : (
            <BackIcon />
          )}
        </View>
      </ShadowView>
    </TouchableOpacity>
  );
};
const RCDSelectText = ({
  route,
}: {
  route: RouteProp<HomeStackParamList, 'RCDSelectText'>;
}) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const {item, type} = route.params;
  const [subTitle, setSubTitle] = useState<string>('');
  const [alarmId, setAlarmId] = useState<number>(0);
  useEffect(() => {
    const getTopTextHandler = async () => {
      const res = await getTopText(item.alarmCategory);
      setSubTitle(res.title);
      setAlarmId(res.alarmId);
    };
    getTopTextHandler();
  }, []);
  return (
    <BG type="solid">
      <AppBar
        title="녹음 내용 작성"
        goBackCallbackFn={() => {
          navigation.goBack();
        }}
        className="absolute top-[0] w-full"
      />
      <View className="flex-1 px-px mt-[100] pt-[52] items-center">
        <StarPNG />
        <View className="mt-[29]  mb-[52]  items-center">
          <Txt
            type="title2"
            text={item.title}
            className="text-white text-center"
          />
          <View className="mt-[19]">
            <Txt
              type="body3"
              text={subTitle}
              className="text-gray_300 text-center"
            />
          </View>
        </View>
        <SelectButton
          head="준비된 문장 읽기"
          sub="제시되는 문장을 수정하고 녹음하기"
          gpt={true}
          alarmId={alarmId}
          item={item}
          type={type}
        />
        <SelectButton
          head="직접 작성하기"
          sub="하고싶은 말을 직접 작성하고 녹음하기"
          gpt={false}
          alarmId={alarmId}
          item={item}
          type={type}
        />
      </View>
    </BG>
  );
};
export default RCDSelectText;
