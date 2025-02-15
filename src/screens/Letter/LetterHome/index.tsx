import {getAlarmCategory} from '@apis/alarm';
import {getLetters} from '@apis/providedFile';
import EmptyLetterIcon from '@assets/svgs/emptyLetter.svg';
import Txt from '@components/atom/Txt';
import {EMOTION_OPTIONS} from '@constants/letter';
import useGetSummary from '@hooks/providedFile/useGetSummary';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import LetterCard from '@screens/Letter/LetterList/components/LetterCard';
import {LetterResponseData} from '@type/api/providedFile';
import {LetterStackParamList} from '@type/nav/LetterStackParamList';
import {useEffect, useState} from 'react';
import {Alert, Pressable, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

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

  const [selectedFilterIdx, setSelectedFilterIdx] = useState(0);
  const [lettersData, setLettersData] = useState<LetterResponseData[]>([]);
  const [filteredLettersData, setFilteredLettersData] = useState<
    LetterResponseData[]
  >([]);
  const [parentCategories, setParentCategories] = useState<
    {category: string; label: string}[]
  >([]);

  useEffect(() => {
    (async () => {
      const nickname = await AsyncStorage.getItem('nickname');
      setNickname(nickname ?? '');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const alarmCategoryRes = await getAlarmCategory();
        console.log(alarmCategoryRes.result);
        const categories = alarmCategoryRes.result.map(item => ({
          category: item.alarmCategory,
          label: item.alarmCategoryKoreanName,
        }));
        setParentCategories(categories);

        const res = await getLetters({
          parentCategoryId: 1,
          pageable: {page: 0, size: 10, sort: 'createdAt,desc'},
        });
        console.log(res);
        setLettersData(res.result.content);
        setFilteredLettersData(res.result.content);
        // setLettersData(LETTERS_DATA);
        // setFilteredLettersData(LETTERS_DATA);
      } catch (error) {
        console.error(error);
        Alert.alert('오류', '편지 정보를 불러오는 중 오류가 발생했어요');
      }
    })();
  }, []);

  useEffect(() => {
    console.log('lettersData', lettersData);
    const filteredLetters = lettersData.filter(
      letter => letter.alarmType === parentCategories[selectedFilterIdx].label,
    );
    console.log('filteredLetters', filteredLetters);
    setFilteredLettersData(filteredLetters);
  }, [selectedFilterIdx]);

  return (
    <View className="bg-blue700 flex-1">
      <View className="px-[30]">
        <View className="h-[61]" />
        <Txt
          type="title2"
          text={`${nickname}님의 목소리를`}
          className="text-white"
        />
        <View className="flex-row">
          <View className="flex-row justify-start items-center">
            <Txt type="title2" text="청년들이 " className="text-white" />
            <Txt
              type="title2"
              text={`${String(summaryData?.result.totalListeners ?? '')}번`}
              className="text-yellowPrimary"
            />
            <Txt type="title2" text=" 청취했어요" className="text-white" />
          </View>
        </View>

        <View className="h-[31]" />

        <View className="flex-row items-center">
          {EMOTION_OPTIONS.slice(0, 2).map(emotion => (
            <View key={emotion.label} className="flex-row items-center flex-1">
              <View className="flex-row items-center flex-1">
                {emotion.icon}
                <View className="w-[5]" />
                <Txt type="body3" text={emotion.label} className="text-white" />
                <View className="w-[8]" />
                <Txt
                  type="body3"
                  text={String(
                    summaryData?.result.reactionsNum[
                      emotion.type as keyof typeof summaryData.result.reactionsNum
                    ] ?? '',
                  )}
                  className="text-yellowPrimary"
                />
              </View>
              <View className="w-[41]" />
            </View>
          ))}
        </View>
        <View className="h-[15]" />
        <View className="flex-row items-center">
          {EMOTION_OPTIONS.slice(2).map(emotion => (
            <View key={emotion.label} className="flex-row items-center flex-1">
              <View className="flex-row items-center flex-1">
                {emotion.icon}
                <View className="w-[5]" />
                <Txt type="body3" text={emotion.label} className="text-white" />
                <View className="w-[8]" />
                <Txt
                  type="body3"
                  text={String(
                    summaryData?.result.reactionsNum[
                      emotion.type as keyof typeof summaryData.result.reactionsNum
                    ] ?? '',
                  )}
                  className="text-yellowPrimary"
                />
              </View>
              <View className="w-[41]" />
            </View>
          ))}
        </View>
      </View>

      <View className="h-[45]" />

      <View className="bg-blue600 flex-1">
        {/* 편지 카테고리 */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="py-[30]">
            <View className="flex-row items-center px-[30] h-[36]">
              {parentCategories.map((menu, index) => (
                <Pressable
                  key={`${menu.category}=${menu.label}-parentCategories`}
                  className={`h-[36] px-[22] items-center justify-center border ${
                    index === selectedFilterIdx
                      ? 'border-blue400 bg-white/10'
                      : 'border-white10'
                  } mr-[8]`}
                  style={{borderRadius: 20}}
                  onPress={() => setSelectedFilterIdx(index)}>
                  <Txt
                    type="body4"
                    text={menu.label}
                    className={`${
                      index === selectedFilterIdx
                        ? 'text-yellowPrimary'
                        : 'text-gray300'
                    }`}
                  />
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* <View className="h-[32]" /> */}

        {/* 편지 리스트 */}
        <View className="px-[30] pb-[280]">
          <View className="flex-row items-center">
            <Text
              className="text-white"
              style={{
                fontSize: 22,
                fontFamily: 'LeeSeoyun-Regular',
                lineHeight: 22 * 1.5,
              }}>
              TO.
            </Text>
            <Txt
              type="title4"
              text={nickname ?? ''}
              className="text-yellowPrimary ml-[7]"
            />
          </View>

          <View className="h-[22]" />

          <View className="">
            {!filteredLettersData || filteredLettersData.length === 0 ? (
              <View className="items-center justify-center pt-[40]">
                <EmptyLetterIcon />
                <View className="h-[26.27]" />
                <Txt
                  type="caption1"
                  text={`아직 받은 편지가 없어요\n청년들에게 더 많은 목소리를 전해보세요`}
                  className="text-blue300 text-center"
                />
              </View>
            ) : (
              <ScrollView className="">
                <View className="">
                  {filteredLettersData.map((letter, idx) => (
                    <View
                      key={`${letter.createdAt}-${letter.providedFileId}-filteredLettersData`}>
                      <LetterCard letter={letter} idx={idx} />
                      <View className="mb-[30]" />
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default LetterHomeScreen;
