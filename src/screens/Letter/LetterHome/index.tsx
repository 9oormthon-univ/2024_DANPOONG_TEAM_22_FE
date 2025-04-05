import {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  View,
} from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';

import {AnimatedView} from '@components/AnimatedView';
import {BottomMenu} from '@components/BottomMenu';
import {Button} from '@components/Button';
import {CustomText} from '@components/CustomText';
import {Modal} from '@components/Modal';
import {Toast} from '@components/Toast';
import {COLORS} from '@constants/Colors';
import {Portal} from '@gorhom/portal';
import { useGetAlarmCategory } from '@hooks/alarm/useGetAlarmCategory';
import { useDeleteLetter } from '@hooks/providedFile/useDeleteLetter';
import { useGetLetters } from '@hooks/providedFile/useGetLetters';
import { useGetSummary } from '@hooks/providedFile/useGetSummary';
import { usePostReport } from '@hooks/providedFile/usePostReport';
import { useModal } from '@hooks/useModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {type NativeStackScreenProps} from '@react-navigation/native-stack';
import { LetterCard } from '@screens/Letter/LetterHome/components/LetterCard';
import { ListCategory } from '@screens/Letter/LetterHome/components/ListCategory';
import { ListEmpty } from '@screens/Letter/LetterHome/components/ListEmpty';
import { ListHeader } from '@screens/Letter/LetterHome/components/ListHeader';
import {type LetterResponseData} from '@type/api/providedFile';
import {type LetterStackParamList} from '@type/nav/LetterStackParamList';

type LetterProps = NativeStackScreenProps<
  LetterStackParamList,
  'LetterHomeScreen'
>;

type Category = {category: string; label: string};

