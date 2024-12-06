// 필요한 컴포넌트 및 아이콘 import
  import {View} from 'react-native';
import BackIcon from '@assets/svgs/Back.svg';
import BG from '@components/atom/BG';
import Txt from '@components/atom/Txt';

// 시스템 화면 컴포넌트
const SystemScreen = () => {
  return (
    <BG type="main">
      {/* 메인 컨테이너 */}
      <View className="flex-1 items-center pt-[65] px-px">
        {/* 시스템 메뉴 버튼들 */}
        <SystemButton title="내 계정" sub="로그아웃 및 회원탈퇴하기" />
        <SystemButton title="이용약관" sub="이용약관 확인하기" />
        <SystemButton title="개인정보정책" sub="개인정보정책 확인하기" />
      </View>
    </BG>
  );
};
export default SystemScreen;

// 시스템 메뉴 버튼 컴포넌트
const SystemButton = ({title, sub}: {title: string; sub: string}) => {
  return (
    // 버튼 컨테이너
    <View className="w-full h-[92] flex-row justify-between items-center">
      {/* 텍스트 영역 */}
      <View className="flex-1">
        {/* 메뉴 제목 */}
        <Txt type="title4" text={title} className="text-white" />
        {/* 간격 조정 */}
        <View className="mt-[4.9]" />
        {/* 메뉴 설명 */}
        <Txt type="caption1" text={sub} className="text-gray200" />
      </View>
      {/* 화살표 아이콘 */}
      <BackIcon />
    </View>
  );
};
