import React from 'react';
import {Dimensions} from 'react-native';
import Card from '@components/molecule/Card';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';
import {RCD} from '@apis/RCDApis/getRCDList';
import {RecordType} from '@type/RecordType';
const Carousel = ({entries, type}: {entries: RCD[]; type: RecordType}) => {
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

export default Carousel;

