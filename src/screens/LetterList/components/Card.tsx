import Body4 from '@components/atom/body/Body4';
import LeeSeoYunText from '@components/atom/LeeSeoyunText';
import ShadowView from '@components/atom/ShadowView';
import { LetterResponseData } from '@type/providedFile';
import formatDate from '@utils/formatDate';
import { Image, Pressable, View } from 'react-native';

type CardProps = {
  letter: LetterResponseData;
  idx: number;
};

const Card = ({ letter, idx }: Readonly<CardProps>) => {
  const imageUri = null;

  return (
    <Pressable className="h-[189]">
      <ShadowView>
        <View className="px-[22] py-[14] justify-between flex-1">
          <View>
            <LeeSeoYunText text={formatDate(letter.createdAt)} className="text-gray300" />
            <Body4 text={letter.thanksMessage} className="text-white my-[15] text-justify" />
          </View>
          <View className="flex-row items-center self-end">
            <LeeSeoYunText text="from." className="text-white mr-[8]" />
            <LeeSeoYunText text={letter.alarmType} className="text-yellowPrimary" />
            {letter.alarmType !== '위로' && <LeeSeoYunText text="&nbsp;알림" className="text-white" />}
            <LeeSeoYunText text="&nbsp;받은" className="text-white mr-[5]" />
            <Body4 text={`청년${idx + 1}`} className="text-white mr-[10]" />
            <Image
              source={imageUri ? { uri: imageUri } : require('../../../../assets/images/logo/app/app_logo_yellow.png')}
              className="w-[27] h-[27]"
              style={{ borderRadius: 50 }}
            />
          </View>
        </View>
      </ShadowView>
    </Pressable>
  );
};

export default Card;
