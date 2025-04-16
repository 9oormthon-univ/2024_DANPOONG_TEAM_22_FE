import { View } from 'react-native';

import { type AlarmListByCategoryTypeType } from '@apis/VolunteerRecord/get/AlarmListByCategoryType/type';
import { Button } from '@components/Button';
import { CustomText } from '@components/CustomText';
import { ShadowView } from '@components/ShadowView';
import { StarIMG } from '@components/StarIMG';
import { type NavigationProp, useNavigation } from '@react-navigation/native';
import { type HomeStackParamList } from '@type/nav/HomeStackParamList';
import { type RecordType } from '@type/RecordType';
import { trackEvent } from '@utils/tracker';

export const Card = ({
  item,
  gap,
  type,
  width,
}: {
  item: AlarmListByCategoryTypeType;
  gap: number;
  type: RecordType;
  width: number;
}) => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  return (
    <View
      className={'h-full'}
      style={{ marginHorizontal: gap / 2, width: width }}>
      <ShadowView>
        {/* frame */}
        <View className="w-full h-full justify-evenly items-center px-px">
          {/* 별 이미지 */}
          <View className="flex w-full flex-row justify-center items-center">
            <StarIMG />
          </View>
          {/* 제목 head*/}
          <View className="w-full">
            <CustomText
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
                navigation.navigate('RCDNotice', { type, item });
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
