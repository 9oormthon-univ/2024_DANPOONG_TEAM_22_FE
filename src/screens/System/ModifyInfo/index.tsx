import { useEffect, useState } from 'react';
import { Alert, Image, Platform, Pressable, View } from 'react-native';
import {
  type ImageLibraryOptions,
  type ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';

import { patchMemberInfo } from '@apis/EditInformation/patch/MemberInfo/fetch';
import type { patchMemberInfoRequest } from '@apis/EditInformation/patch/MemberInfo/type';
import { uploadImageToS3 } from '@apis/util';
import { AnimatedView } from '@components/AnimatedView';
import { AppBar } from '@components/AppBar';
import { BG } from '@components/BG';
import { Button } from '@components/Button';
import { CustomText } from '@components/CustomText';
import { Modal } from '@components/Modal';
import { TextInput } from '@components/TextInput';
import { useModal } from '@hooks/useModal';
import { useValidateInput } from '@hooks/useValidateInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import { type SystemStackParamList } from '@type/nav/SystemStackParamList';

import ProfileCameraIcon from '@assets/svgs/ProfileCamera.svg';

export const ModifyInfoScreen = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  const [role, setRole] = useState('');
  const [originalNickname, setOriginalNickname] = useState('');
  const {
    value: nickname,
    setValue: setNickname,
    isValid: isValidNickname,
    isError: isErrorNickname,
    isSuccess: isSuccessNickname,
    message: nicknameMessage,
  } = useValidateInput({ type: 'nickname' });
  // 프로필 이미지 관련 state
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [clickedUpload, setClickedUpload] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { visible, openModal, closeModal } = useModal();
  const [birth, setBirth] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const defaultImageUri =
    role === 'YOUTH'
      ? require('@assets/pngs/profile/youthDefault.png')
      : require('@assets/pngs/profile/volunteerDefault.png');

  const handleNicknameChange = (text: string) => {
    setNickname(text);
  };

  useEffect(() => {
    (async () => {
      const storedRole = await AsyncStorage.getItem('role');
      const storedNickname = await AsyncStorage.getItem('nickname');
      const storedProfileImage = await AsyncStorage.getItem('profileImage');
      const storedBirth = await AsyncStorage.getItem('birth');
      const storedFcmToken = await AsyncStorage.getItem('fcmToken');

      if (storedRole) setRole(storedRole);

      if (storedNickname) {
        setOriginalNickname(storedNickname);
        setNickname(storedNickname);
      }

      if (storedProfileImage) setImageUri(storedProfileImage);

      if (storedBirth) setBirth(storedBirth);

      if (storedFcmToken) setFcmToken(storedFcmToken);
    })();
  }, []);

  //완료 버튼 클릭 함수
  const confirmCallbackFn = async () => {
    if (!isValidNickname) {
      Alert.alert('닉네임을 확인해주세요');

      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      //사진,닉네임 변경되었을때만 실행
      if (isImageChanged) {
        let imageLocation = '';

        if (imageUri) {
          try {
            imageLocation = (await uploadImageToS3(imageUri)) as string;
            console.log('업로드된 이미지 위치:', imageLocation);
            await AsyncStorage.setItem('profileImage', imageLocation);
          } catch (error) {
            console.log(error);
          }
        }
      }

      const isNicknameChanged = originalNickname !== nickname;

      if (isNicknameChanged) {
        await AsyncStorage.setItem('nickname', nickname);
      }

      const request: patchMemberInfoRequest = {
        name: nickname,
        gender: 'MALE',
        profileImage: imageUri ?? '',
        role: role as 'HELPER' | 'YOUTH',
        birth: birth,
        fcmToken: fcmToken,
      };
      const memberId = await patchMemberInfo(request);

      console.log('회원 정보 수정 완료:', memberId);
    } finally {
      setIsLoading(false);
      navigation.goBack();
    }
  };

  // 이미지 라이브러리에서 사진 선택 함수
  const selectImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo', // 사진만 선택 가능
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('사용자가 사진 선택을 취소했습니다.');

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

      setImageUri(response.assets[0].uri ?? null);
      setIsImageChanged(true);
      setClickedUpload(false);
    });
  };

  // 기본 이미지를 적용하는 함수
  const handleDefaultImageClick = () => {
    AsyncStorage.setItem('profileImage', '');
    setImageUri(null);
    setClickedUpload(false);
  };

  // 나가기 버튼 클릭 함수
  const goBackCallbackFn = () => {
    if (isLoading) return;

    const isNicknameChanged = originalNickname !== nickname;

    if (isNicknameChanged || isImageChanged) {
      openModal();
    } else {
      navigation.goBack();
    }
  };

  return (
    <BG type="solid">
      <AppBar
        title="내 정보 수정"
        goBackCallbackFn={goBackCallbackFn}
        confirmCallbackFn={confirmCallbackFn}
        isLoading={isLoading}
      />
      {/* 프로필 이미지 영역 */}
      <View className="flex-1 items-center pt-[38]">
        <Pressable onPress={() => !isLoading && setClickedUpload(true)}>
          <View className="relative w-[107] h-[107]">
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 53.5,
                }}
              />
            ) : (
              <Image
                source={defaultImageUri}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 53.5,
                }}
              />
            )}
            <ProfileCameraIcon className="absolute right-[-8] bottom-[0]" />
          </View>
        </Pressable>
        {/* 공백백*/}
        <View className="h-[39]" />
        {/* 닉네임 수정 Section */}
        <View className="w-full px-px gap-y-[10]">
          <CustomText
            type="caption1"
            text="닉네임"
            className="ml-[9] mb-[8px] text-gray200"
          />
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
      </View>

      {/* 이미지 수정 모달 (앨범에서 사진 선택 / 기본 이미지 적용) */}
      <>
        {clickedUpload && (
          <Pressable
            onPress={() => !isLoading && setClickedUpload(false)}
            className={`absolute left-0 bottom-0 w-full h-full bg-black/50 px-[30] ${
              Platform.OS === 'ios' ? 'pb-[79]' : 'pb-[55]'
            } justify-end`}>
            <Pressable onPress={() => {}} className="w-full">
              <AnimatedView
                visible={clickedUpload}
                style={{ borderRadius: 10 }}
                className="bg-blue500 mb-[24]">
                <View className="h-[43] justify-center items-center">
                  <CustomText
                    type="caption1"
                    text="프로필 사진 설정"
                    className="text-gray300"
                  />
                </View>
                <View className="bg-blue600 h-[1]" />
                <Pressable
                  className="h-[61] justify-center items-center"
                  onPress={() => !isLoading && selectImage()}>
                  <CustomText
                    type="body3"
                    text="앨범에서 사진 선택"
                    className="text-white"
                  />
                </Pressable>
                <View className="bg-blue600 h-[1]" />
                <Pressable
                  className="h-[61] justify-center items-center"
                  onPress={() => !isLoading && handleDefaultImageClick()}>
                  <CustomText
                    type="body3"
                    text="기본 이미지 적용"
                    className="text-white"
                  />
                </Pressable>
              </AnimatedView>
              <Button
                text="취소"
                onPress={() => !isLoading && setClickedUpload(false)}
              />
            </Pressable>
          </Pressable>
        )}
      </>

      <Modal
        type="info"
        visible={visible}
        onCancel={closeModal}
        onConfirm={() => {
          navigation.goBack();
        }}
        buttonRatio="1:1">
        <CustomText
          type="title4"
          text="수정을 취소하고 나가시겠어요?"
          className="text-white mt-[32] mb-[5]"
        />
        <CustomText
          type="caption1"
          text="화면을 나가면 변경사항이 저장되지 않아요"
          className="text-gray300 mb-[32]"
        />
      </Modal>
    </BG>
  );
};
