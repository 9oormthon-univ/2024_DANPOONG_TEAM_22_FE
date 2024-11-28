import { StatusBar, View } from 'react-native'
import BG from '../../components/atom/BG'
import Txt from '../../components/atom/Txt'
import Carousel from '../../components/molecule/Carousel'
import { ImageBackground } from 'react-native'
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native'
import { HomeStackParamList } from '../../types/HomeStackParamList'
import { getRCDList, RCD } from '@apis/RCDApis/getRCDList'
import { useState, useEffect } from 'react'
import AppBar from '@components/atom/AppBar'
import { COLORS } from '@constants/Colors'
import { ActivityIndicator } from 'react-native'
const RCDListScreen = ({route}: {route: RouteProp<HomeStackParamList, 'RCDList'>}) => {
  const {type} = route.params
  const [rcdList, setRcdList] = useState<RCD[]>([])
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>()

  StatusBar.setBarStyle('light-content');
  StatusBar.setBackgroundColor(COLORS.bgSolid);
  useEffect(() => {
    console.log('list:', rcdList);
  }, [rcdList]);

  useEffect(() => {
    const fetchRCDList = async () => {
      const categoryType: 'DAILY' | 'COMFORT' = type;
      try {
        const data = await getRCDList(categoryType);
        setRcdList(data);
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
        title={type === 'DAILY' ? '일상 알림' : '위로 알림'}
        goBackCallbackFn={() => {
          navigation.goBack();
        }}
        className="absolute top-[0] w-full"
      />
      {/* BG Image */}
      <ImageBackground
        source={require('../../../assets/pngs/BGStarTop.png')}
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
            ? require('../../../assets/pngs/BGStarBottomDAILY.png')
            : require('../../../assets/pngs/BGStarBottomCOMFORT.png')
        }
        style={{position: 'absolute', bottom: 0, width: '100%', height: 258}}
      />
      {/* content section */}
        {/* header */}
        <View className="w-full mt-[132] px-px mb-[33]">
          <Txt
            type="title2"
            text={
              type === 'DAILY'
                ? '청년에게 일상을 응원하는\n녹음을 들려주세요'
                : '청년에게 위로하는\n목소리를 들려주세요'
            }
            className="text-white"
          />
          
        </View>
        {/* list */}
        {rcdList.length === 0 ? 
        <View className="h-[40vh] justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.white} /> 
        </View>
        : <Carousel entries={rcdList} type={type}/>}
    </BG>
  );
};
export default RCDListScreen;
