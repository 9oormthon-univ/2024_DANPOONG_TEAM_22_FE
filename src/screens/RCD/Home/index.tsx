import { useCallback, useEffect, useState } from 'react';
import { ImageBackground, TouchableOpacity, View } from 'react-native';

import { getMemberYouthNum } from '@apis/RetrieveMemberInformation/get/MemberYouthNum/fetch';
import { BG } from '@components/BG';
import { CustomText } from '@components/CustomText';
import { FlexableMargin } from '@components/FlexableMargin';
import { Modal } from '@components/Modal';
import { RecordTypeConstant } from '@constants/RecordType';
import { Portal } from '@gorhom/portal';
import { useAppVersion } from '@hooks/useAppVersion';
import { useModal } from '@hooks/useModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NavigationProp } from '@react-navigation/native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { HomeStackParamList } from '@type/nav/HomeStackParamList';
import type { RecordType } from '@type/RecordType';
import { trackEvent } from '@utils/tracker';

import Main1 from '@assets/svgs/Main1.svg';
import Main2 from '@assets/svgs/Main2.svg';
import MainArrow2 from '@assets/svgs/MainArrow2.svg';
// import Main3 from '@assets/svgs/Main3.svg';
// import MainArrow from '@assets/svgs/MainArrow.svg';

// * 홈 화면 컴포넌트 * 청년들의 수를 표시하고 녹음 유형을 선택할 수 있는 메인 화면
export const HomeScreen = () => {
  // 상태 관리
  const [nickname, setNickname] = useState('');
  const [youthNum, setYouthNum] = useState<number>(999);
  const { visible, openModal, closeModal } = useModal();
  const { isUpdateAvailable, goToStore } = useAppVersion();

  useEffect(() => {
    if (isUpdateAvailable) {
      openModal();
    }
  }, [isUpdateAvailable]);

  // 닉네임 불러오기 - 화면이 포커싱될 때마다 실행
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const nickname = await AsyncStorage.getItem('nickname');

        setNickname(nickname ?? '');
      })();
    }, []),
  );

  // 청년 수 불러오기
  useEffect(() => {
    getMemberYouthNum().then(num => {
      setYouthNum(num);
    });
  }, []);

  return (
    <BG type="main">
      {/* 배경 이미지 */}
      <ImageBackground
        source={require('@assets/pngs/BGmain.png')}
        style={{
          position: 'absolute',
          bottom: -23,
          width: '100%',
          height: '100%',
        }}
      />
      {/* 전체 frame */}
      <View className="flex-1 px-[30] pt-[117]">
        {/* header */}
        <View className="w-full mb-[46]">
          <CustomText
            type="title3"
            text={`${nickname ?? ''}님, 반가워요!`}
            className="text-gray300"
          />
          <View className="flex flex-row mt-[9]">
            <CustomText
              type="title2"
              text={`${youthNum}명의 청년들`}
              className="text-yellowPrimary"
            />
            <CustomText type="title2" text="이" className="text-white" />
          </View>
          <CustomText
            type="title2"
            text={'당신의 목소리를 기다리고 있어요'}
            className="text-white"
          />
        </View>
        {/* button section*/}
        <View className="w-full h-[253] flex flex-row justify-between">
          <SelectBtn type={RecordTypeConstant.DAILY} />
          <SelectBtn type={RecordTypeConstant.COMFORT} />
          {/* {Object.values(RecordTypeConstant).map(type => (
            <SelectBtn key={type} type={type} />
          ))} */}
        </View>
      </View>
      <Portal>
        <Modal
          type="info"
          visible={visible}
          buttonRatio="1:2"
          cancelText="나중에"
          confirmText="업데이트"
          onCancel={closeModal}
          onConfirm={goToStore}>
          <View className="mt-[26]" />
          <CustomText
            type="title4"
            text="최신 버전으로 업데이트 해주세요"
            className="text-white"
          />
          <View className="mt-[13]" />

          <CustomText
            type="caption1"
            text={`더 나은 내일모래가 준비됐어요\n스토어에서 최신 버전으로 업데이트 해주세요`}
            className="text-gray300 text-center"
          />
          <View className="mt-[29]" />
        </Modal>
      </Portal>
    </BG>
  );
};

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
//       className={`w-[168] h-[116] px-[25] py-[20] bg-blue700 border border-white/10 justify-between absolute ${addaptivePosition}`}
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
//           <CustomText//             type="title3"
//             text={`${
//               type === RecordTypeConstant.DAILY
//                 ? '일상'
//                 : type === RecordTypeConstant.COMFORT
//                 ? '위로'
//                 : '정보'
//             }`}
//             className="text-yellowPrimary"
//           />
//           <CustomText//             type="title3"
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
const SelectBtn = ({ type }: { type: RecordType }) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('RCDList', { type });
        trackEvent('recording_type_select', { type });
      }}
      className=" bg-blue700 border border-white/10"
      style={{ borderRadius: 10, width: '47.5%', aspectRatio: 168 / 207 }}>
      <FlexableMargin flexGrow={20} />
      {/* 아이콘 */}
      <View className="flex flex-row">
        <FlexableMargin flexGrow={28} />
        <View style={{ flexGrow: 112 }}>
          {type === RecordTypeConstant.DAILY ? <Main1 /> : <Main2 />}
        </View>
        <FlexableMargin flexGrow={28} />
      </View>
      <FlexableMargin flexGrow={20} />

      {/* 텍스트 */}
      <View className="flex flex-row">
        <FlexableMargin flexGrow={78} />
        <View style={{ flexDirection: 'row', flexGrow: 112 }}>
          <CustomText
            type="title3"
            text={`${type === RecordTypeConstant.DAILY ? '일상' : '위로'}`}
            className="text-white"
          />
          <CustomText
            type="title3"
            text={`${type === RecordTypeConstant.COMFORT ? '의 말' : ' 알림'}`}
            className="text-white "
          />
        </View>
        <FlexableMargin flexGrow={78} />
      </View>
      <FlexableMargin flexGrow={43} />

      {/* 녹음하기 텍스트와 화살표 */}
      <View className="flex flex-row w-full">
        <FlexableMargin flexGrow={78} />

        <CustomText
          type="title3"
          text="녹음하기"
          className="text-yellowPrimary"
        />
        <FlexableMargin flexGrow={28} />

        <View className="flex justify-center items-center">
          <MainArrow2 />
        </View>
        <FlexableMargin flexGrow={78} />
      </View>
      <FlexableMargin flexGrow={20} />
    </TouchableOpacity>
  );
};
