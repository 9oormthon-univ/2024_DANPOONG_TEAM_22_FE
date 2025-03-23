import MoreDotIcon from '@assets/svgs/moreDot.svg';
import {ShadowView} from '@components/ShadowView';
import {CustomText} from '@components/CustomText';
import {LetterResponseData} from '@type/api/providedFile';
import {formatDate} from '@utils/convertFuncs';
import {Image, Pressable, View} from 'react-native';

type LetterCardProps = {
  letter: LetterResponseData;
  onPressMoreDot?: () => void;
};

export const LetterCard = ({letter, onPressMoreDot}: Readonly<LetterCardProps>) => {
  const renderCategoryText = () => {
    if (letter.alarmType === '위로' || letter.alarmType === '칭찬') {
      return (
        <CustomText          type="body4"
          text=" 받은"
          className="text-white mr-[5] font-[LeeSeoyun-Regular]"
        />
      );
    } else if (letter.alarmType === '우울') {
      return (
        <CustomText          type="body4"
          text="이 해소된 "
          className="text-white font-[LeeSeoyun-Regular]"
        />
      );
    }
    return (
      <CustomText        type="body4"
        text=" 알림 받은"
        className="text-white mr-[5] font-[LeeSeoyun-Regular]"
      />
    );
  };

  return (
    <Pressable className="flex-1 min-h-[153]">
      <ShadowView>
        <View className="px-[20] py-[18] justify-between flex-1">
          <View className="flex-row items-center justify-between">
            <CustomText              type="body4"
              text={formatDate(letter.createdAt)}
              className="text-gray200 font-[LeeSeoyun-Regular]"
            />
            <Pressable className="relative right-[-3]" onPress={onPressMoreDot}>
              <MoreDotIcon />
            </Pressable>
          </View>

          <View className="h-[10]" />

          <CustomText            type="body4"
            text={letter.thanksMessage}
            className="text-white"
          />

          <View className="h-[10]" />

          <View className="flex-row items-center self-end">
            <CustomText              type="body4"
              text="from."
              className="text-white mr-[8] font-[LeeSeoyun-Regular]"
              style={{fontSize: 16}}
            />
            <CustomText              type="body4"
              text={letter.alarmType}
              className="text-yellowPrimary font-[LeeSeoyun-Regular]"
              style={{fontSize: 16}}
            />
            {renderCategoryText()}
            <CustomText              type="body4"
              text={letter?.member?.name ?? ''}
              className="text-white mr-[10] max-w-[140]"
              numberOfLines={1}
            />
            <Image
              source={
                letter?.member?.profileImage
                  ? {uri: letter?.member?.profileImage}
                  : require('@assets/pngs/logo/app/app_logo_yellow.png')
              }
              className="w-[27] h-[27]"
              style={{borderRadius: 50}}
            />
          </View>
        </View>
      </ShadowView>
    </Pressable>
  );
};
