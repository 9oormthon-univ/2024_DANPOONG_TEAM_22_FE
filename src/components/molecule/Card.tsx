import {RCD} from '@apis/RCDApis/getRCDList';
import Button from '@components/atom/Button';
import ShadowView from '@components/atom/ShadowView';
import StarIMG from '@components/atom/StarIMG';
import Txt from '@components/atom/Txt';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {HomeStackParamList} from '@type/nav/HomeStackParamList';
import {RecordType} from '@type/RecordType';
import {trackEvent} from '@utils/tracker';
import {View} from 'react-native';
const Card = ({
  item,
  gap,
  type,
  width,
}: {
  item: RCD;
  gap: number;
  type: RecordType;
  width: number;
}) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  return (
    <View className={'h-full'} style={{marginHorizontal: gap / 2, width: width}}>
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
                trackEvent('recording_topic_select', {
                  type,
                  alarmCategory: item.alarmCategory,
                  koreanName: item.koreanName,
                  title: item.title,
                });
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
