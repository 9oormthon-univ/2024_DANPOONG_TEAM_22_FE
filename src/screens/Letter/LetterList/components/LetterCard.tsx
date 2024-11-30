import ShadowView from '@components/atom/ShadowView';
import Txt from '@components/atom/Txt';
import {LetterResponseData} from '@type/api/providedFile';
import formatDate from '@utils/formatDate';
import {Image, Pressable, View} from 'react-native';

type LetterCardProps = {
  letter: LetterResponseData;
  idx: number;
};

const LetterCard = ({letter, idx}: Readonly<LetterCardProps>) => {
  const imageUri = null;

  return (
    <Pressable className="h-[189]">
      <ShadowView>
        <View className="px-[22] py-[14] justify-between flex-1">
          <View>
            <Txt
              type="body4"
              text={formatDate(letter.createdAt)}
              className="text-gray300 font-[LeeSeoyun-Regular]"
            />
            <Txt
              type="body4"
              text={letter.thanksMessage}
              className="text-white my-[15] text-justify"
            />
          </View>
          <View className="flex-row items-center self-end">
            <Txt
              type="body4"
              text="from."
              className="text-white mr-[8] font-[LeeSeoyun-Regular]"
            />
            <Txt
              type="body4"
              text={letter.alarmType}
              className="text-yellowPrimary font-[LeeSeoyun-Regular]"
            />
            {letter.alarmType !== '위로' && (
              <Txt
                type="body4"
                text="&nbsp;알림"
                className="text-white font-[LeeSeoyun-Regular]"
              />
            )}
            <Txt
              type="body4"
              text="&nbsp;받은"
              className="text-white mr-[5] font-[LeeSeoyun-Regular]"
            />
            <Txt
              type="body4"
              text={`청년${idx + 1}`}
              className="text-white mr-[10]"
            />
            <Image
              source={
                imageUri
                  ? {uri: imageUri}
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

export default LetterCard;
