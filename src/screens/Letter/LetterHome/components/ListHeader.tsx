import Txt from '@components/atom/Txt';
import {EMOTION_OPTIONS} from '@constants/letter';
import {ResultResponseData} from '@type/api/common';
import {SummaryResponseData} from '@type/api/providedFile';
import {View} from 'react-native';

const ListHeader = ({
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
    <View>
      <View className="h-[61]" />
      <Txt
        type="title2"
        text={`${nickname}님의 목소리를`}
        className="text-white px-[30]"
      />
      <View className="flex-row px-[30]">
        <View className="flex-row justify-start items-center">
          <Txt type="title2" text="청년들이 " className="text-white" />
          <Txt
            type="title2"
            text={`${String(summaryData?.result.totalListeners ?? '')}번`}
            className="text-yellowPrimary"
          />
          <Txt type="title2" text=" 청취했어요" className="text-white" />
        </View>
      </View>

      <View className="h-[31]" />

      <View className="flex-row items-center px-[30]">
        {EMOTION_OPTIONS.slice(0, 2).map(emotion => (
          <View key={emotion.label} className="flex-row items-center flex-1">
            <View className="flex-row items-center flex-1">
              {emotion.icon}
              <View className="w-[5]" />
              <Txt type="body3" text={emotion.label} className="text-white" />
              <View className="w-[8]" />
              <Txt
                type="body3"
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
              <Txt type="body3" text={emotion.label} className="text-white" />
              <View className="w-[8]" />
              <Txt
                type="body3"
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
    </View>
  );
};

export default ListHeader;
