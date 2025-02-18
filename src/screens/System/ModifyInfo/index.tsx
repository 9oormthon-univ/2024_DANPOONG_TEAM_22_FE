import BG from "@components/atom/BG";
import Txt from "@components/atom/Txt";
import { View, Pressable, Image } from "react-native";
import AppBar from "@components/atom/AppBar";
import { NavigationProp, useNavigation} from "@react-navigation/native";
import { SystemStackParamList } from "@type/nav/SystemStackParamList";
import ProfileCameraIcon from '@assets/svgs/ProfileCamera.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import TextInput from "@components/atom/TextInput";
import Button from "@components/atom/Button";
import AnimatedView from "@components/atom/AnimatedView";
import {
  launchImageLibrary,
  ImageLibraryOptions,
  ImagePickerResponse,
} from "react-native-image-picker";
import Modal from "@components/atom/Modal";
import useModal from "@hooks/useModal";
import uploadImageToS3 from "@apis/util";
import { patchMemberInfo, PatchMemberInfoRequest } from "@apis/SystemApis/patchMemberInfo";
const ModifyInfoScreen = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  const [role, setRole] = useState('');
  const [isError, setIsError] = useState(false); // 에러 상태
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  // 닉네임 관련 state
  const [nickname, setNickname] = useState('');
  const [initialNickname, setInitialNickname] = useState('');
  const [isNicknameChanged, setIsNicknameChanged] = useState(false);
  // 프로필 이미지 관련 state
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [clickedUpload, setClickedUpload] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {visible, openModal, closeModal} = useModal();
  const [birth, setBirth] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const defaultImageUri =
    role === 'YOUTH'
      ? require('@assets/pngs/profile/youthDefault.png')
      : require('@assets/pngs/profile/volunteerDefault.png');


  // 닉네임 유효성 검사 함수
  const validateNickname = (text: string) => {
    const errors: string[] = [];

    if (text.length < 2) {
      errors.push('2자 이상 입력하세요');
    }
    if (text.length > 10) {
      errors.push('10자 이내로 입력하세요');
    }
    if (/\s/.test(text)) {
      errors.push('공백을 제거해주세요');
    }
    if (/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]/.test(text)) {
      errors.push('특수문자를 제거해주세요');
    }
    
    setErrorMessages(errors);
    setIsError(errors.length > 0);
  };

  // 텍스트 변경 핸들러
  const onChangeText = (newText: string) => {
    setNickname(newText);
    validateNickname(newText);
    setIsNicknameChanged(newText !== initialNickname);
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
        setNickname(storedNickname);
        setInitialNickname(storedNickname);
      }
      if (storedProfileImage) setImageUri(storedProfileImage);
      if (storedBirth) setBirth(storedBirth);
      if (storedFcmToken) setFcmToken(storedFcmToken);
    })();
  }, []);

//완료 버튼 클릭 함수
  const confirmCallbackFn = async () => {
    if(isLoading) return;
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
      if (isNicknameChanged) {
        await AsyncStorage.setItem('nickname', nickname);
      }
      const request: PatchMemberInfoRequest = {
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
      mediaType: "photo", // 사진만 선택 가능
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log("사용자가 사진 선택을 취소했습니다.");
        return;
      }

      if (response.errorCode) {
        console.log(
          "ImagePicker Error: ",
          response.errorCode,
          response.errorMessage
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
    setImageUri(null);
    setClickedUpload(false);
  };

  // 나가기 버튼 클릭 함수
  const goBackCallbackFn = () => {
    if(isLoading) return;
    if(isNicknameChanged || isImageChanged) {
      openModal();
    } else {
      navigation.goBack();
    }
  };

  return (
    <>
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
                style={{ width: "100%", height: "100%", borderRadius: 53.5 }}
              />
            ) : (
              <Image
                source={defaultImageUri}
                style={{ width: "100%", height: "100%", borderRadius: 53.5 }}
              />
            )}
            <ProfileCameraIcon className="absolute right-[-8] bottom-[0]"/>
          </View>
        </Pressable>
        {/* 공백백*/}
        <View className="h-[39]" />
        {/* 닉네임 수정 Section */}
        <View className="w-full px-px gap-y-[10]">
            <Txt type="caption1" text="닉네임" className="ml-[9] mb-[8px] text-gray200"/>
            <TextInput placeholder="닉네임을 입력해주세요." value={nickname} onChangeText={onChangeText} isError={isError}/>
            {errorMessages.length > 0 ? (
              errorMessages.map((error, index) => (
                <Txt key={index} type="caption1" text={error} className="ml-[9] text-red"/>
              ))
            ) : (
              <Txt type="caption1" text="2자 이상 10자 이내의 한글,영문,숫자 입력 가능합니다." className="ml-[9] text-gray400"/>
            )}
        </View>
      </View>

      {/* 이미지 수정 모달 (앨범에서 사진 선택 / 기본 이미지 적용) */}
      {clickedUpload && (
        <Pressable
          onPress={() => !isLoading && setClickedUpload(false)}
          className="absolute left-0 bottom-0 w-full h-full bg-black/50 px-[30] pb-[55] justify-end"
        >
          <Pressable onPress={() => {}} className="w-full">
            <AnimatedView
              visible={clickedUpload}
              style={{ borderRadius: 10 }}
              className="bg-blue500 mb-[24]"
            >
              <View className="h-[43] justify-center items-center">
                <Txt
                  type="caption1"
                  text="프로필 사진 설정"
                  className="text-gray300"
                />
              </View>
              <View className="bg-blue600 h-[1]" />
              <Pressable
                className="h-[61] justify-center items-center"
                onPress={() => !isLoading && selectImage()}
              >
                <Txt type="body3" text="앨범에서 사진 선택" className="text-white" />
              </Pressable>
              <View className="bg-blue600 h-[1]" />
              <Pressable
                className="h-[61] justify-center items-center"
                onPress={() => !isLoading && handleDefaultImageClick()}
              >
                <Txt type="body3" text="기본 이미지 적용" className="text-white" />
              </Pressable>
            </AnimatedView>
            <Button 
              text="취소" 
              onPress={() => !isLoading && setClickedUpload(false)} 
            />
          </Pressable>
        </Pressable>
      )}
    </BG>
    <Modal
    type="info"
    visible={visible}
    onCancel={closeModal}
    onConfirm={() => {
      navigation.goBack();
    }}
    buttonRatio="1:1"
    >
      <Txt type="title4" text="수정을 취소하고 나가시겠어요?" className="text-white mt-[32] mb-[5]"/>
      <Txt type="caption1" text="화면을 나가면 변경사항이 저장되지 않아요" className="text-gray300 mb-[32]"/>
    </Modal>
    </>
  );
};

export default ModifyInfoScreen;
