// 필요한 API 관련 import
import {RCD} from '@apis/RCDApis/getRCDList';
import {getTopText} from '@apis/RCDApis/getTopText';
import {postAskGPT} from '@apis/RCDApis/postAskGPT';

// 아이콘 및 컴포넌트 import
import BackIcon from '@assets/svgs/Back.svg';
import AppBar from '@components/atom/AppBar';
import BG from '@components/atom/BG';
import ShadowView from '@components/atom/ShadowView';
import StarPNG from '@components/atom/StarPNG';
import Txt from '@components/atom/Txt';
import { useStatusBarStyle } from '@hooks/useStatusBarStyle';
import { RCDSelectButtonConstant } from '@constants/RCDSelectButtonConstant';
// React Navigation 관련 import
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';

// 타입 import
import {HomeStackParamList} from '@type/nav/HomeStackParamList';
import {RecordType} from '@type/RecordType';

// React 관련 import
import {useEffect, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';

// SelectButton 컴포넌트의 Props 타입 정의
type SelectButtonProps = {
  head: string;
  sub: string;
  gpt: boolean;
  alarmId: number;
  item: RCD;
  type: RecordType;
};

/**
 * 선택 버튼 컴포넌트
 * GPT API 호출 여부에 따라 다른 동작을 수행하는 버튼
 */
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

  // GPT API 호출 및 네비게이션 처리
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

/**
 * RCD 텍스트 선택 화면 컴포넌트
 * 사용자가 녹음할 텍스트를 선택하는 화면
 */
const RCDSelectText = ({
  route,
}: {
  route: RouteProp<HomeStackParamList, 'RCDSelectText'>;
}) => {
   // 상태바 스타일 설정
   const BackColorType = 'solid';
   useStatusBarStyle(BackColorType);
   
  
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const {item, type} = route.params;
  const [subTitle, setSubTitle] = useState<string>('');
  const [alarmId, setAlarmId] = useState<number>(0);

  // 초기 데이터 로드
  useEffect(() => {
    const getTopTextHandler = async () => {
      const res = await getTopText(item.children[0]);
      setSubTitle(res.title);
      setAlarmId(res.alarmId);
    };
    getTopTextHandler();
  }, []);

  return (
    <BG type={BackColorType}>
      {/* 상단 앱바 */}
      <AppBar
        title="녹음 내용 작성"
        goBackCallbackFn={() => {
          navigation.goBack();
        }}
        className="absolute top-[0] w-full"
      />
      {/* 메인 컨텐츠 */}
      <View className="flex-1 px-px mt-[100] pt-[52] items-center">
        <StarPNG />
        {/* 제목 섹션 */}
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
              className="text-gray300 text-center"
            />
          </View>
        </View>
        {/* 선택 버튼 섹션 */}
        {RCDSelectButtonConstant.map((button) => (
          <SelectButton
            key={button.head}
            head={button.head}  
            sub={button.sub}
            gpt={button.gpt}
            alarmId={alarmId}
            item={item}
            type={type}
          />
        ))}
      </View>
    </BG>
  );
};

export default RCDSelectText;
