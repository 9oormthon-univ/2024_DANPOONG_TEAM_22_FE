import VolunteerIcon from '@assets/svgs/volunteer.svg';
import YouthIcon from '@assets/svgs/youth.svg';
import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import Txt from '@components/atom/Txt';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {Role} from '@type/api/member';
import {useState} from 'react';
import {Image, Pressable, View} from 'react-native';

type AuthProps = NativeStackScreenProps<AuthStackParamList, 'RoleSelectScreen'>;

const RoleSelectScreen = ({navigation}: Readonly<AuthProps>) => {
  const [role, setRole] = useState<Role | null>(null);

  const handleNext = () => {
    if (!role) return;
    navigation.navigate('NicknameWriteScreen', {role});
  };

  return (
    <BG type="main">
      <View className="items-center pt-[170]">
        <Txt type="title2" text="당신은 누구인가요?" className="text-white" />
        <View className="mt-[50] px-[46] flex-row">
          <Pressable
            className={`relative w-1/2 pt-[41] h-[180] items-center mr-[22] border ${
              role === 'HELPER'
                ? 'border-yellowPrimary bg-yellow300/15'
                : 'border-gray300 bg-white/10'
            }`}
            style={{borderRadius: 10}}
            onPress={() => setRole('HELPER')}>
            <Txt
              type="title4"
              text="조력자"
              className="text-white mb-[30] text-center"
            />
            <View className="absolute bottom-[14]">
              <VolunteerIcon />
            </View>
          </Pressable>
          <Pressable
            className={`relative w-1/2 pt-[41] h-[180] items-center border ${
              role === 'YOUTH'
                ? 'border-yellowPrimary bg-yellow300/15'
                : 'border-gray300 bg-white/10'
            }`}
            style={{borderRadius: 10}}
            onPress={() => setRole('YOUTH')}>
            <Txt
              type="title4"
              text="청년"
              className="text-white mb-[30] text-center"
            />
            <View className="absolute bottom-0">
              <YouthIcon />
            </View>
          </Pressable>
        </View>
      </View>
      <View className="justify-center mt-[50]">
        <View className="flex-row justify-center">
          <View className="flex-row items-center justify-center">
            <Txt
              type="caption1"
              text={`내일모래에는 `}
              className="text-gray300 text-center"
            />
            <Txt
              type="caption1"
              text={`선한 마음을 담아 목소리를 녹음하는 분`}
              className={`${
                role === 'HELPER' ? 'text-yellowPrimary' : 'text-gray300'
              } text-center`}
            />
            <Txt
              type="caption1"
              text={`들과,`}
              className="text-gray300 text-center"
            />
          </View>
        </View>
        <View className="flex-row justify-center">
          <View className="flex-row justify-center">
            <Txt
              type="caption1"
              text={`이 목소리를 들으며 용기를 얻는 분들`}
              className={`${
                role === 'YOUTH' ? 'text-yellowPrimary' : 'text-gray300'
              } text-center`}
            />
            <Txt
              type="caption1"
              text={`이 있어요`}
              className="text-gray300 text-center"
            />
          </View>
        </View>
      </View>

      <Image
        source={require('@assets/pngs/background/signup2.png')}
        className="w-full h-auto mt-[54]"
      />
      <View className="absolute left-0 bottom-[55] w-full px-[30]">
        <Button text="다음" onPress={handleNext} disabled={!role} />
      </View>
    </BG>
  );
};

export default RoleSelectScreen;
