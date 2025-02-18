import EmptyLetterIcon from '@assets/svgs/emptyLetter.svg';
import Txt from '@components/atom/Txt';
import LetterCard from '@screens/Letter/LetterList/components/LetterCard';
import {LetterResponseData} from '@type/api/providedFile';
import {FlatList, Pressable, ScrollView, Text, View} from 'react-native';

const ListArea = ({
  nickname,
  list,
  setClickedMoreDot,
  setSelectedFileId,
  selectedFilterIdx,
  setSelectedFilterIdx,
  parentCategories,
}: Readonly<{
  nickname: string;
  list: LetterResponseData[];
  setClickedMoreDot: (value: React.SetStateAction<boolean>) => void;
  setSelectedFileId: React.Dispatch<React.SetStateAction<number | null>>;
  selectedFilterIdx: number;
  setSelectedFilterIdx: React.Dispatch<React.SetStateAction<number>>;
  parentCategories: {
    category: string;
    label: string;
  }[];
}>) => {
  return (
    <View className="px-[30">
      <View className="h-[45]" />
      <View className="bg-blue600">
        <View className="flex-1]">
          {/* 편지 카테고리 */}
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
      </View>

      <View className="px-[30] pb-[150] bg-blue600">
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
            //   <ScrollView>
            //     <View className="">
            //       {list.map((letter, idx) => (
            //         <View
            //           key={`${letter.createdAt}-${letter.providedFileId}-filteredLettersData`}>
            //           <LetterCard
            //             letter={letter}
            //             idx={idx}
            //             onPressMoreDot={() => {
            //               setClickedMoreDot(true);
            //               setSelectedFileId(letter.providedFileId);
            //             }}
            //           />
            //           <View className="mb-[30]" />
            //         </View>
            //       ))}
            //     </View>
            //   </ScrollView>
            <FlatList
              data={list}
              keyExtractor={item =>
                `${item.createdAt}-${item.providedFileId}-filteredLettersData`
              }
              renderItem={({item, index}) => (
                <View>
                  <LetterCard
                    letter={item}
                    idx={index}
                    onPressMoreDot={() => {
                      setClickedMoreDot(true);
                      setSelectedFileId(item.providedFileId);
                    }}
                  />
                  <View className="mb-[30]" />
                </View>
              )}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              contentContainerStyle={{paddingBottom: 20}}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default ListArea;
