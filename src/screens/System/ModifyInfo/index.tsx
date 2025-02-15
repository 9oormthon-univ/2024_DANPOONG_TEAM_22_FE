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

const ModifyInfoScreen = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  const [role, setRole] = useState('');
  const [isError, setIsError] = useState(false); // 에러 상태
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [nickname, setNickname] = useState('');
  // 처음 async에서 받아온 nickname을 저장하는 state
  const [initialNickname, setInitialNickname] = useState('');
  // nickname이 처음 값과 달라졌는지를 확인하는 state
  const [isNicknameChanged, setIsNicknameChanged] = useState(false);

  // 프로필 이미지 관련 state
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [clickedUpload, setClickedUpload] = useState(false);

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
      if (storedRole) setRole(storedRole);
      if (storedNickname) {
        setNickname(storedNickname);
        setInitialNickname(storedNickname);
      }
    })();
  }, []);

  const confirmCallbackFn = () => {
    console.log('확인');
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
      setClickedUpload(false);
    });
  };

  // 기본 이미지를 적용하는 함수
  const handleDefaultImageClick = () => {
    setImageUri(null);
    setClickedUpload(false);
  };

  const defaultImageUri =
    role === 'YOUTH'
      ? require('@assets/pngs/profile/youthDefault.png')
      : require('@assets/pngs/profile/volunteerDefault.png');

  return (
    <BG type="solid">
      <AppBar 
      title="내 정보 수정" 
      goBackCallbackFn={() => {
          navigation.goBack();
        }}
        confirmCallbackFn={confirmCallbackFn}
        />
        {/* 프로필 이미지 영역 */}
      <View className="flex-1 items-center pt-[38]">
        <Pressable onPress={() => setClickedUpload(true)}>
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
          onPress={() => setClickedUpload(false)}
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
                onPress={selectImage}
              >
                <Txt type="body3" text="앨범에서 사진 선택" className="text-white" />
              </Pressable>
              <View className="bg-blue600 h-[1]" />
              <Pressable
                className="h-[61] justify-center items-center"
                onPress={handleDefaultImageClick}
              >
                <Txt type="body3" text="기본 이미지 적용" className="text-white" />
              </Pressable>
            </AnimatedView>
            <Button text="취소" onPress={() => setClickedUpload(false)} />
          </Pressable>
        </Pressable>
      )}
    </BG>
  );
};

export default ModifyInfoScreen;

