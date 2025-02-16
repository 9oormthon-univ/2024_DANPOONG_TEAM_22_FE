import {getAlarmCategory} from '@apis/alarm';
import {getLetters} from '@apis/providedFile';
import EmptyLetterIcon from '@assets/svgs/emptyLetter.svg';
import AnimatedView from '@components/atom/AnimatedView';
import BottomMenu from '@components/atom/BottomMenu';
import Button from '@components/atom/Button';
import Modal from '@components/atom/Modal';
import Toast from '@components/atom/Toast';
import Txt from '@components/atom/Txt';
import {EMOTION_OPTIONS, LETTERS_DATA} from '@constants/letter';
import {Portal} from '@gorhom/portal';
import useGetSummary from '@hooks/providedFile/useGetSummary';
import usePostReport from '@hooks/providedFile/usePostReport';
import useModal from '@hooks/useModal';
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
  const [clickedMoreDot, setClickedMoreDot] = useState(false);
  const {
    visible: visibleReport,
    openModal: openModalReport,
    closeModal: closeModalReport,
  } = useModal();
  const {
    visible: visibleDelete,
    openModal: openModalDelete,
    closeModal: closeModalDelete,
  } = useModal();

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
        // setLettersData(res.result.content);
        // setFilteredLettersData(res.result.content);
        setLettersData(LETTERS_DATA);
        setFilteredLettersData(LETTERS_DATA);
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

  const displayNum = (num: number) => {
    return num > 999 ? '999+' : String(num);
  };

  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [isToast, setIsToast] = useState(false); // 토스트 메시지 표시 상태
  const [toastMessage, setToastMessage] = useState(''); // 토스트 메시지
  const {mutate: postReport} = usePostReport();

  const handleReportClick = () => {
    if (!selectedFileId) return;
    postReport({providedFileId: selectedFileId, reason: ''});
    setIsToast(true);
    setToastMessage('신고되었어요');
    closeModalReport();
  };

  const handleDeleteClick = () => {
    if (!selectedFileId) return;
    // TODO: 삭제 API 호출
    setIsToast(true);
    setToastMessage('삭제되었어요');
    closeModalDelete();
  };

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
                  text={displayNum(
                    summaryData?.result.reactionsNum[
                      emotion.type as keyof typeof summaryData.result.reactionsNum
                    ] ?? 0,
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
                      <LetterCard
                        letter={letter}
                        idx={idx}
                        onPressMoreDot={() => {
                          setClickedMoreDot(true);
                          setSelectedFileId(letter.providedFileId);
                        }}
                      />
                      <View className="mb-[30]" />
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </View>

      <Portal>
        <Pressable
          onPress={() => setClickedMoreDot(false)}
          className={`absolute left-0 bottom-0 w-full h-full bg-black/50 px-[30] pb-[55] justify-end ${
            clickedMoreDot ? '' : 'hidden'
          }`}>
          {/* 내부 컴포넌트에는 상위 onPress 이벤트가 전파되지 않도록 함 */}
          <Pressable onPress={() => {}} className="w-full">
            <AnimatedView
              visible={clickedMoreDot}
              style={{borderRadius: 10}}
              className="bg-blue500 mb-[24]">
              <BottomMenu
                children={[
                  {
                    title: '신고하기',
                    onPress: () => {
                      openModalReport();
                      setClickedMoreDot(false);
                    },
                  },
                  {
                    title: '삭제하기',
                    onPress: () => {
                      openModalDelete();
                      setClickedMoreDot(false);
                    },
                  },
                ]}
              />
            </AnimatedView>

            <Button text="취소" onPress={() => setClickedMoreDot(false)} />
          </Pressable>
        </Pressable>
      </Portal>

      {/* TODO: reason 입력받기 */}
      <Modal
        type="info"
        visible={visibleReport}
        onCancel={closeModalReport}
        onConfirm={handleReportClick}
        buttonRatio="1:1"
        confirmText="신고">
        {/* TODO: 청년 닉네임 표시 */}
        <Txt
          type="title4"
          text={`[${'청년1'}]의 글을 신고하시겠어요?`}
          className="text-white mt-[26] mb-[13]"
        />
        <Txt
          type="caption1"
          text={`신고한 글은 삭제되며,\n작성자는 이용이 제한될 수 있어요`}
          className="text-gray300 mb-[29] text-center"
        />
      </Modal>

      <Modal
        type="info"
        visible={visibleDelete}
        onCancel={closeModalDelete}
        onConfirm={handleDeleteClick}
        buttonRatio="1:1"
        confirmText="삭제">
        {/* TODO: 청년 닉네임 표시 */}
        <Txt
          type="title4"
          text={`[${'청년1'}]의 글을 삭제하시겠어요?`}
          className="text-white mt-[26] mb-[13]"
        />
        <Txt
          type="caption1"
          text="삭제한 글은 되돌릴 수 없어요"
          className="text-gray300 mb-[29] text-center"
        />
      </Modal>

      <Toast
        text={toastMessage}
        isToast={isToast}
        setIsToast={() => setIsToast(false)}
      />
    </View>
  );
};

export default LetterHomeScreen;
