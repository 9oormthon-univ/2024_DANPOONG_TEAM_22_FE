// 필요한 컴포넌트
import BG from '@components/atom/BG';
import Txt from '@components/atom/Txt';
import { Pressable, View } from 'react-native';
import { useNavigation, NavigationProp} from '@react-navigation/native';
import { SystemStackParamList } from '@type/nav/SystemStackParamList';
import SystemButton from '@components/atom/SystemButton';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 아이콘
import BackIcon from '@assets/svgs/Back.svg';
import ProfileIcon from '@assets/svgs/Profile.svg';
import ProfileIcon2 from '@assets/svgs/Profile2.svg';
import KakaoLogo from '@assets/svgs/KakaoLogo.svg';
// 시스템 화면 컴포넌트
const SystemScreen = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  useEffect(() => {
    (async () => {
      const storedNickname = await AsyncStorage.getItem('nickname');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedRole = await AsyncStorage.getItem('role');
      if (storedNickname) setNickname(storedNickname);
      if (storedEmail) setEmail(storedEmail);
      if (storedRole) setRole(storedRole);
    })();
  }, []);
  return (
    <BG type="solid">
      {/* 메인 컨테이너 */}
      <View className="flex-1 items-center pt-[8]">
        {/* 프로필 버튼 */}
        <AccountButton nickname={nickname} email={email} role={role} />
        {/* 구분선 */}
        <View className="w-full h-[5px] bg-blue600" />
        {/* 시스템 메뉴 버튼들 */}
        <SystemButton title="내 계정" sub="로그아웃 및 회원탈퇴하기" onPress={()=>{navigation.navigate('MyAccount')}} type="button"/>
        <SystemButton title="알림 설정" sub="이용약관 확인하기" onPress={()=>{navigation.navigate('NotificationSetting')}} type="button"/>
        <SystemButton title="서비스 안내" sub="개인정보정책 확인하기" onPress={()=>{navigation.navigate('Service')}} type="button"/>
      </View>
    </BG>
  );
};
export default SystemScreen;

const AccountButton = ({nickname, email, role}:{nickname: string, email: string, role: string})=>{
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  return (
    // 버튼 컨테이너
    <Pressable 
    onPress={()=>{navigation.navigate('ModifyInfo')}}
    className="w-full h-[165] flex-row justify-between items-center px-px">
      {/* 프로필 이미지 */}
      {role == 'HELPER' ? <ProfileIcon/> : <ProfileIcon2 />}
      {/* 간격 조정 */}
      <View className="w-[23px]" />
      {/* 텍스트 영역 */}
      <View className="flex-1">
        {/* 닉네임 */}
        <Txt type="title4" text={nickname} className="text-yellowPrimary" />
        {/* 간격 조정 */}
        <View className="mt-[4.9]" />
        {/* 카카오 계정 */}
        <View className="flex-row items-center gap-[7.64] overflow-hidden">
          <KakaoLogo />
          <Txt type="caption1" text={email} className="text-gray400" />
        </View>
      </View>
      {/* 화살표 아이콘 */}
      <BackIcon />
    </Pressable>
  );
}