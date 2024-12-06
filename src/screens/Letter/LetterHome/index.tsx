import BG from '@components/atom/BG';
import ShadowView from '@components/atom/ShadowView';
import Txt from '@components/atom/Txt';
import useGetSummary from '@hooks/providedFile/useGetSummary';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LetterStackParamList} from '@type/nav/LetterStackParamList';
import {useEffect, useState} from 'react';
import {Alert, Image, Pressable, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import ChevronRightWhiteIcon from '@assets/svgs/chevron/chevron_right_white.svg';
import {EMOTION_OPTIONS} from '@screens/Youth/YouthListen';
import StatusBarGap from '@components/atom/StatusBarGap';

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
      <BG type='main'>
        <ScrollView className="flex-1">
          <StatusBarGap />
          <View className="flex-1 pt-[50] pb-[110]">
            <View className="w-full items-center px-[35]">
              <Image
                source={require('@assets/webps/bookdo.webp')}
                className="w-[310] h-[305]"
              />
            </View>

            <View className="mt-[24] px-[37]">
              <Txt
                type="body3"
                text={`청년들이 ${nickname ?? ''} 님의 목소리를`}
                className="text-white"
              />
              <View className="flex-row mt-[9] items-center">
                <Txt
                  type="title1"
                  text={String(summaryData?.result.totalListeners)}
                  className="text-yellowPrimary"
                />
                <Txt
                  type="body2"
                  text="&nbsp;번 청취했어요"
                  className="text-white"
                />
              </View>
            </View>

            <Pressable
              className="mt-[22] h-[95] px-[30]"
              onPress={() => navigation.navigate('LetterListScreen')}>
              <ShadowView>
                <View className="py-[18] px-[24] flex-row justify-between items-center">
                  <View>
                    <Txt
                      type="title4"
                      text="청년의 편지"
                      className="text-yellowPrimary"
                    />
                    <Txt
                      type="body4"
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
                  {EMOTION_OPTIONS.map((emotion, index) => (
                    <Pressable key={emotion.label} className="flex-1">
                      <View className="flex-row items-center">
                        {index > 0 && (
                          <View className="h-[82] w-[1] bg-white/10" />
                        )}
                        <View className="justify-center items-center flex-1">
                          {emotion.icon}
                          <Txt
                            type="caption1"
                            text={emotion.label}
                            className="text-gray300 mt-[4] text-center"
                          />
                          <Txt
                            type="body2"
                            text={String(
                              summaryData?.result.reactionsNum[
                                emotion.value as keyof typeof summaryData.result.reactionsNum
                              ],
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
  );
};

export default LetterHomeScreen;
