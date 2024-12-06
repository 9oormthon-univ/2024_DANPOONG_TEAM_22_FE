import {RCD} from '@apis/RCDApis/getRCDList';
import Button from '@components/atom/Button';
import StarIMG from '@components/atom/StarIMG';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import {HomeStackParamList} from '@type/nav/HomeStackParamList';
import ShadowView from '@components/atom/ShadowView';
import Txt from '@components/atom/Txt';
import {RecordType} from '@type/RecordType';
const Card = ({
  item,
  gap,
  type,
}: {
  item: RCD;
  gap: number;
  type: RecordType;
}) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  return (
    <View className={'w-[352] h-full'} style={{marginHorizontal: gap / 2}}>
      <ShadowView>
        {/* frame */}
        <View className="w-full h-full justify-evenly items-center px-px">
          {/* 별 이미지 */}
          <View className="flex w-full flex-row justify-center items-center">
            <StarIMG />
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
