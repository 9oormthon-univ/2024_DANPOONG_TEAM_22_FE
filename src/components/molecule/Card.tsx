import {View} from 'react-native';
import Txt from '../atom/Txt';
import ShadowView from '../atom/ShadowView';
import Button from '@components/atom/Button';
import {ImageBackground} from 'react-native';
import StarPNG from '@components/atom/StarPNG';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {HomeStackParamList} from '../../types/HomeStackParamList';
import {RCD} from '@apis/RCDApis/getRCDList';
const Card = ({
  item,
  gap,
  type,
}: {
  item: RCD;
  gap: number;
  type: 'DAILY' | 'COMFORT';
}) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  return (
    <View className={'w-[352] h-full'} style={{marginHorizontal: gap / 2}}>
      <ShadowView>
        {/* frame */}
        <View className="w-full h-full justify-evenly items-center px-px">
          {/* 별 이미지 */}
          <View className="flex w-full flex-row justify-center items-center">
            <StarPNG />
          </View>
          {/* 제목 head*/}
          <View className="w-full">
            <Txt
              type="title3"
              text={item.title}
              className="text-white text-center"
            />
          </View>
          {/* button */}
          <View className="w-full">
            <Button
              text="녹음하기"
              onPress={() => {
                navigation.navigate('RCDNotice', {type, item});
              }}
              disabled={false}
            />
          </View>
        </View>
      </ShadowView>
    </View>
  );
};
export default Card;
