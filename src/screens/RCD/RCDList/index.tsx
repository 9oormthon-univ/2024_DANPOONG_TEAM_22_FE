import {
  View,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import BG from '@components/atom/BG';
import Txt from '@components/atom/Txt';
import Carousel from '@components/molecule/Carousel';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {HomeStackParamList} from '@type/nav/HomeStackParamList';
import {getRCDList, RCD} from '@apis/RCDApis/getRCDList';
import {useState, useEffect} from 'react';
import AppBar from '@components/atom/AppBar';
import {COLORS} from '@constants/Colors';
import {RecordType} from '@type/RecordType';
import {RCDListHeader} from '@constants/RCDListHeader';
import {RCDListAppBar} from '@constants/RCDListAppBar';
const RCDListScreen = ({
  route,
}: {
  route: RouteProp<HomeStackParamList, 'RCDList'>;
}) => {
  const {type} = route.params;
  const [rcdList, setRcdList] = useState<RCD[]>([]);
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   console.log('list:', rcdList);
  // }, [rcdList]);

  useEffect(() => {
    const fetchRCDList = async () => {
      const categoryType: RecordType = type;
      try {
        setIsLoading(true);
        const data = await getRCDList(categoryType);
        setRcdList(data);
        setIsLoading(false);
      } catch (error) {
        console.log('RCD 목록을 가져오는데 실패했습니다:', error);
        setRcdList([]); // 에러 발생 시 빈 배열로 초기화
      } 
    };

    fetchRCDList();
  }, [type]);
  return (
    <BG type="gradation">
      <AppBar
        title={RCDListAppBar[type]}
        goBackCallbackFn={() => {
          navigation.goBack();
        }}
        className="absolute top-[0] w-full"
      />
      {/* BG Image */}
      <ImageBackground
        source={require('@assets/pngs/BGStarTop.png')}
        style={{
          position: 'absolute',
          top: 100,
          right: 0,
          width: 161,
          height: 130,
        }}
      />
      <ImageBackground
        source={
          type === 'DAILY'
            ? require('@assets/pngs/BGStarBottomDAILY.png')
            : require('@assets/pngs/BGStarBottomCOMFORT.png')
        }
        style={{position: 'absolute', bottom: 0, width: '100%', height: 258}}
      />
      {/* content section */}
      {/* header */}
      <View className="w-full mt-[132] px-px mb-[33]">
        <Txt
          type="title2"
          text={RCDListHeader[type]}
          className="text-white"
        />
      </View>
      {/* list */}
      {isLoading ? (
        <View className="h-[40vh] justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.white} />
        </View>
      ) : (
        <Carousel entries={rcdList} type={type} />
      )}
    </BG>
  );
};
export default RCDListScreen;
