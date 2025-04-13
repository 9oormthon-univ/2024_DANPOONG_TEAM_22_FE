// 필요한 컴포넌트
import {BG} from '@components/BG';
import {CustomText} from '@components/CustomText';
import { Pressable, View, Image } from 'react-native';
import { useNavigation, NavigationProp, useIsFocused } from '@react-navigation/native';
import { SystemStackParamList } from '@type/nav/SystemStackParamList';
import {SystemButton} from '@components/SystemButton';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppBar} from '@components/AppBar';
// 아이콘
import BackIcon from '@assets/svgs/Back.svg';
import ProfileIcon from '@assets/svgs/Profile.svg';
import ProfileIcon2 from '@assets/svgs/Profile2.svg';
import KakaoLogo from '@assets/svgs/KakaoLogo.svg';

export const SystemScreen = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const isFocused = useIsFocused();
 
  useEffect(() => {
    if (isFocused) {
      setProfileImage('');
      (async () => {
        const storedNickname = await AsyncStorage.getItem('nickname');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedRole = await AsyncStorage.getItem('role');
        const storedProfileImage = await AsyncStorage.getItem('profileImage');
        if (storedNickname) setNickname(storedNickname);
        if (storedEmail) setEmail(storedEmail);
        if (storedRole) setRole(storedRole);
        if (storedProfileImage) setProfileImage(storedProfileImage);
      })();
    }
  }, [isFocused]);

  return (
    <BG type="solid">
      {role=='YOUTH' && <AppBar title="설정" exitCallbackFn={()=>{navigation.goBack()}}/>}
      {/* 메인 컨테이너 */}
      <View className="flex-1 items-center pt-[8]">
        {/* 프로필 버튼 */}
        <AccountButton nickname={nickname} email={email} role={role} profileImage={profileImage} />
        {/* 구분선 */}
        <View className="w-full h-[5px] bg-blue600" />
        {/* 시스템 메뉴 버튼들 */}
        <SystemButton title="내 계정" sub="로그아웃 및 회원탈퇴하기" onPress={()=>{navigation.navigate('MyAccount')}} type="button"/>
        <SystemButton title="알림 설정" sub="알림 수신 설정하기" onPress={()=>{navigation.navigate('NotificationSetting')}} type="button"/>
        <SystemButton title="서비스" sub="내일모래 정보 확인하기" onPress={()=>{navigation.navigate('Service')}} type="button"/>
      </View>
    </BG>
  );
};

const AccountButton = ({nickname, email, role, profileImage}:{nickname: string, email: string, role: string, profileImage: string})=>{
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  return (
    // 버튼 컨테이너
    <Pressable 
    onPress={()=>{navigation.navigate('ModifyInfo')}}
    className="w-full h-[165] flex-row justify-between items-center px-px">
      {/* 프로필 이미지 */}
      {profileImage ? <Image source={{uri: profileImage}} className="w-[71px] h-[71px] rounded-full" /> : role == 'HELPER' ? <ProfileIcon/> : <ProfileIcon2 />}
      {/* 간격 조정 */}
      <View className="w-[23px]" />
      {/* 텍스트 영역 */}
      <View className="flex-1">
        {/* 닉네임 */}
        <CustomText type="title4" text={nickname} className="text-yellowPrimary" />
        {/* 간격 조정 */}
        <View className="mt-[4.9]" />
        {/* 카카오 계정 */}
        <View className="flex-row items-center gap-[7.64] overflow-hidden">
          <KakaoLogo />
          <CustomText type="caption1" text={email} className="text-gray400" />
        </View>
      </View>
      {/* 화살표 아이콘 */}
      <BackIcon />
    </Pressable>
  );
}