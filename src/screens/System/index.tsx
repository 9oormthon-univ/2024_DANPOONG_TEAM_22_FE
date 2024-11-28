import {View} from 'react-native';
import BackIcon from '../../../assets/svgs/Back.svg';
import BG from '../../components/atom/BG';
import Txt from '../../components/atom/Txt';

const SystemScreen = () => {
  return (
    <BG type="main">
      <View className="flex-1 items-center pt-[35] px-px">
        <SystemButton title="내 계정" sub="로그아웃 및 회원탈퇴하기" />
        <SystemButton title="이용약관" sub="이용약관 확인하기" />
        <SystemButton title="개인정보정책" sub="개인정보정책 확인하기" />
      </View>
    </BG>
  );
};
export default SystemScreen;

const SystemButton = ({title, sub}: {title: string; sub: string}) => {
  return (
    <View className="w-full h-[92] flex-row justify-between items-center">
      <View className="flex-1">
        <Txt type="title4" text={title} className="text-white" />
        <View className="mt-[4.9]" />
        <Txt type="caption1" text={sub} className="text-gray200" />
      </View>
      <BackIcon />
    </View>
  );
};
