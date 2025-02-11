import CameraIcon from '@assets/svgs/camera.svg';
import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import DismissKeyboardView from '@components/atom/DismissKeyboardView';
import Txt from '@components/atom/Txt';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Image,
  Keyboard,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';

type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'NicknameWriteScreen'
>;

const NICKNAME_MESSAGES = {
  SUCCESS: '사용 가능한 닉네임입니다.',
  DEFAULT: '2자 이상 10자 이내의 한글, 영문, 숫자만 입력해주세요.',
  TOO_SHORT: '2자 이상 입력하세요.',
  NO_SPACES: '공백을 제거해주세요.',
  NO_SPECIAL_CHARS: '특수문자를 제거해주세요.',
};

const NicknameWriteScreen = ({route, navigation}: Readonly<AuthProps>) => {
  const {role} = route.params;
  const defaultImageUri =
    role === 'YOUTH'
      ? require('@assets/pngs/profile/youthDefault.png')
      : require('@assets/pngs/profile/volunteerDefault.png');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [nicknameStatus, setNicknameStatus] = useState(
    NICKNAME_MESSAGES.DEFAULT,
  );
  const [clickedUpload, setClickedUpload] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () =>
      setIsKeyboardVisible(true),
    );
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setTimeout(() => {
        setIsKeyboardVisible(false);
      }, 100);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (clickedUpload) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [clickedUpload]);

  const selectImage = async () => {
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
    navigation.navigate('MemberInfoWriteScreen', {
      role,
      nickname,
      imageUri: imageUri ?? '',
    });
  };

  const handleNicknameChange = (text: string) => {
    setNickname(text);
    const regex = /^[ㄱ-ㅎ가-힣ㅏ-ㅣa-zA-Z0-9]{2,10}$/;
    if (text === '') {
      setNicknameStatus(NICKNAME_MESSAGES.DEFAULT);
    } else if (text.length < 2) {
      setNicknameStatus(NICKNAME_MESSAGES.TOO_SHORT);
    } else if (/\s/.test(text)) {
      setNicknameStatus(NICKNAME_MESSAGES.NO_SPACES);
    } else if (/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g.test(text)) {
      setNicknameStatus(NICKNAME_MESSAGES.NO_SPECIAL_CHARS);
    } else if (regex.test(text)) {
      setNicknameStatus(NICKNAME_MESSAGES.SUCCESS);
    } else {
      setNicknameStatus(NICKNAME_MESSAGES.DEFAULT);
    }
  };

  return (
    <BG type="main">
      <DismissKeyboardView>
        <View className="items-center mt-[149]">
          <Txt
            type="title2"
            text={'내일모래가 당신을\n어떻게 부를까요?'}
            className="text-white text-center"
          />

          <Pressable
            onPress={() => setClickedUpload(true)}
            className="mt-[50] relative">
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

          <TextInput
            value={nickname}
            onChangeText={handleNicknameChange}
            placeholder="닉네임을 입력해주세요"
            placeholderTextColor={'#A0A0A0'}
            className={`text-center px-[10] font-m text-yellowPrimary border-b ${
              nickname ? 'border-yellow200' : 'border-gray400'
            } mt-[31]`}
            style={{fontSize: 22}}
          />
          <Txt
            type="caption1"
            text={nicknameStatus}
            className="text-gray400 mt-[15]"
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
          className={`absolute left-0 bottom-0 w-full h-full bg-black/50 px-[40] pb-[30] justify-end ${
            isKeyboardVisible ? 'hidden' : ''
          }`}>
          {/* 내부 컴포넌트에는 상위 onPress 이벤트가 전파되지 않도록 함 */}
          <Pressable onPress={() => {}} className="w-full">
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{translateY: translateYAnim}],
                borderRadius: 10,
              }}
              className="bg-blue500 mb-[24]">
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
                onPress={selectImage}>
                <Txt
                  type="body3"
                  text="앨범에서 사진 선택"
                  className="text-white"
                />
              </Pressable>
              <View className="bg-blue600 h-[1]" />
              <Pressable
                className="h-[61] justify-center items-center"
                onPress={handleDefaultImageClick}>
                <Txt
                  type="body3"
                  text="기본 이미지 적용"
                  className="text-white"
                />
              </Pressable>
            </Animated.View>

            <Button text="취소" onPress={() => setClickedUpload(false)} />
          </Pressable>
        </Pressable>
      ) : (
        <View
          className={`absolute left-0 bottom-[30] w-full px-[40] ${
            isKeyboardVisible ? 'hidden' : ''
          }`}>
          <Button
            text="다음"
            onPress={handleNext}
            disabled={nicknameStatus !== NICKNAME_MESSAGES.SUCCESS}
          />
        </View>
      )}
    </BG>
  );
};

export default NicknameWriteScreen;
