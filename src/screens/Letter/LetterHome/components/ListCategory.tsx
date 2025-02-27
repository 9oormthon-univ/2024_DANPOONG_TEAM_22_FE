import Txt from '@components/atom/Txt';
import {Pressable, ScrollView, Text, View} from 'react-native';

const ListCategory = ({
  nickname,
  selectedFilterIdx,
  setSelectedFilterIdx,
  parentCategories,
}: Readonly<{
  nickname: string;
  selectedFilterIdx: number;
  setSelectedFilterIdx: React.Dispatch<React.SetStateAction<number>>;
  parentCategories: {
    category: string;
    label: string;
  }[];
}>) => {
  return (
    <View className="bg-blue600">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="py-[30]"
        nestedScrollEnabled>
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
      <View className="flex-row items-center px-[30] ml-[4]">
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
    </View>
  );
};

export default ListCategory;
