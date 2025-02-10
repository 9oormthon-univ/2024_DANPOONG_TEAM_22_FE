import CameraIcon from '@assets/svgs/camera.svg';
import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import DismissKeyboardView from '@components/atom/DismissKeyboardView';
import Txt from '@components/atom/Txt';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {useEffect, useState} from 'react';
import {Image, Keyboard, Pressable, TextInput, View} from 'react-native';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';

type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'NicknameWriteScreen'
>;

const NicknameWriteScreen = ({navigation}: Readonly<AuthProps>) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const role = 'YOUTH'; // or HELPER
  const defaultImageUri =
    role === 'YOUTH'
      ? require('@assets/pngs/profile/youthDefault.png')
      : require('@assets/pngs/profile/volunteerDefault.png');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');

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
    });
  };

  const handleNext = () => {
    navigation.navigate('RoleSelectScreen', {
      nickname,
      imageUri: imageUri ?? '',
    });
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

          <Pressable onPress={selectImage} className="mt-[50] relative">
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
            onChangeText={setNickname}
            placeholder="닉네임을 입력해주세요"
            placeholderTextColor={'#717171'}
            className={`text-center px-[10] font-m text-yellowPrimary border-b ${
              nickname ? 'border-yellow200' : 'border-gray500'
            } mt-[31]`}
            style={{fontSize: 22}}
          />
          <Txt
            type="caption1"
            text="2자 이상 10자 이내의 한글, 영문, 숫자 입력 가능합니다"
            className="text-gray400 mt-[15]"
          />
        </View>

        <Image
          source={require('@assets/pngs/background/background2.png')}
          className="w-full h-auto flex-1 mt-[89]"
        />
      </DismissKeyboardView>

      <View
        className={`absolute left-0 bottom-[30] w-full px-[40] ${
          isKeyboardVisible ? 'hidden' : ''
        }`}>
        <Button text="다음" onPress={handleNext} disabled={!nickname} />
      </View>
    </BG>
  );
};

export default NicknameWriteScreen;
