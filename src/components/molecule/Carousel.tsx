import React from 'react';
import {Dimensions} from 'react-native';
import Card from '@components/molecule/Card';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';
import {RCD} from '@apis/RCDApis/getRCDList';
import {RecordType} from '@type/RecordType';
const Carousel = ({entries, type}: {entries: RCD[]; type: RecordType}) => {
  const pageWidth = Dimensions.get('window').width - 60;
  //gap + offset = 30 이 되어야 함
  const gap = 14;
  const offset = 16;
  return (
    <GestureHandlerRootView
      style={{width: Dimensions.get('window').width, height: 333}}>
      <FlatList
        style={{width: '100%', height: '100%'}}
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
          return <Card key={index} item={item} gap={gap} type={type} />;
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

// import React from 'react';
// import { Dimensions } from 'react-native';
// import {default as MyCarousel} from 'react-native-reanimated-carousel';
// import Card from './Card';
// const Carousel = ({ entries }: { entries: any[] }) => {
//     const width = Dimensions.get('window').width;
//     return (
//         <MyCarousel
//         loop={true}
//         scrollAnimationDuration={1000}
//         mode="parallax"
//         modeConfig={{
//             parallaxScrollingScale: 0.85,
//             parallaxScrollingOffset: 68,
//         }}
//         width={width}
//         height={302}
//         data={entries}
//         // onSnapToItem={(index) => console.log('current index:', index)}
//         renderItem={({ item,index}) => (
//             <Card key={index} head={item.head}/>
//             )}
//         />
//     );
// };

// export default Carousel;
