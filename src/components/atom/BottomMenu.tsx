import Txt from '@components/atom/Txt';
import {Pressable, View} from 'react-native';

type BottomMenuProps = {
  title?: string;
  children: {title: string; onPress: () => void}[];
};

const BottomMenu = ({title, children}: Readonly<BottomMenuProps>) => {
  return (
    <>
      {title && (
        <View className="h-[43] justify-center items-center">
          <Txt type="caption1" text={title} className="text-gray300" />
        </View>
      )}
      <View className="bg-blue600 h-[1]" />
      {children.map(({title, onPress}, index) => (
        <View key={title}>
          <Pressable
            className="h-[61] justify-center items-center"
            onPress={onPress}>
            <Txt type="body3" text={title} className="text-white" />
          </Pressable>
          {index !== children.length - 1 && (
            <View className="bg-blue600 h-[1]" />
          )}
        </View>
      ))}
    </>
  );
};

export default BottomMenu;
