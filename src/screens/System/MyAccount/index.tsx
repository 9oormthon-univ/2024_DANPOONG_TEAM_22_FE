import BG from '@components/atom/BG';
import AppBar from '@components/atom/AppBar';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { SystemStackParamList } from '@type/nav/SystemStackParamList';
import SystemButton  from '@components/atom/SystemButton';
const MyAccountScreen = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  return <BG type="solid">
    <AppBar title="내 계정" goBackCallbackFn={() => {navigation.goBack();}} />
        <SystemButton title="연결된 소셜 계정" kakaoLogo={true} onPress={()=>{navigation.navigate('ConnectedAccount')}} type="button"/>
        <SystemButton title="로그아웃" onPress={()=>{}} type="button"/>
        <SystemButton title="회원 탈퇴"  onPress={()=>{navigation.navigate('LeaveAccount')}} type="button"/>
  </BG>;
};

export default MyAccountScreen;

