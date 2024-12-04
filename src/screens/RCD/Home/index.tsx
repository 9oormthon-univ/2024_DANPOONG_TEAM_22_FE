// React Native 및 Navigation 관련 임포트
import {View, TouchableOpacity, ImageBackground} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';

// 커스텀 컴포넌트 임포트
import Txt from '@components/atom/Txt';
import BG from '@components/atom/BG';

// 타입 및 상수 임포트
import {HomeStackParamList} from '@type/nav/HomeStackParamList';
import {RecordType} from '@type/RecordType';

// SVG 아이콘 임포트
import Main1 from '@assets/svgs/Main1.svg';
import Main2 from '@assets/svgs/Main2.svg';
import Main3 from '@assets/svgs/Main3.svg';
import MainArrow from '@assets/svgs/MainArrow.svg';

// API 및 스토리지 관련 임포트
import {getYouthNum} from '@apis/RCDApis/getYouthNum';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 홈 화면 컴포넌트
 * 청년들의 수를 표시하고 녹음 유형을 선택할 수 있는 메인 화면
 */
const HomeScreen = () => {
  // 상태 관리
  const [nickname, setNickname] = useState('');
  const [youthNum, setYouthNum] = useState<number>(999);

  // 닉네임 불러오기
  useEffect(() => {
    (async () => {
      const nickname = await AsyncStorage.getItem('nickname');
      setNickname(nickname ?? '');
    })();
  }, []);

  // 청년 수 불러오기
  useEffect(() => {
    getYouthNum().then(num => {
      console.log('youthNum:', num);
      setYouthNum(num);
    });
  }, []);

  return (
    <BG type="main">
      {/* 배경 이미지 */}
      <ImageBackground
        source={require('@assets/pngs/mainBG.png')}
        style={{position: 'absolute', bottom: 0, width: '100%', height: 762}}
      />
      {/* 전체 frame */}
      <View className="flex-1 px-[30] pt-[117]">
        {/* header */}
        <View className="w-full mb-[46]">
          <Txt
            type="title3"
            text={`${nickname ?? ''}님, 반가워요!`}
            className="text-gray300"
          />
          <View className="flex flex-row mt-[9]">
            <Txt
              type="title2"
              text={`${youthNum}명의 청년들`}
              className="text-yellowPrimary"
            />
            <Txt type="title2" text="이" className="text-white" />
          </View>
          <Txt
            type="title2"
            text={'당신의 목소리를 기다리고 있어요'}
            className="text-white"
          />
        </View>
        {/* button section*/}
        <View className="w-full h-[253] relative">
          {(['DAILY', 'COMFORT', 'INFO'] as RecordType[]).map((type) => (
            <SelectBtn key={type} type={type} />
          ))}
        </View>
      </View>
    </BG>
  );
};
export default HomeScreen;

/**
 * 녹음 유형 선택 버튼 컴포넌트
 * @param type - 녹음 유형 (DAILY: 일상, COMFORT: 위로, INFO: 정보)
 */
const SelectBtn = ({type}: {type: RecordType}) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  
  // 버튼 위치 설정
  const addaptivePosition = 
  type === 'DAILY' ? 'top-[0] left-[0]' : 
    type === 'COMFORT'
      ? 'bottom-[0] left-[0]'
      : 'top-[0] right-[0]';
      
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('RCDList', {type});
      }}
      className={`w-[168] h-[116] px-[25] py-[20] bg-solid border border-white/10 justify-between absolute ${addaptivePosition}`}
      style={{borderRadius: 10}}>
      {/* 아이콘 */}
        <View className="absolute top-[18] left-[27]">
          {type === 'DAILY' ? <Main1 /> : type === 'COMFORT' ? <Main2 /> : <Main3 />}
        </View>
        {/* 텍스트와 화살표 */}
        <View className="absolute bottom-[18] left-[27] flex flex-row items-center justify-between w-[120]">
          <View className="flex flex-row items-center">        
            <Txt
          type="title3"
          text={`${type === 'DAILY' ? '일상' : type === 'COMFORT' ? '위로' : '정보'}`}
          className="text-yellowPrimary"
        />
         <Txt
          type="title3"
          text={`${type === 'COMFORT' ? '의 말' : ' 알림'}`}
          className="text-white "
        />
        </View>

        <View className="">
          <MainArrow />
        </View>
        </View>

    </TouchableOpacity>
  );
};
