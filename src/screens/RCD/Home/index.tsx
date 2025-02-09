// React 및 React Native 관련 임포트
import {View, TouchableOpacity, ImageBackground} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';

// 커스텀 컴포넌트 임포트
import Txt from '@components/atom/Txt';
import BG from '@components/atom/BG';

// 타입 및 상수 임포트
import {HomeStackParamList} from '@type/nav/HomeStackParamList';
import {RecordType} from '@type/RecordType';
import {RecordTypeConstant} from '@constants/RecordType';

// SVG 아이콘 임포트
import Main1 from '@assets/svgs/Main1.svg';
import Main2 from '@assets/svgs/Main2.svg';
// import Main3 from '@assets/svgs/Main3.svg';
// import MainArrow from '@assets/svgs/MainArrow.svg';
import MainArrow2 from '@assets/svgs/MainArrow2.svg';

// API 및 스토리지 관련 임포트
import {getYouthNum} from '@apis/RCDApis/getYouthNum';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import useStatusBarHeight from '@hooks/useStatusBarHeight';
/**
 * 홈 화면 컴포넌트
 * 청년들의 수를 표시하고 녹음 유형을 선택할 수 있는 메인 화면
 */
const HomeScreen = () => {
  const statusBarHeight = useStatusBarHeight();
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
      setYouthNum(num);
    });
  }, []);

  return (
    <BG type="main">
      {/* 배경 이미지 */}
      <ImageBackground
        source={require('@assets/pngs/BGmain.png')}
        style={{position: 'absolute', bottom: 0, width: '100%', height: 762}}
      />
      <View style={{height: statusBarHeight}}/>
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
          {Object.values(RecordTypeConstant).map(type => (
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

// 일상,위로,정보 알림이 있었을때의 버튼 
// 정보 알림 기능을 빼면서 디자인이 달라져서 주석해놓음 롤백 가능성 있음
// const SelectBtn = ({type}: {type: RecordType}) => {
//   const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

//   // 버튼 위치 설정
//   const addaptivePosition =
//     type === RecordTypeConstant.DAILY
//       ? 'top-[0] left-[0]'
//       : type === RecordTypeConstant.COMFORT
//       ? 'bottom-[0] left-[0]'
//       : 'top-[0] right-[0]';

//   return (
//     <TouchableOpacity
//       onPress={() => {
//         navigation.navigate('RCDList', {type});
//       }}
//       className={`w-[168] h-[116] px-[25] py-[20] bg-solid border border-white/10 justify-between absolute ${addaptivePosition}`}
//       style={{borderRadius: 10}}>
//       {/* 아이콘 */}
//       <View className="absolute top-[18] left-[27]">
//         {type === RecordTypeConstant.DAILY ? (
//           <Main1 />
//         ) : type === RecordTypeConstant.COMFORT ? (
//           <Main2 />
//         ) : (
//           <Main3 />
//         )}
//       </View>
//       {/* 텍스트와 화살표 */}
//       <View className="absolute bottom-[18] left-[27] flex flex-row items-center justify-between w-[120]">
//         <View className="flex flex-row items-center">
//           <Txt
//             type="title3"
//             text={`${
//               type === RecordTypeConstant.DAILY
//                 ? '일상'
//                 : type === RecordTypeConstant.COMFORT
//                 ? '위로'
//                 : '정보'
//             }`}
//             className="text-yellowPrimary"
//           />
//           <Txt
//             type="title3"
//             text={`${type === RecordTypeConstant.COMFORT ? '의 말' : ' 알림'}`}
//             className="text-white "
//           />
//         </View>
//         <MainArrow />
//       </View>
//     </TouchableOpacity>
//   );
// };

// 일상, 위로 알림만 있고 정보 알림이 없을때의 버튼
const SelectBtn = ({type}: {type: RecordType}) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  // 버튼 위치 설정
  const addaptivePosition =
    type === RecordTypeConstant.DAILY
      ? 'top-[0] left-[0]'
      : 'top-[0] right-[0]';

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('RCDList', {type});
      }}
      className={`w-[168] h-[207] px-[25] py-[20] bg-solid border border-white/10 absolute ${addaptivePosition}`}
      style={{borderRadius: 10}}>
      {/* 아이콘 */}
      <View className="">
        {type === RecordTypeConstant.DAILY ? <Main1 /> : <Main2 />}
      </View>
      {/* 텍스트와 화살표 */}
        <View className="mt-[19] flex flex-row items-center">
          <Txt
            type="title3"
            text={`${type === RecordTypeConstant.DAILY ? '일상' : '위로'}`}
            className="text-white"
          />
          <Txt
            type="title3"
            text={`${type === RecordTypeConstant.COMFORT ? '의 말' : ' 알림'}`}
            className="text-white "
          />
        </View>
        {/* 녹음하기 텍스트와 화살표 */}
      <View className="mt-[45] flex flex-row items-center w-full">
        <Txt type="title3" text="녹음하기" className="text-yellowPrimary"/>
        <View className='absolute right-[-8]'>
          <MainArrow2/>
          </View>
        </View>
    </TouchableOpacity>



  );
};