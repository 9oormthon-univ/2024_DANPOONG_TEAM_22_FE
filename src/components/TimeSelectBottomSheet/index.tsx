import SelectCheckIcon from '@assets/svgs/selectCheck.svg';
import {CustomText} from '@components/CustomText';
import {useEffect, useRef} from 'react';
import {Animated, Pressable, ScrollView, View} from 'react-native';

export const TimeSelectBottomSheet = ({
  type,
  value,
  setValue,
  onClose,
  onSelect,
}: Readonly<{
  type: 'hour' | 'minute';
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  onSelect?: () => void;
}>) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const hourOptions = Array.from({length: 12 * 2}, (_, i) => {
    const period = i < 12 ? '오전' : '오후';
    const hour = i % 12 === 0 ? 12 : i % 12;
    const label = i === 0 ? '오전 12시(자정)' : `${period} ${hour}시`;
    return label;
  });
  const minuteOptions = ['00분', '30분'];

  const titleText = `${type === 'hour' ? '시간' : '분'}을 선택해주세요`;
  const options = type === 'hour' ? hourOptions : minuteOptions;

  const handleOptionClick = (option: string) => {
    setValue(option);
    onClose();
    if (onSelect) onSelect();
  };

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 justify-end px-[30] pb-[27]">
      <Pressable
        className="absolute top-0 left-0 right-0 bottom-0"
        onPress={onClose}
      />
      <Animated.View
        className={`bg-blue500 overflow-hidden ${
          type === 'hour' ? 'h-[474]' : 'h-[220]'
        }`}
        style={{
          borderRadius: 10,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [300, 0],
              }),
            },
          ],
        }}>
        <View className="h-[13]" />

        <View className="items-center">
          <View
            className="h-[4] w-[52] bg-blue300"
            style={{borderRadius: 100}}
          />
        </View>

        <View className="h-[25]" />

        <View className="flex-1 px-[30]">
          <CustomText type="title3" text={titleText} className="text-white" />
          <View className="h-[21]" />

          <ScrollView className="pb-[30]" showsVerticalScrollIndicator={false}>
            {options.map(option => (
              <Pressable
                key={option}
                className="h-[56] flex-row items-center justify-between"
                onPress={() => handleOptionClick(option)}>
                <CustomText                  type="body3"
                  text={option}
                  className={`${
                    value === option ? 'text-yellowPrimary' : 'text-white'
                  }`}
                />
                {value === option && <SelectCheckIcon />}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
};
