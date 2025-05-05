import { useEffect, useState } from 'react';

import { AppBar } from '@components/AppBar';
import { BG } from '@components/BG';
import { CustomText } from '@components/CustomText';
import { Modal } from '@components/Modal';
import { SystemButton } from '@components/SystemButton';
import { useModal } from '@hooks/useModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { type SystemStackParamList } from '@type/nav/SystemStackParamList';
import { handleLogout } from '@utils/handleLogout';

export const MyAccountScreen = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  const { visible, openModal, closeModal } = useModal();
  const [loginType, setLoginType] = useState('');

  const queryClient = useQueryClient();

  useEffect(() => {
    (async () => {
      const storedLoginType = await AsyncStorage.getItem('loginType');

      if (storedLoginType) setLoginType(storedLoginType);
    })();
  }, []);

  return (
    <>
      <BG type="solid">
        <AppBar
          title="내 계정"
          goBackCallbackFn={() => {
            navigation.goBack();
          }}
        />
        <SystemButton
          title="연결된 소셜 계정"
          loginType={loginType}
          onPress={() => {
            navigation.navigate('ConnectedAccount');
          }}
          type="button"
        />
        <SystemButton
          title="로그아웃"
          onPress={() => {
            openModal();
          }}
          type="button"
        />
        <SystemButton
          title="회원 탈퇴"
          onPress={() => {
            navigation.navigate('LeaveAccount');
          }}
          type="button"
        />
      </BG>
      <Modal
        visible={visible}
        onCancel={closeModal}
        onConfirm={() => {
          handleLogout();

          // 이전 사용자 정보 캐시 무효화
          queryClient.removeQueries({
            queryKey: ['getMember'],
          });
        }}
        confirmText="로그아웃"
        cancelText="취소"
        buttonRatio="1:1">
        <CustomText
          type="title4"
          text="로그아웃 하시겠어요?"
          className="text-white my-[42]"
        />
      </Modal>
    </>
  );
};
