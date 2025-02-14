import BG from '@components/atom/BG';
import AppBar from '@components/atom/AppBar';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { SystemStackParamList } from '@type/nav/SystemStackParamList';
import SystemButton  from '@components/atom/SystemButton';
import Modal from '@components/atom/Modal';
import Txt from '@components/atom/Txt';
import useModal from '@hooks/useModal';
import { handleLogout } from '@utils/handleLogout';
const MyAccountScreen = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  const {visible, openModal, closeModal} = useModal();
  
  return <>
    <BG type="solid">
    <AppBar title="내 계정" goBackCallbackFn={() => {navigation.goBack();}} />
        <SystemButton title="연결된 소셜 계정" kakaoLogo={true} onPress={()=>{navigation.navigate('ConnectedAccount')}} type="button"/>
        <SystemButton title="로그아웃" onPress={()=>{openModal()}} type="button"/>
        <SystemButton title="회원 탈퇴"  onPress={()=>{navigation.navigate('LeaveAccount')}} type="button"/>
  </BG>
  <Modal 
  visible={visible} 
  onCancel={closeModal} 
  onConfirm={handleLogout}
  confirmText="로그아웃"
  cancelText="취소"
  buttonRatio="1:1"
  >
    <Txt type="title4" text="로그아웃 하시겠어요?" className="text-white my-[42]"/>
  </Modal>
  </>;
};

export default MyAccountScreen;