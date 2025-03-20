import uploadImageToS3 from '@apis/util';
import {AppBar} from '@components/AppBar';
import {BG} from '@components/BG';
import {Button} from '@components/Button';
import {DismissKeyboardView} from '@components/DismissKeyboardView';
import {Modal} from '@components/Modal';
import {Text} from '@components/Text';
import {KEYBOARD_DELAY_MS} from '@constants/common';
import usePostMember from '@hooks/auth/usePostMember';
import useLoading from '@hooks/useLoading';
import useModal from '@hooks/useModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {Gender, MemberRequestData, Role} from '@type/api/member';
import calculateAge from '@utils/calculateAge';
import formatDateDot from '@utils/formatDateDot';
import {trackEvent} from '@utils/tracker';
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
  const {visible, openModal, closeModal} = useModal();
  const [visible2, setVisible2] = useState(false);
  const {mutate: postMember} = usePostMember();

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

  const handleNext = async () => {
    if (!gender || !birthday) return;

    // 만 19세 미만인 봉사자는 서비스 이용 불가
    if (role === 'HELPER') {
      const age = calculateAge(birthday);
      if (age < 19) {
        setVisible2(true);
        return;
      }
    }

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
    const birth = birthday.toISOString();

    const data: MemberRequestData = {
      gender,
      birth,
      name: nickname,
      profileImage: imageLocation ?? '',
      role: role as Role,
      fcmToken: fcmToken ?? '',
    };
    try {
      postMember(data);

      await AsyncStorage.setItem('gender', gender);
      await AsyncStorage.setItem('birth', birth);
      await AsyncStorage.setItem('nickname', nickname);
      await AsyncStorage.setItem('role', role);
      await AsyncStorage.setItem('profileImage', imageLocation ?? '');

      trackEvent('birth_gender_input');
      trackEvent('signup_complete');

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
          goBackCallbackFn={openModal}
          className="absolute top-[0] w-full"
        />

        <View className="h-[136]" />

        <View className="items-center">
          <Text
            type="title2"
            text={`${nickname ?? ''} 님,`}
            className="text-white"
          />
          <Text
            type="title2"
            text="당신에 대해 알려주세요"
            className="text-white"
          />

          <View className="h-[81]" />

          <View className="px-[30] w-full">
            <Pressable
              onPress={() => setOpen(true)}
              className={`w-full h-[48] justify-center border px-[22] ${
                birthday
                  ? 'border-yellowPrimary bg-yellow300/15'
                  : 'border-gray300 bg-white/10'
              }`}
              style={{borderRadius: 10}}>
              <Text
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
                <Text
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
                <Text
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
        className={`absolute left-0 bottom-[55] w-full px-[30] ${
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

      <Modal
        type="info"
        visible={visible2}
        onCancel={() => setVisible2(false)}
        onConfirm={() => navigation.navigate('LoginScreen')}>
        <Text
          type="body3"
          text={`내일모래의 목소리 봉사는\n만 19세 이상부터 참여할 수 있어요.\n나중에 다시 찾아주세요!`}
          className="text-white my-[28.92] text-center"
        />
      </Modal>

      <Modal
        type="info"
        visible={visible}
        onCancel={closeModal}
        onConfirm={() => navigation.goBack()}>
        <Text
          type="title4"
          text="나가시겠어요?"
          className="text-white mt-[26.92] mb-[5]"
        />
        <Text
          type="caption1"
          text="화면을 나가면 변경사항이 저장되지 않아요"
          className="text-gray300 mb-[32]"
        />
      </Modal>
    </BG>
  );
};

export default MemberInfoWriteScreen;
