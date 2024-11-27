import BG from '@components/atom/BG';
import Body2 from '@components/atom/body/Body2';
import Body3 from '@components/atom/body/Body3';
import Body4 from '@components/atom/body/Body4';
import Caption1 from '@components/atom/caption/Caption1';
import ShadowView from '@components/atom/ShadowView';
import Title1 from '@components/atom/title/Title1';
import Title4 from '@components/atom/title/Title4';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {emotions} from '@screens/YouthListen';
import {LetterStackParamList} from '@type/LetterStackParamList';
import {Alert, Image, Pressable, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import ChevronRightWhiteIcon from '../../../assets/images/youth/chevron_right_white.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useGetSummary from '@hooks/providedFile/useGetSummary';
import {useEffect, useState} from 'react';

type LetterProps = NativeStackScreenProps<
  LetterStackParamList,
  'LetterHomeScreen'
>;

const LetterHomeScreen = ({navigation}: Readonly<LetterProps>) => {
  const [nickname, setNickname] = useState('');

  const {
    data: summaryData,
    isError: isSummaryError,
    error: summaryError,
  } = useGetSummary();

  useEffect(() => {
    if (isSummaryError) {
      console.error(summaryError);
      Alert.alert('오류', '편지 요약 정보를 불러오는 중 오류가 발생했어요');
    }
  }, [isSummaryError, summaryError]);

  useEffect(() => {
    (async () => {
      const nickname = await AsyncStorage.getItem('nickname');
      setNickname(nickname ?? '');
    })();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <BG type="main">
        <ScrollView className="flex-1">
          <View className="flex-1 pt-[50] pb-[110]">
            <View className="w-full items-center px-[35]">
              <Image
                source={require('../../../assets/images/letterHome/bookdo.png')}
                className="w-[310] h-[305]"
              />
            </View>

            <View className="mt-[24] px-[37]">
              <Body3
                text={`청년들이 ${nickname ?? ''} 님의 목소리를`}
                className="text-white"
              />
              <View className="flex-row mt-[9] items-center">
                <Title1
                  text={String(summaryData?.result.totalListeners)}
                  className="text-yellowPrimary"
                />
                <Body2 text="&nbsp;번 청취했어요" className="text-white" />
              </View>
            </View>

            <Pressable
              className="mt-[22] h-[95] px-[30]"
              onPress={() => navigation.navigate('LetterListScreen')}>
              <ShadowView>
                <View className="py-[18] px-[24] flex-row justify-between items-center">
                  <View>
                    <Title4 text="청년의 편지" className="text-yellowPrimary" />
                    <Body4
                      text="자립준비 청년의 감사 편지를 확인해요"
                      className="text-gray200 mt-[3]"
                    />
                  </View>
                  <ChevronRightWhiteIcon />
                </View>
              </ShadowView>
            </Pressable>
            {/* py-[14] px-[20] */}
            <View className="mt-[22] h-[113] px-[30]">
              <ShadowView>
                <View className="flex-row items-center flex-1 h-[113]">
                  {emotions.map((emotion, index) => (
                    <Pressable key={emotion.label} className="flex-1">
                      <View className="flex-row items-center">
                        {index > 0 && (
                          <View className="h-[82] w-[1] bg-white/10" />
                        )}
                        <View className="justify-center items-center flex-1">
                          {emotion.icon}
                          <Caption1
                            text={emotion.label}
                            className="text-gray300 mt-[4] text-center"
                          />
                          <Body2
                            text={String(
                              summaryData?.result.reactionsNum[emotion.value as keyof typeof summaryData.result.reactionsNum],
                            )}
                            // text="33"
                            className="text-gray100 text-center"
                          />
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </ShadowView>
            </View>
          </View>
        </ScrollView>
      </BG>
    </SafeAreaView>
  );
};

export default LetterHomeScreen;
