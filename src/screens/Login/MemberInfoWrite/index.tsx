import {postMember} from '@apis/member';
import BG from '@components/atom/BG';
import Button from '@components/atom/Button';
import Txt from '@components/atom/Txt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@stackNav/Auth';
import {Gender, MemberRequestData, Role} from '@type/api/member';
import {useState} from 'react';
import {Alert, Image, Pressable, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AWS from 'aws-sdk';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';
import S3Config from '@config/S3config';
import useLoading from '@hooks/useLoading';

type AuthProps = NativeStackScreenProps<
  AuthStackParamList,
  'MemberInfoWriteScreen'
>;

const MemberInfoWriteScreen = ({route, navigation}: Readonly<AuthProps>) => {
  const {nickname, imageUri, role} = route.params;
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const {isLoading, setIsLoading} = useLoading();

  const uploadImageToS3 = async () => {
    if (!imageUri) {
      return;
    }

    setIsLoading(true);
    return new Promise(async (resolve, reject) => {
      const fileData = await RNFS.readFile(imageUri, 'base64');

      const params = {
        Bucket: S3Config.bucket,
        Key: new Date().toISOString(), // File name you want to save as in S3
        Body: Buffer.from(fileData, 'base64'),
        ContentType: 'image/jpeg',
      };

      const s3 = new AWS.S3({
        accessKeyId: S3Config.accessKeyID,
        secretAccessKey: S3Config.secretAccessKey,
        region: S3Config.region,
      });

      // Uploading files to the bucket
      s3.upload(params, function (err, data) {
        if (err) {
          console.log(err);
          setIsLoading(false);
          reject(err);
        } else {
          console.log(`File uploaded successfully. ${data.Location}`);
          setIsLoading(false);
          resolve(data.Location);
        }
      });
    });
  };

  const formatBirth = (birthday: string) => {
    const year = birthday.slice(0, 4);
    const month = birthday.slice(4, 6);
    const day = birthday.slice(6, 8);

    return new Date(`${year}-${month}-${day}`).toISOString();
  };

  const handleNext = async () => {
    if (!gender) {
      return;
    }

    const imageLocation = await uploadImageToS3();
    console.log('imageLocation', imageLocation);

    const data: MemberRequestData = {
      gender,
      name: nickname,
      profileImage: (imageLocation as string) ?? '',
      role: role as Role,
      birth: formatBirth(birthday),
    };
    try {
      const {result} = await postMember(data);
      console.log(result);

      await AsyncStorage.setItem('nickname', nickname);
      navigation.navigate('VolunteerOnboardingScreen');
    } catch (error) {
      console.log(error);
      Alert.alert('오류', '회원가입 중 오류가 발생했어요');
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <BG type="main">
        <>
          <View className="items-center pt-[80]">
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
              <TextInput
                value={birthday}
                onChangeText={setBirthday}
                placeholder="생년월일 (YYYYMMDD)"
                placeholderTextColor={'#A0A0A0'}
                className={`text-white py-[12] px-[23] font-r w-full inline-block border ${
                  birthday
                    ? 'border-yellow200 bg-white/20'
                    : 'border-white/10 bg-white/10'
                } mt-[31]`}
                style={{fontSize: 16, borderRadius: 10}}
              />

              <View className="mt-[28] flex-row">
                <Pressable
                  className={`flex-1 h-[121] items-center justify-center border mr-[22] ${
                    gender === 'MALE'
                      ? 'bg-white/20 border-yellowPrimary'
                      : 'bg-white/10 border-white/10'
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
                      ? 'bg-white/20 border-yellowPrimary'
                      : 'bg-white/10 border-white/10'
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
            source={require('../../../../assets/pngs/background/background2.png')}
            className="w-full h-auto flex-1 mt-[54]"
          />
          <View className="absolute left-0 bottom-[30] w-full px-[40]">
            <Button
              text="다음"
              onPress={handleNext}
              disabled={!birthday || !gender || isLoading}
              isLoading={isLoading}
            />
          </View>
        </>
      </BG>
    </SafeAreaView>
  );
};

export default MemberInfoWriteScreen;
