import {View} from 'react-native';

import {CustomText} from '@components/CustomText';
import {EMOTION_OPTIONS} from '@constants/letter';
import {type ResultResponseData} from '@type/api/common';
import {type SummaryResponseData} from '@type/api/providedFile';

export const ListHeader = ({
  nickname,
  summaryData,
}: Readonly<{
  nickname: string;
  summaryData: ResultResponseData<SummaryResponseData> | undefined;
}>) => {
  const displayNum = (num: number) => {
    return num > 999 ? '999+' : String(num);
  };

  return (
    <View className="bg-blue700">
      <View className="h-[61]" />
      <CustomText        type="title2"
        text={`${nickname}님의 목소리를`}
        className="text-white px-[30]"
      />
      <View className="flex-row px-[30]">
        <View className="flex-row justify-start items-center">
          <CustomText type="title2" text="청년들이 " className="text-white" />
            <CustomText            type="title2"
            text={`${String(summaryData?.result.totalListeners ?? '')}번`}
            className="text-yellowPrimary"
          />
          <CustomText type="title2" text=" 청취했어요" className="text-white" />
        </View>
      </View>

      <View className="h-[31]" />

      <View className="flex-row items-center px-[30]">
        {EMOTION_OPTIONS.slice(0, 2).map(emotion => (
          <View key={emotion.label} className="flex-row items-center flex-1">
            <View className="flex-row items-center flex-1">
              {emotion.icon}
              <View className="w-[5]" />
              <CustomText type="body3" text={emotion.label} className="text-white" />
              <View className="w-[8]" />
              <CustomText                type="body3"
                text={displayNum(
                  summaryData?.result.reactionsNum[
                    emotion.type as keyof typeof summaryData.result.reactionsNum
                  ] ?? 0,
                )}
                className="text-yellowPrimary"
              />
            </View>
            <View className="w-[41]" />
          </View>
        ))}
      </View>

      <View className="h-[15]" />

      <View className="flex-row items-center px-[30]">
        {EMOTION_OPTIONS.slice(2).map(emotion => (
          <View key={emotion.label} className="flex-row items-center flex-1">
            <View className="flex-row items-center flex-1">
              {emotion.icon}
              <View className="w-[5]" />
              <CustomText type="body3" text={emotion.label} className="text-white" />
              <View className="w-[8]" />
              <CustomText                type="body3"
                text={String(
                  summaryData?.result.reactionsNum[
                    emotion.type as keyof typeof summaryData.result.reactionsNum
                  ] ?? '',
                )}
                className="text-yellowPrimary"
              />
            </View>
            <View className="w-[41]" />
          </View>
        ))}
      </View>
      <View className="h-[45]" />
    </View>
  );
};