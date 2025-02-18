import Txt from '@components/atom/Txt';
import {Pressable, View} from 'react-native';

const SkipBar = ({onSkip}: Readonly<{onSkip: () => void}>) => {
  return (
    <View className="flex-row items-center justify-between px-[22] border-b border-b-white/5">
      <Pressable
        className="flex-1 py-[18] flex-row justify-end"
        onPress={onSkip}>
        <Txt type="button" text="건너뛰기" className="text-white " />
      </Pressable>
    </View>
  );
};

export default SkipBar;
