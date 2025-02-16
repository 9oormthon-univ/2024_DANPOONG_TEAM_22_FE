import ProfileCameraIcon from '@assets/svgs/ProfileCamera.svg';
import AnimatedView from '@components/atom/AnimatedView';
import AppBar from '@components/atom/AppBar';
import BG from '@components/atom/BG';
import BottomMenu from '@components/atom/BottomMenu';
import Button from '@components/atom/Button';
import TextInput from '@components/atom/TextInput';
import Txt from '@components/atom/Txt';
import useValidateInput from '@hooks/useValidateInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {SystemStackParamList} from '@type/nav/SystemStackParamList';
import {useEffect, useState} from 'react';
import {Image, Pressable, View} from 'react-native';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';

const ModifyInfoScreen = () => {
  const navigation = useNavigation<NavigationProp<SystemStackParamList>>();
  const [role, setRole] = useState('');
  // nickname validation
  const {
    value: nickname,
    setValue: setNickname,
    isValid: isValidNickname,
    isError: isErrorNickname,
    isSuccess: isSuccessNickname,
    message: nicknameMessage,
  } = useValidateInput({type: 'nickname'});

  // 프로필 이미지 관련 state
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [clickedUpload, setClickedUpload] = useState(false);

  // 텍스트 변경 핸들러
  const handleNicknameChange = (text: string) => {
    setNickname(text);
  };

  useEffect(() => {
    (async () => {
      const storedRole = await AsyncStorage.getItem('role');
      const storedNickname = await AsyncStorage.getItem('nickname');
      if (storedRole) setRole(storedRole);
      if (storedNickname) {
        setNickname(storedNickname);
      }
    })();
  }, []);

  const confirmCallbackFn = () => {
    if (!isValidNickname) {
      console.log('닉네임을 확인해주세요');
      return;
    }
    console.log('확인');
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
                source={{uri: imageUri}}
                style={{width: '100%', height: '100%', borderRadius: 53.5}}
              />
            ) : (
              <Image
                source={defaultImageUri}
                style={{width: '100%', height: '100%', borderRadius: 53.5}}
              />
            )}
            <ProfileCameraIcon className="absolute right-[-8] bottom-[0]" />
          </View>
        </Pressable>
        {/* 공백백*/}
        <View className="h-[39]" />
        {/* 닉네임 수정 Section */}
        <View className="w-full px-px gap-y-[10]">
          <Txt
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
          />
        </View>
      </View>

      {/* 이미지 수정 모달 (앨범에서 사진 선택 / 기본 이미지 적용) */}
      {clickedUpload && (
        <Pressable
          onPress={() => setClickedUpload(false)}
          className="absolute left-0 bottom-0 w-full h-full bg-black/50 px-[30] pb-[55] justify-end">
          <Pressable onPress={() => {}} className="w-full">
            <AnimatedView
              visible={clickedUpload}
              style={{borderRadius: 10}}
              className="bg-blue500 mb-[24]">
              <BottomMenu
                title="프로필 사진 설정"
                children={[
                  {title: '앨범에서 사진 선택', onPress: selectImage},
                  {title: '기본 이미지 적용', onPress: handleDefaultImageClick},
                ]}
              />
            </AnimatedView>
            <Button text="취소" onPress={() => setClickedUpload(false)} />
          </Pressable>
        </Pressable>
      )}
    </BG>
  );
};

export default ModifyInfoScreen;
