import EmptyLetterIcon from '@assets/svgs/emptyLetter.svg';
import Txt from '@components/atom/Txt';
import LetterCard from '@screens/Letter/LetterList/components/LetterCard';
import {LetterResponseData} from '@type/api/providedFile';
import {ScrollView, View} from 'react-native';

const ListArea = ({
  nickname,
  list,
  setClickedMoreDot,
  setSelectedFileId,
}: Readonly<{
  nickname: string;
  list: LetterResponseData[];
  setClickedMoreDot: (value: React.SetStateAction<boolean>) => void;
  setSelectedFileId: React.Dispatch<React.SetStateAction<number | null>>;
}>) => {
  return (
    <View className="px-[30] pb-[150] bg-blue600">
      <View className="">
        {!list || list.length === 0 ? (
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
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
            <View className="">
              {list.map((letter, idx) => (
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
  );
};

export default ListArea;
