import {postMember} from '@apis/member';
import uploadImageToS3 from '@apis/util';
import AppBar from '@components/atom/AppBar';
import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import DismissKeyboardView from '@components/atom/DismissKeyboardView';
import Txt from '@components/atom/Txt';
import useLoading from '@hooks/useLoading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {Gender, MemberCommonRequestData, Role} from '@type/api/member';
import formatDateDot from '@utils/formatDateDot';
import {useEffect, useState} from 'react';
import {Alert, Image, Keyboard, Pressable, View} from 'react-native';
import DatePicker from 'react-native-date-picker';

type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'MemberInfoWriteScreen'
>;

const MemberInfoWriteScreen = ({route, navigation}: Readonly<AuthProps>) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const {nickname, imageUri, role} = route.params;
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const {isLoading, setIsLoading} = useLoading();
  const [open, setOpen] = useState(false);

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

  const handleNext = async () => {
    if (!gender || !birthday) return;
    setIsLoading(true);
    let imageLocation = '';
    if (imageUri) {
      try {
        imageLocation = (await uploadImageToS3(imageUri)) as string;
        console.log('imageLocation', imageLocation);
      } catch (error) {
        console.log(error);
      }
    }

    const fcmToken = await AsyncStorage.getItem('fcmToken');

    const data: MemberCommonRequestData = {
      gender,
      name: nickname,
      profileImage: imageLocation ?? '',
      role: role as Role,
      birth: birthday.toISOString(),
      fcmToken: fcmToken ?? '',
    };
    try {
      const {result} = await postMember(data);
      console.log(result);

      await AsyncStorage.setItem('nickname', nickname);
      await AsyncStorage.setItem('role', role);
      if (role === 'YOUTH') {
        navigation.navigate('YouthOnboardingScreen');
        return;
      }
      navigation.navigate('VolunteerOnboardingScreen');
    } catch (error) {
      console.log(error);
      Alert.alert('오류', '회원가입 중 오류가 발생했어요');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BG type="main">
      <DismissKeyboardView>
        <AppBar
          goBackCallbackFn={() => {
            navigation.goBack();
          }}
          className="absolute top-[0] w-full"
        />
        <View className="items-center pt-[110]">
          <Txt
            type="title2"
            text={`${nickname ?? ''} 님,`}
            className="text-white mt-[26]"
          />
          <Txt
            type="title2"
            text="당신에 대해 알려주세요"
            className="text-white"
          />

          <View className="mt-[30] px-[46] w-full">
            <Pressable
              onPress={() => setOpen(true)}
              className={`w-full h-[48] justify-center border px-[22] ${
                birthday
                  ? 'border-yellowPrimary bg-yellow300/15'
                  : 'border-gray300 bg-white/10'
              }`}
              style={{borderRadius: 10}}>
              <Txt
                type="body4"
                text={
                  birthday ? formatDateDot(birthday) : '생년월일(YYYY.MM.DD)'
                }
                className={`${birthday ? 'text-white' : 'text-gray300'}`}
              />
            </Pressable>

            <View className="mt-[28] flex-row">
              <Pressable
                className={`flex-1 h-[121] items-center justify-center border mr-[22] ${
                  gender === 'MALE'
                    ? 'border-yellowPrimary bg-yellow300/15'
                    : 'border-gray300 bg-white/10'
                }`}
                style={{borderRadius: 10}}
                onPress={() => setGender('MALE')}>
                <Txt
                  type="title3"
                  text="남성"
                  className="text-white text-center"
                />
              </Pressable>
              <Pressable
                className={`flex-1 h-[121] items-center justify-center border ${
                  gender === 'FEMALE'
                    ? 'border-yellowPrimary bg-yellow300/15'
                    : 'border-gray300 bg-white/10'
                }`}
                style={{borderRadius: 10}}
                onPress={() => setGender('FEMALE')}>
                <Txt
                  type="title3"
                  text="여성"
                  className="text-white text-center"
                />
              </Pressable>
            </View>
          </View>
        </View>
        <Image
          source={require('@assets/pngs/background/signup2.png')}
          className="w-full h-auto flex-1 mt-[54]"
        />
      </DismissKeyboardView>

      <View
        className={`absolute left-0 bottom-[30] w-full px-[40] ${
          isKeyboardVisible ? 'hidden' : ''
        }`}>
        <Button
          text="다음"
          onPress={handleNext}
          disabled={!birthday || !gender || isLoading}
          isLoading={isLoading}
        />
      </View>

      <DatePicker
        modal
        open={open}
        date={birthday ?? new Date()}
        onConfirm={date => {
          setOpen(false);
          setBirthday(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
        mode="date"
        cancelText="취소"
        confirmText="확인"
        title={'생년월일'}
      />
    </BG>
  );
};

export default MemberInfoWriteScreen;
