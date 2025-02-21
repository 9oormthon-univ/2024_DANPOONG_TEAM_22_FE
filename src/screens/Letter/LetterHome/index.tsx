import AnimatedView from '@components/atom/AnimatedView';
import BottomMenu from '@components/atom/BottomMenu';
import Button from '@components/atom/Button';
import Modal from '@components/atom/Modal';
import Toast from '@components/atom/Toast';
import Txt from '@components/atom/Txt';
import {LETTERS_DATA} from '@constants/letter';
import {Portal} from '@gorhom/portal';
import useGetAlarmCategory from '@hooks/alarm/useGetAlarmCategory';
import useDeleteLetter from '@hooks/providedFile/useDeleteLetter';
import useGetLetters from '@hooks/providedFile/useGetLetters';
import useGetSummary from '@hooks/providedFile/useGetSummary';
import usePostReport from '@hooks/providedFile/usePostReport';
import useModal from '@hooks/useModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ListArea from '@screens/Letter/LetterHome/components/ListArea';
import ListCategory from '@screens/Letter/LetterHome/components/ListCategory';
import ListHeader from '@screens/Letter/LetterHome/components/ListHeader';
import {LetterResponseData} from '@type/api/providedFile';
import {LetterStackParamList} from '@type/nav/LetterStackParamList';
import {useEffect, useState} from 'react';
import {Alert, Pressable, ScrollView, View} from 'react-native';

type LetterProps = NativeStackScreenProps<
  LetterStackParamList,
  'LetterHomeScreen'
>;

type Category = {category: string; label: string};

const LetterHomeScreen = ({navigation}: Readonly<LetterProps>) => {
  const [nickname, setNickname] = useState('');
  const [selectedFilterIdx, setSelectedFilterIdx] = useState(0);
  const [filteredLettersData, setFilteredLettersData] = useState<
    LetterResponseData[]
  >([]);
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
  } = useGetAlarmCategory();
  const {
    data: lettersData,
    isError: isLettersError,
    error: lettersError,
  } = useGetLetters({pageable: {page: 0, size: 10, sort: 'createdAt,desc'}});

  useEffect(() => {
    (async () => {
      const nickname = await AsyncStorage.getItem('nickname');
      setNickname(nickname ?? '');
    })();
  }, []);

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

  useEffect(() => {
    if (!lettersData) return;
    console.log({lettersData});
    // setFilteredLettersData(lettersData.result.content);
    setFilteredLettersData(LETTERS_DATA);
  }, [lettersData]);

  useEffect(() => {
    if (!lettersData) return;
    if (selectedFilterIdx === 0) {
      // setFilteredLettersData(lettersData.result.content);
      setFilteredLettersData(LETTERS_DATA);
      return;
    }
    // const filteredLetters = lettersData.result.content.filter(
    //   letter => letter.alarmType === parentCategories[selectedFilterIdx].label,
    // );
    const filteredLetters = LETTERS_DATA.filter(
      letter => letter.alarmType === parentCategories[selectedFilterIdx]?.label,
    );
    console.log({filteredLetters});
    if (!filteredLetters) return;
    setFilteredLettersData(filteredLetters);
  }, [selectedFilterIdx]);

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

  return (
    <View className="bg-blue700 flex-1">
      <ScrollView stickyHeaderIndices={[1]}>
        <ListHeader nickname={nickname} summaryData={summaryData} />
        {/* 편지 카테고리 */}
        <ListCategory
          nickname={nickname}
          selectedFilterIdx={selectedFilterIdx}
          setSelectedFilterIdx={setSelectedFilterIdx}
          parentCategories={parentCategories}
        />
        {/* 편지 리스트 */}
        <ListArea
          nickname={nickname}
          list={filteredLettersData}
          // list={LETTERS_DATA}
          setClickedMoreDot={setClickedMoreDot}
          setSelectedFileId={setSelectedFileId}
        />
      </ScrollView>

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
        <Txt
          type="title4"
          // text={`[${
          //   lettersData?.result.content.find(
          //     letter => letter.providedFileId === selectedFileId,
          //   )?.member.name ?? ''
          // }]의 글을 신고하시겠어요?`}
          text={`[${
            LETTERS_DATA.find(
              letter => letter.providedFileId === selectedFileId,
            )?.member.name ?? ''
          }]의 글을 신고하시겠어요?`}
          className="text-white mt-[26] mb-[13] text-center"
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
        <Txt
          type="title4"
          // text={`[${
          //   lettersData?.result.content.find(
          //     letter => letter.providedFileId === selectedFileId,
          //   )?.member.name ?? ''
          // }]의 글을 삭제하시겠어요?`}
          text={`[${
            LETTERS_DATA.find(
              letter => letter.providedFileId === selectedFileId,
            )?.member.name ?? ''
          }]의 글을 삭제하시겠어요?`}
          className="text-white mt-[26] mb-[13] text-center"
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
        position="bottom"
        type="check"
      />
    </View>
  );
};

export default LetterHomeScreen;
