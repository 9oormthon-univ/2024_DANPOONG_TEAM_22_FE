import {Dimensions} from 'react-native';
import {Card} from '@screens/RCD/RCDList/components/Card';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';
import {AlarmListByCategoryTypeType} from '@apis/VolunteerRecord/get/AlarmListByCategoryType/type';
import {RecordType} from '@type/RecordType';
export const Carousel = ({entries, type}: {entries: AlarmListByCategoryTypeType[]; type: RecordType}) => {
  const windowWidth = Dimensions.get('window').width;
  const pageWidth = windowWidth - 60;
  const gap = 14; // 카드 간격
  const offset = 16; // 화면 맨 왼쪽,오른쪽 여백
    //gap + offset = 30 이 되어야 함 , 화면너비 - 30*2 = 페이지(카드) 너비

  return (
    <GestureHandlerRootView
      style={{width: windowWidth, height: 333}}>
      <FlatList
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: offset + gap / 2,
        }}
        data={entries}
        decelerationRate="fast"
        horizontal
        pagingEnabled
        renderItem={({item, index}) => {
          return <Card key={index} item={item} gap={gap} type={type} width={pageWidth}/>;
        }}
        snapToInterval={pageWidth + gap}
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews={false}
      />
    </GestureHandlerRootView>
  );
};
