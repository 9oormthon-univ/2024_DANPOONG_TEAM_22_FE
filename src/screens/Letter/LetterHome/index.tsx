import {getAlarmCategory} from '@apis/alarm';
import {getLetters} from '@apis/providedFile';
import AnimatedView from '@components/atom/AnimatedView';
import BottomMenu from '@components/atom/BottomMenu';
import Button from '@components/atom/Button';
import Modal from '@components/atom/Modal';
import Toast from '@components/atom/Toast';
import Txt from '@components/atom/Txt';
import VirtualizedView from '@components/atom/VirtualizedView';
import {LETTERS_DATA} from '@constants/letter';
import {Portal} from '@gorhom/portal';
import useGetSummary from '@hooks/providedFile/useGetSummary';
import usePostReport from '@hooks/providedFile/usePostReport';
import useModal from '@hooks/useModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ListArea from '@screens/Letter/LetterHome/components/ListArea';
import ListHeader from '@screens/Letter/LetterHome/components/ListHeader';
import {LetterResponseData} from '@type/api/providedFile';
import {LetterStackParamList} from '@type/nav/LetterStackParamList';
import {useEffect, useState} from 'react';
import {Alert, Pressable, View} from 'react-native';

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
        console.log({alarmCategoryRes: alarmCategoryRes.result});
        const categories = alarmCategoryRes.result.map(item => ({
          category: item.alarmCategory,
          label: item.alarmCategoryKoreanName,
        }));
        setParentCategories(categories);

        const res = await getLetters({
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
      {/* <ScrollView stickyHeaderIndices={[2]}> */}
      <VirtualizedView>
        <ListHeader nickname={nickname} summaryData={summaryData} />
        {/* 편지 리스트 */}
        <ListArea
          nickname={nickname}
          list={filteredLettersData}
          // list={LETTERS_DATA}
          setClickedMoreDot={setClickedMoreDot}
          setSelectedFileId={setSelectedFileId}
          selectedFilterIdx={selectedFilterIdx}
          setSelectedFilterIdx={setSelectedFilterIdx}
          parentCategories={parentCategories}
          // parentCategories={[
          //   {category: 'WAKE_UP1', label: '기상'},
          //   {category: 'WAKE_UP2', label: '기상'},
          //   {category: 'WAKE_UP3', label: '기상'},
          //   {category: 'WAKE_UP4', label: '기상'},
          //   {category: 'SLEEP', label: '취침'},
          // ]}
        />
        {/* </ScrollView> */}
      </VirtualizedView>

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
