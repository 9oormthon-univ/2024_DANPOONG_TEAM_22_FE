import AppBar from '@components/atom/AppBar';
import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import Txt from '@components/atom/Txt';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {useState} from 'react';
import {Image, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'YouthWakeUpTimeScreen'
>;

const YouthWakeUpTimeScreen = ({route, navigation}: Readonly<AuthProps>) => {
  const {nickname, imageUri, role, birthday, gender} = route.params;
  const [wakeUpTime, setWakeUpTime] = useState('');

  const handleNext = async () => {
    navigation.navigate('YouthEatScreen', {
      nickname,
      imageUri,
      role,
      birthday,
      gender,
      wakeUpTime,
    });
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <BG type="main">
        <>
          <AppBar
            goBackCallbackFn={() => {
              navigation.goBack();
            }}
            className="absolute top-[0] w-full"
          />
          <View className="w-[50%] h-[3] bg-yellowPrimary absolute top-[63]" />
          <View className="flex-1 mt-[50]">
            <View className="items-center pt-[80]">
              <Txt
                type="title2"
                text={'몇 시에\n일어나시나요?'}
                className="text-white"
              />
              <Txt
                type="body3"
                text="당신에 대해 알려주세요"
                className="text-gray300 mt-[16]"
              />

              <View className="mt-[60] px-[46] w-full">
                <TextInput
                  value={wakeUpTime}
                  onChangeText={setWakeUpTime}
                  placeholder="시간을 선택해주세요"
                  placeholderTextColor={'#717171'}
                  className={`text-yellowPrimary py-[12] px-[23] font-r w-full inline-block border-b ${
                    birthday ? 'border-b-yellow200' : 'border-b-gray400'
                  } mt-[31]`}
                  style={{fontSize: 32}}
                />
              </View>
            </View>
            <Image
              source={require('../../../../assets/pngs/background/background2.png')}
              className="w-full h-auto flex-1 mt-[54]"
            />
            <View className="absolute left-0 bottom-[30] w-full px-[40]">
              <Button text="다음" onPress={handleNext} disabled={!wakeUpTime} />
            </View>
          </View>
        </>
      </BG>
    </SafeAreaView>
  );
};

export default YouthWakeUpTimeScreen;