export const LetterHomeScreen = ({navigation}: Readonly<LetterProps>) => {
  const [nickname, setNickname] = useState('');
  const [selectedFilterIdx, setSelectedFilterIdx] = useState(0);
  const [parentCategories, setParentCategories] = useState<
    {category: string; label: string}[]
  >([]);
  const [clickedMoreDot, setClickedMoreDot] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [isToast, setIsToast] = useState(false); // 토스트 메시지 표시 상태
  const [toastMessage, setToastMessage] = useState(''); // 토스트 메시지
  const {mutate: postReport} = usePostReport();
  const {mutate: deleteLetter} = useDeleteLetter();
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
  const {
    data: summaryData,
    isError: isSummaryError,
    error: summaryError,
  } = useGetSummary();
  const {
    data: alarmCategoryData,
    isError: isAlarmCategoryError,
    error: alarmCategoryError,
    isLoading: isAlarmCategoryLoading,
  } = useGetAlarmCategory();
  const {
    data: lettersData,
    isError: isLettersError,
    error: lettersError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLettersLoading,
  } = useGetLetters({pageable: {page: 0, size: 10, sort: 'createdAt,desc'}});

  const lettersFlatData =
    lettersData?.pages.flatMap(page => page.result.content) || [];

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const nickname = await AsyncStorage.getItem('nickname');

      setNickname(nickname ?? '');
      })();
    }, []),
  );

  useEffect(() => {
    if (isSummaryError) {
      console.error(summaryError);
      Alert.alert('오류', '편지 요약 정보를 불러오는 중 오류가 발생했어요');
    }
  }, [isSummaryError]);

  useEffect(() => {
    if (isAlarmCategoryError) {
      console.error(alarmCategoryError);
      Alert.alert('오류', '알람 카테고리를 불러오는 중 오류가 발생했어요');
    }
  }, [isAlarmCategoryError]);

  useEffect(() => {
    if (isLettersError) {
      console.error(lettersError);
      Alert.alert('오류', '편지 정보를 불러오는 중 오류가 발생했어요');
    }
  }, [isLettersError]);

  useEffect(() => {
    if (!alarmCategoryData) return;

    console.log({alarmCategoryData});

    const categories: Category[] = [
      {category: 'ALL', label: '전체'},
      ...alarmCategoryData.result.map(item => ({
        category: item.alarmCategory,
        label: item.alarmCategoryKoreanName,
      })),
    ];

    setParentCategories(categories);
  }, [alarmCategoryData]);

  const handleReportClick = () => {
    if (!selectedFileId) return;

    postReport({providedFileId: selectedFileId, reason: ''});
    setIsToast(true);
    setToastMessage('신고한 편지가 삭제되었어요');
    closeModalReport();
  };

  const handleDeleteClick = () => {
    if (!selectedFileId) return;

    deleteLetter({providedFileId: selectedFileId, reason: ''});
    setIsToast(true);
    setToastMessage('편지가 삭제되었어요');
    closeModalDelete();
  };

  const bottomMenuData = [
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
  ];

  const stickyHeaderMockData: LetterResponseData = {
    providedFileId: -1,
    createdAt: '',
    thanksMessage: '',
    alarmType: '식사',
    member: {
      id: 0,
      name: '',
      profileImage: '',
    },
  };

  const filteredData = [
    stickyHeaderMockData,
    ...(selectedFilterIdx === 0
      ? lettersFlatData
      : lettersFlatData.filter(
          letter =>
            letter.alarmType === parentCategories[selectedFilterIdx]?.label,
        )),
  ];

  return (
    <View className="flex-1 bg-blue600">
      <FlatList
        data={filteredData}
        keyExtractor={item => String(item.providedFileId)}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <ListHeader nickname={nickname} summaryData={summaryData} />
        }
        stickyHeaderIndices={[1]}
        renderItem={({item}) => (
          <>
            {item.providedFileId === -1 && (
              <>
                <Skeleton
                  isLoading={
                    isAlarmCategoryLoading && parentCategories.length === 0
                  }
                  boneColor={COLORS.blue500}
                  highlightColor={COLORS.blue400}
                  containerStyle={{paddingHorizontal: 0}}
                  layout={[
                    {
                      key: 'alarmCategory_wrapper',
                      paddingVertical: 31,
                      paddingHorizontal: 30,
                      flexDirection: 'row',
                      children: [
                        {
                          key: 'alarmCategory1',
                          width: 60,
                          height: 25,
                          marginRight: 8,
                          borderRadius: 50,
                        },
                        {
                          key: 'alarmCategory2',
                          width: 60,
                          height: 25,
                          marginRight: 8,
                          borderRadius: 50,
                        },
                        {
                          key: 'alarmCategory3',
                          width: 60,
                          height: 25,
                          marginRight: 8,
                          borderRadius: 50,
                        },
                        {
                          key: 'alarmCategory4',
                          width: 60,
                          height: 25,
                          marginRight: 8,
                          borderRadius: 50,
                        },
                      ],
                    },
                    {
                      key: 'alarmCategory_wrapper2',
                      width: 140,
                      height: 25,
                      borderRadius: 50,
                      marginLeft: 34,
                      marginRight: 30,
                      marginBottom: 43,
                    },
                  ]}>
                  <ListCategory
                    nickname={nickname}
                    selectedFilterIdx={selectedFilterIdx}
                    setSelectedFilterIdx={setSelectedFilterIdx}
                    parentCategories={parentCategories}
                  />
                </Skeleton>
                <Skeleton
                  isLoading={isLettersLoading}
                  boneColor={COLORS.blue500}
                  highlightColor={COLORS.blue400}
                  containerStyle={{paddingHorizontal: 30}}
                  layout={[
                    {
                      key: 'letterCard1',
                      width: '100%',
                      height: 153,
                      borderRadius: 10,
                      marginBottom: 25,
                    },
                    {
                      key: 'letterCard2',
                      width: '100%',
                      height: 153,
                      borderRadius: 10,
                      marginBottom: 25,
                    },
                    {
                      key: 'letterCard3',
                      width: '100%',
                      height: 153,
                      borderRadius: 10,
                      marginBottom: 25,
                    },
                  ]}>
                  {filteredData.length === 1 && <ListEmpty />}
                </Skeleton>
              </>
            )}
            {item.providedFileId !== -1 && (
              <View className="px-[30]">
                <LetterCard
                  letter={item}
                  onPressMoreDot={() => {
                    setClickedMoreDot(true);
                    setSelectedFileId(item.providedFileId);
                  }}
                />
                <View className="mb-[30]" />
              </View>
            )}
          </>
        )}
        contentContainerStyle={{
          paddingBottom: 150,
          backgroundColor: COLORS.blue600,
        }}
        ListFooterComponent={
          hasNextPage ? (
            <ActivityIndicator color={COLORS.white} size="large" />
          ) : null
        }
      />

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
              <BottomMenu data={bottomMenuData} />
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
        <CustomText
          type="title4"
          text={`[${
            lettersFlatData.find(
              letter => letter.providedFileId === selectedFileId,
            )?.member.name ?? ''
          }]의 글을 신고하시겠어요?`}
          className="text-white mt-[26] mb-[13] text-center"
        />
        <CustomText
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
        <CustomText
          type="title4"
          text={`[${
            lettersFlatData.find(
              letter => letter.providedFileId === selectedFileId,
            )?.member.name ?? ''
          }]의 글을 삭제하시겠어요?`}
          className="text-white mt-[26] mb-[13] text-center"
        />
        <CustomText
          type="caption1"
          text="삭제한 글은 되돌릴 수 없어요"
          className="text-gray300 mb-[29] text-center"
        />
      </Modal>

      <Toast
        text={toastMessage}
        isToast={isToast}
        setIsToast={() => setIsToast(false)}
        position="bottom"
        type="check"
      />
    </View>
  );
};