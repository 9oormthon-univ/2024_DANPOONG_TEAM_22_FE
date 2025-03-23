import CameraIcon from '@assets/svgs/camera.svg';
import {AnimatedView} from '@components/AnimatedView';
import {AppBar} from '@components/AppBar';
import {BG} from '@components/BG';
import {BottomMenu} from '@components/BottomMenu';
import {Button} from '@components/Button';
import {DismissKeyboardView} from '@components/DismissKeyboardView';
import {Modal} from '@components/Modal';
import {TextInput} from '@components/TextInput';
import {CustomText} from '@components/CustomText';
import {KEYBOARD_DELAY_MS} from '@constants/common';
import {useModal} from '@hooks/useModal';
import {useValidateInput} from '@hooks/useValidateInput';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {trackEvent} from '@utils/tracker';
import {useEffect, useState} from 'react';
import {Image, Keyboard, Pressable, View} from 'react-native';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';

type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'NicknameWriteScreen'
>;

export const NicknameWriteScreen = ({route, navigation}: Readonly<AuthProps>) => {
  const {role} = route.params;
  const defaultImageUri =
    role === 'YOUTH'
      ? require('@assets/pngs/profile/youthDefault.png')
      : require('@assets/pngs/profile/volunteerDefault.png');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const {
    value: nickname,
    setValue: setNickname,
    isValid: isValidNickname,
    isError: isErrorNickname,
    isSuccess: isSuccessNickname,
    message: nicknameMessage,
  } = useValidateInput({type: 'nickname'});
  const [clickedUpload, setClickedUpload] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const {visible, openModal, closeModal} = useModal();

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () =>
      setIsKeyboardVisible(true),
    );
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setTimeout(() => {
        setIsKeyboardVisible(false);
      }, KEYBOARD_DELAY_MS);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const selectImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo', // 'photo', 'video', 또는 'mixed' 중 선택 가능
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled camera picker');
        return;
      }

      if (response.errorCode) {
        console.log(
          'ImagePicker Error: ',
          response.errorCode,
          response.errorMessage,
        );
        return;
      }

      if (!response?.assets?.[0]) {
        return;
      }
      console.log(response.assets[0].uri);
      setImageUri(response.assets[0].uri ?? null);
      setClickedUpload(false);
    });
  };

  const handleDefaultImageClick = () => {
    setImageUri(null);
    setClickedUpload(false);
  };

  const handleNext = () => {
    trackEvent('profile_set');
    navigation.navigate('MemberInfoWriteScreen', {
      role,
      nickname,
      imageUri: imageUri ?? '',
    });
  };

  const handleNicknameChange = (text: string) => {
    setNickname(text);
  };

  const bottomMenuData = [
    {title: '앨범에서 사진 선택', onPress: selectImage},
    {title: '기본 이미지 적용', onPress: handleDefaultImageClick},
  ];

  return (
    <BG type="main">
      <DismissKeyboardView>
        <AppBar
          goBackCallbackFn={openModal}
          className="absolute top-[0] w-full"
        />

        <View className="h-[120]" />

        <View className="items-center px-[30]">
          <CustomText            type="title2"
            text={'내일모래가 당신을\n어떻게 부를까요?'}
            className="text-white text-center"
          />

          <View className="h-[40]" />

          <Pressable
            onPress={() => setClickedUpload(true)}
            className="relative">
            <View
              className={`w-[107] h-[107] ${
                imageUri ? 'border border-gray200' : ''
              }`}
              style={{borderRadius: 53.5, overflow: 'hidden'}}>
              <Image
                source={imageUri ? {uri: imageUri} : defaultImageUri}
                style={{width: '100%', height: '100%'}}
              />
            </View>
            <View
              className="absolute bottom-0 right-0 justify-center items-center w-[32] h-[32] border-2 border-blue700 bg-yellowPrimary"
              style={{borderRadius: 16}}>
              <CameraIcon />
            </View>
          </Pressable>

          <View className="h-[31]" />

          <TextInput
            value={nickname}
            onChangeText={handleNicknameChange}
            isError={isErrorNickname}
            isSuccess={isSuccessNickname}
            placeholder="닉네임을 입력해주세요"
            message={nicknameMessage}
            maxLength={10}
          />
        </View>

        <Image
          source={require('@assets/pngs/background/signup2.png')}
          className="w-full h-auto flex-1 mt-[80]"
        />
      </DismissKeyboardView>

      {clickedUpload ? (
        <Pressable
          onPress={() => setClickedUpload(false)}
          className={`absolute left-0 bottom-0 w-full h-full bg-black/50 px-[30] pb-[55] justify-end ${
            isKeyboardVisible ? 'hidden' : ''
          }`}>
          {/* 내부 컴포넌트에는 상위 onPress 이벤트가 전파되지 않도록 함 */}
          <Pressable onPress={() => {}} className="w-full">
            <AnimatedView
              visible={clickedUpload}
              style={{borderRadius: 10}}
              className="bg-blue500 mb-[24]">
              <BottomMenu title="프로필 사진 설정" data={bottomMenuData} />
            </AnimatedView>

            <Button text="취소" onPress={() => setClickedUpload(false)} />
          </Pressable>
        </Pressable>
      ) : (
        <View
          className={`absolute left-0 bottom-[55] w-full px-[30] ${
            isKeyboardVisible ? 'hidden' : ''
          }`}>
          <Button
            text="다음"
            onPress={handleNext}
            disabled={!isValidNickname}
          />
        </View>
      )}

      <Modal
        type="info"
        visible={visible}
        onCancel={closeModal}
        onConfirm={() => navigation.goBack()}>
        <CustomText          type="title4"
          text="나가시겠어요?"
          className="text-white mt-[26.92] mb-[5]"
        />
        <CustomText          type="caption1"
          text="화면을 나가면 변경사항이 저장되지 않아요"
          className="text-gray300 mb-[32]"
        />
      </Modal>
    </BG>
  );
};
