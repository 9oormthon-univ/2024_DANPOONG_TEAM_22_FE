import {View, TouchableOpacity, ImageBackground} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import Txt from '../../components/atom/Txt';
import BG from '../../components/atom/BG';
import {HomeStackParamList} from '../../types/HomeStackParamList';
import Main1 from '../../../assets/svgs/main1.svg';
import Main2 from '../../../assets/svgs/main2.svg';
import Main3 from '../../../assets/svgs/main3.svg';
// import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {StatusBar} from 'react-native';
import {COLORS} from '../../libs/constants/Colors';
import {getYouthNum} from '../../libs/apis/RCDApis/getYouthNum';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  // const tabBarHeight = useBottomTabBarHeight();
  StatusBar.setBarStyle('light-content');
  StatusBar.setBackgroundColor(COLORS.bgMainPageBack100);
  const [nickname, setNickname] = useState('');

  const [youthNum, setYouthNum] = useState<number>(999);

  useEffect(() => {
    (async () => {
      const nickname = await AsyncStorage.getItem('nickname');
      setNickname(nickname ?? '');
    })();
  }, []);

  useEffect(() => {
    getYouthNum().then(num => {
      console.log('youthNum:', num);
      setYouthNum(num);
    });
  }, []);

  return (
    <BG type="main">
      {/* 배경 이미지 */}
      <ImageBackground
        source={require('../../../assets/pngs/mainBG.png')}
        style={{position: 'absolute', bottom: 0, width: '100%', height: 762}}
      />
      {/* 전체 frame */}
      <View className="flex-1 px-[30] pt-[117]">
        {/* header */}
        <View className="w-full mb-[46]">
          <Txt
            type="title3"
            content={`${nickname ?? ''}님, 반가워요!`}
            color="gray_300"
          />
          <View className="flex flex-row mt-[9]">
            <Txt
              type="title2"
              content={`${youthNum}명의 청년들`}
              color="primary"
            />
            <Txt type="title2" content="이" color="white" />
          </View>
          <Txt
            type="title2"
            content={'당신의 목소리를 기다리고 있어요'}
            color="white"
          />
        </View>
        {/* button section*/}
        <View className="w-full h-[207] flex-row justify-between">
          <SelectBtn type="DAILY" />
          <SelectBtn type="COMFORT" />
        </View>
      </View>
    </BG>
  );
};
export default HomeScreen;

const SelectBtn = ({type}: {type: 'DAILY' | 'COMFORT'}) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('RCDList', {type});
      }}
      className="w-[168] h-[207] px-[25] py-[24] bg-solid border border-white/10 justify-between"
      style={{borderRadius: 10}}>
      {/* svg */}
      <View>
        <View className="pb-[19]">
          {type === 'DAILY' ? <Main1 /> : <Main2 />}
        </View>
        {/* text */}
        <Txt
          type="title3"
          content={`${type === 'DAILY' ? '일상' : '위로'} 녹음`}
          color="white"
        />
      </View>
      <View className="flex flex-row w-full justify-between items-center">
        <Txt type="button" content="녹음하기" color="primary" />
        <Main3 />
      </View>
    </TouchableOpacity>
  );
};
